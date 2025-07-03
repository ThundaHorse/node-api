import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'Express Typescript',
      version: '1.0'
    },
    tags: [
      {
        name: 'tasks'
      },
      {
        name: 'countries'
      }
    ],
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    paths: {
      '/v1/countries': {
        get: {
          operationId: 'GetCountries',
          tags: ['countries'],
          responses: {
            '200': {
              description: 'Successfully retrieved all countries',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AllCountries'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/countries/{:countryId}': {
        get: {
          operationId: 'GetCountry',
          parameters: [
            {
              in: 'path',
              name: ':countryId',
              required: true,
              schema: {
                type: 'string',
                maxLength: 50,
                example: 'South Korea',
                description: 'Country Name'
              }
            }
          ],
          tags: ['countries'],
          responses: {
            '200': {
              description: 'Successfully retrieved country',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Country'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks': {
        get: {
          operationId: 'GetTasks',
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully retrieved all tasks',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AllTasks'
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks/completed': {
        get: {
          operationId: 'CompletedTasks',
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully retrieved all completed tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    maxItems: 255,
                    items: {
                      $ref: '#/components/schemas/Task'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks/incomplete': {
        get: {
          operationId: 'IncompleteTasks',
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully retrieved all incomplete tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    maxItems: 255,
                    items: {
                      $ref: '#/components/schemas/Task'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks/{:getTaskId}': {
        get: {
          operationId: 'GetTask',
          parameters: [
            {
              in: 'path',
              name: ':getTaskId',
              required: true,
              schema: {
                type: 'string',
                maxLength: 50,
                example: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
                description: 'Task ID'
              }
            }
          ],
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully retrieved tasks',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks/{:taskId}': {
        patch: {
          operationId: 'UpdateTask',
          description: 'Update a task by ID',
          parameters: [
            {
              in: 'path',
              name: ':taskId',
              required: true,
              schema: {
                type: 'string',
                maxLength: 50,
                example: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
                description: 'Task ID'
              }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string'
                    },
                    description: {
                      type: 'string'
                    },
                    completed: {
                      type: 'boolean'
                    }
                  }
                }
              }
            }
          },
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully updated task',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      },
      '/v1/tasks/{:deleteTaskId}': {
        delete: {
          operationId: 'GetTask',
          parameters: [
            {
              in: 'path',
              name: ':deleteTaskId',
              required: true,
              schema: {
                type: 'string',
                maxLength: 50,
                example: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
                description: 'Task ID'
              }
            }
          ],
          tags: ['tasks'],
          responses: {
            '200': {
              description: 'Successfully deleted tasks',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            },
            '400': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NotFound'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        NotFound: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Requested resource not found'
            }
          }
        },
        AllTasks: {
          type: 'array',
          maxItems: 255,
          items: {
            type: 'object',
            properties: {
              Task: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              maxLength: 50,
              example: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
              description: 'Task ID'
            },
            title: {
              type: 'string',
              description: 'Task Title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            completed: {
              type: 'boolean',
              description: 'Task completed status'
            },
            createdAt: {
              type: 'string',
              description: 'Task creation time',
              example: '2025-07-02T01:12:41.417Z'
            }
          },
          additionalProperties: false
        },
        Country: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            region: {
              type: 'string'
            },
            population: {
              type: 'integer'
            },
            languages: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            flagUrl: {
              type: 'string'
            }
          }
        },
        AllCountries: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Country'
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export default swaggerOptions;
