import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import statusMonitor from 'express-status-monitor';
import taskRoutes from './routes/taskRoutes';
import countryRoutes from './routes/countryRoutes';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swaggerOptions';

const app = express();
const PORT = process.env.PORT || 3000;

// Generate Swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", 'localhost'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com/'],
    },
  })
);
app.use(statusMonitor());
app.use(compression());
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/v1/tasks', taskRoutes);
app.use('/v1/countries', countryRoutes);
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/v1/api-docs`);
});
