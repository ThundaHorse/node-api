import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, Span } from '@opentelemetry/sdk-trace-node';

export class TraceService {
  private static instance: TraceService;

  private constructor() {
    // Private constructor to enforce singleton pattern
    if (TraceService.instance) {
      throw new Error('Use TraceService.getInstance() to access the service.');
    }
    TraceService.instance = this;
  }
  /**
   * @description Returns the singleton instance of TraceService.
   * @returns {TraceService} The singleton instance of TraceService.
   */
  static getInstance(): TraceService {
    if (!TraceService.instance) {
      TraceService.instance = new TraceService();
    }
    return TraceService.instance;
  }

  /**
   * @description Returns the OpenTelemetry tracer for this service.
   * @returns {api.Tracer} The OpenTelemetry tracer instance.
   */
  public getTracer() {
    return trace.getTracer('node-api-service');
  }

  /**
   * @description Returns the current active span in the context.
   * @returns {api.Span | undefined} The current active span, or undefined if no span is active.
   */
  public getCurrentSpan() {
    return trace.getSpan(context.active());
  }

  /**
   * @description Starts a new span for tracing.
   * @param {string} name - The name of the span.
   * @param {api.SpanKind} status - The kind of the span.
   * @param {Record<string, unknown>} [attributes] - Optional attributes to attach to the span.
   * @returns {api.Span} The created span.
   */
  public startSpan(
    name: string,
    status: SpanKind,
    attributes?: Record<string, unknown>
  ) {
    return this.getTracer().startSpan(name, {
      kind: status,
      attributes: {
        'http.method': 'GET',
        'http.url': '/',
        'http.host': 'localhost',
        ...attributes
      }
    });
  }

  /**
   * @description Sets the API context for a span.
   * @param {api.Span} span - The span to set the context for.
   * @param {api.SpanStatusCode} status - The status code to set.
   */
  public setApiContext(span: Span, status: SpanStatusCode) {
    return context.with(trace.setSpan(context.active(), span), () => {
      span.setStatus({ code: status });
      span.end();
    });
  }

  /**
   * @description Sets the status of a span and ends it.
   * @param {api.Span} span - The span to set the status for.
   * @param {api.SpanStatusCode} status - The status code to set.
   * @param {string} [message] - Optional message to attach to the status.
   */
  public setStatus(span: Span, status: SpanStatusCode, message?: string) {
    span.setStatus({ code: status, message });
    span.end();
  }
}
