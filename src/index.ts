import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './utils/loger';
import { loggingHandler } from './middlewares/loggingHandler';
import { routeNotFound } from './middlewares/routeNotFound';
import { rateLimiter } from './middlewares/rateLimiting';
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Log all routes
app.use(loggingHandler);

app.get('/hi', rateLimiter, (req: Request, res: Response) => {
  res.status(200).json(`Express`);
});

//Log not found routes
app.use(routeNotFound);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
