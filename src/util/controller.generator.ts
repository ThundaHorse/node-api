import { Request, Response, NextFunction } from 'express';
import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { TraceService } from './TraceService';
import { ConsoleSpanExporter, Span } from '@opentelemetry/sdk-trace-node';
import { NodeSDK } from '@opentelemetry/sdk-node/build/src/sdk';

// Define base interface for all models
interface BaseModel {
  id: string;
  completed?: boolean; // Optional field for tasks
}

// Controller method types
type ControllerMethod = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Configuration for each controller method
interface MethodConfig {
  path: string;
  method: HttpMethod;
  spanName: string;
  successCode: number;
}

/**
 * @description ControllerGenerator class to generate CRUD operations for a given entity.
 * @template T - The type of the model this controller will manage.
 */
export class ControllerGenerator<T extends BaseModel> {
  private tracerService: TraceService;
  private items: T[];
  private entityName: string;
  private sdk: NodeSDK;

  /**
   * @description Creates a new instance of ControllerGenerator.
   * @param {string} entityName - The name of the entity this controller manages.
   * @param {T[]} items - The initial items for the entity.
   * @param {TraceService} tracerService - The tracing service instance.
   */
  constructor(entityName: string, items: T[], tracerService: TraceService) {
    this.entityName = entityName;
    this.items = items;
    this.tracerService = tracerService;

    this.sdk = new NodeSDK({
      traceExporter: new ConsoleSpanExporter(),
      serviceName: 'node-api-service'
    });

    this.sdk.start();
  }

  /**
   * Generates a wrapped controller method with tracing
   */
  private generateTracedMethod(
    config: MethodConfig,
    handler: (req: Request, res: Response) => Promise<any>
  ): ControllerMethod {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const span = this.tracerService.startSpan(
        config.spanName,
        SpanKind.SERVER,
        {
          'http.method': config.method,
          'http.route': config.path,
          'http.target': req.url,
          'http.host': req.hostname,
          'http.body': req.body ? JSON.stringify(req.body) : undefined,
          'entity.name': this.entityName
        }
      );

      try {
        // Set the active context with the span
        await context.with(trace.setSpan(context.active(), span), async () => {
          await handler(req, res);
        });

        this.tracerService.setApiContext(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.OK
        );
      } catch (error) {
        this.tracerService.setStatus(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.ERROR,
          error instanceof Error ? error.message : 'Unknown error'
        );
        next(error);
      } finally {
        span.end();
        console.log(`Span ended: ${config.spanName}`, {
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId
        });
      }
    };
  }

  /**
   * Generates getAll method
   */
  public generateGetAll(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}`,
        method: 'GET',
        spanName: `getAll${this.entityName}`,
        successCode: 200
      },
      async (req: Request, res: Response) => {
        res.status(200).json(this.items);
      }
    );
  }

  /**
   * Generates getById method
   */
  public generateGetById(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}/:id`,
        method: 'GET',
        spanName: `get${this.entityName}ById`,
        successCode: 200
      },
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const item = this.items.find((item) => item.id === id);

        if (!item) {
          res.status(404).json({ message: `${this.entityName} not found` });
          this.tracerService.setStatus(
            this.tracerService.getCurrentSpan() as Span,
            SpanStatusCode.ERROR,
            `${this.entityName} with id ${id} not found`
          );
          return;
        }

        res.status(200).json(item);
        this.tracerService.setStatus(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.OK
        );
      }
    );
  }

  /**
   * Generates create method
   */
  public generateCreate(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}`,
        method: 'POST',
        spanName: `create${this.entityName}`,
        successCode: 201
      },
      async (req: Request, res: Response) => {
        const newItem = req.body as T;
        this.items.push(newItem);
        res.status(201).json(newItem);
        this.tracerService.setStatus(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.OK
        );
      }
    );
  }

  /**
   * Generates update method
   */
  public generateUpdate(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}/:id`,
        method: 'PUT',
        spanName: `update${this.entityName}`,
        successCode: 200
      },
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const itemIndex = this.items.findIndex((item) => item.id === id);

        if (itemIndex === -1) {
          res.status(404).json({ message: `${this.entityName} not found` });
          this.tracerService.setStatus(
            this.tracerService.getCurrentSpan() as Span,
            SpanStatusCode.ERROR,
            `${this.entityName} with id ${id} not found`
          );
          return;
        }

        const updatedItem = { ...this.items[itemIndex], ...req.body };
        this.items[itemIndex] = updatedItem;
        res.status(200).json(updatedItem);
        this.tracerService.setStatus(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.OK
        );
      }
    );
  }

  /**
   * Generates delete method
   */
  public generateDelete(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}/:id`,
        method: 'DELETE',
        spanName: `delete${this.entityName}`,
        successCode: 204
      },
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const itemIndex = this.items.findIndex((item) => item.id === id);

        if (itemIndex === -1) {
          res.status(404).json({ message: `${this.entityName} not found` });
          this.tracerService.setStatus(
            this.tracerService.getCurrentSpan() as Span,
            SpanStatusCode.ERROR,
            `${this.entityName} with id ${id} not found`
          );
          return;
        }

        this.items.splice(itemIndex, 1);
        res.status(204).send();
        this.tracerService.setStatus(
          this.tracerService.getCurrentSpan() as Span,
          SpanStatusCode.OK
        );
      }
    );
  }

  /**
   * Generates methods to get completed and incomplete tasks
   */
  public generateCompletedTasks(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}/completed`,
        method: 'GET',
        spanName: `getCompleted${this.entityName}`,
        successCode: 200
      },
      async (req: Request, res: Response) => {
        const completedTasks = this.items.filter(
          (item) => item.completed === true
        );
        res.status(200).json(completedTasks);
      }
    );
  }

  /**
   * Generates methods to get incomplete tasks
   */
  public generateIncompleteTasks(): ControllerMethod {
    return this.generateTracedMethod(
      {
        path: `/${this.entityName}/incomplete`,
        method: 'GET',
        spanName: `getIncomplete${this.entityName}`,
        successCode: 200
      },
      async (req: Request, res: Response) => {
        const incompleteTasks = this.items.filter(
          (item) => item.completed === false
        );
        res.status(200).json(incompleteTasks);
      }
    );
  }

  /**
   * Generates all CRUD methods for the controller
   */
  public generateAll(): ControllerMethod[] {
    return [
      this.generateGetAll(),
      this.generateGetById(),
      this.generateCreate(),
      this.generateUpdate(),
      this.generateDelete(),
      this.generateCompletedTasks(),
      this.generateIncompleteTasks()
    ];
  }

  public startSpan(
    name: string,
    kind: SpanKind,
    attributes?: Record<string, unknown>
  ) {
    const currentSpan = this.tracerService.getCurrentSpan();
    const ctx = currentSpan
      ? trace.setSpan(context.active(), currentSpan)
      : undefined;

    const span = this.tracerService.getTracer().startSpan(
      name,
      {
        kind,
        attributes: {
          ...attributes,
          'service.name': 'node-api-service'
        }
      },
      ctx
    );

    // Add more detailed logging
    console.log(`Started span: ${name}`, {
      traceId: span.spanContext().traceId,
      spanId: span.spanContext().spanId
    });

    return span;
  }
}
