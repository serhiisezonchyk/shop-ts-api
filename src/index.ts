import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { loggingHandler } from './middlewares/loggingHandler';
import { routeNotFound } from './middlewares/routeNotFound';
import router from './routes/index';
import './utils/env';
import './utils/loger';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Log all routes
app.use(loggingHandler);

// app.get('/hi', rateLimiter, (req: Request, res: Response) => {
//   res.status(200).json(`Express`);
// });

app.use('/api', router);

//Log not found routes
app.use(routeNotFound);

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
