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
import swaggerSpec from './swaggerOptions';

const app = express();
const PORT = process.env.PORT || 3000;

// Generate Swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", 'localhost'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
    },
  })
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(statusMonitor());

// --- Routes ---
app.use('/tasks', taskRoutes);
app.use('/countries', countryRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
