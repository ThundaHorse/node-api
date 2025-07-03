import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions';

const consoleExporter = new ConsoleSpanExporter();

export const sdk = new NodeSDK({
  // Add a resource to identify your service
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'node-api-service',
    [ATTR_SERVICE_VERSION]: '1.0.0'
  }),
  // Use automatic instrumentation to automatically capture traces
  instrumentations: [getNodeAutoInstrumentations()],
  // Use the console exporter to print traces to the console
  traceExporter: consoleExporter
});

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
