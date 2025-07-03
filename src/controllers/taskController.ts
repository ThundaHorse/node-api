import { ControllerGenerator } from '../util/controller.generator';
import { Task } from '../util/types';
import { tasks } from '../config/tempDatabase';
import { TraceService } from '../util/TraceService';

/**
 * @description TaskController class to handle CRUD operations for tasks.
 * It uses ControllerGenerator to create methods for task management.
 * * @class TaskController
 * @extends ControllerGenerator<Task>
 * @param {TraceService} tracerService - The tracing service instance for OpenTelemetry.
 * @example
 * const taskController = new TaskController(TraceService.getInstance());
 */
class TaskController extends ControllerGenerator<Task> {
  /**
   * @description Creates a new instance of TaskController.
   * @param {TraceService} tracerService - The tracing service instance for OpenTelemetry.
   */
  private readonly generator: ControllerGenerator<Task>;

  /**
   * @description Initializes the TaskController with a ControllerGenerator for tasks.
   * @param {TraceService} tracerService - The tracing service instance for OpenTelemetry.
   */
  // constructor(tracerService: TraceService) {
  //   this.generator = new ControllerGenerator<Task>(
  //     'tasks',
  //     tasks,
  //     tracerService
  //   );
  // }
  constructor(tracerService: TraceService) {
    super('tasks', tasks, tracerService);
    this.generator = new ControllerGenerator<Task>(
      'tasks',
      tasks,
      tracerService
    );
  }

  /**
   * @description Generates all CRUD methods for task management.
   * @returns {Object} An object containing all generated methods.
   */
  public generateAllMethods() {
    return {
      getAll: this.generator.generateGetAll(),
      getById: this.generator.generateGetById(),
      createTask: this.generator.generateCreate(),
      updateTask: this.generator.generateUpdate(),
      deleteTask: this.generator.generateDelete(),
      getCompleted: this.generator.generateCompletedTasks(),
      getIncomplete: this.generator.generateIncompleteTasks()
    };
  }
}

export default new TaskController(TraceService.getInstance());
