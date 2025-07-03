import { api } from '@opentelemetry/sdk-node';
import { NextFunction, Request, Response } from 'express';

export const injectOpenTelemetry = (
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  const tracer = api.trace.getTracer('node-api-service');
  const span = tracer.startSpan('http_request', {
    kind: api.SpanKind.SERVER,
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.host': req.hostname,
      'http.body': req.body ? JSON.stringify(req.body) : undefined
    }
  });

  // Set the span in the request context
  api.context.with(api.trace.setSpan(api.context.active(), span), () => {
    if (next) {
      next();
    } else {
      res.end();
    }
  });

  // End the span when the response is sent
  res.on('finish', () => {
    span.setAttribute('http.status_code', res.statusCode);
    span.end();
  });
};
