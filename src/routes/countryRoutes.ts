import { Router } from 'express';
import {
  getAllCountries,
  getCountryByName,
} from '../controllers/countryController';
import {
  cacheAllMiddleware,
  cacheSingleMiddleware,
} from '../middleware/cachingMiddleware';

const countryRouter = Router();

countryRouter.route('/').get(cacheAllMiddleware, getAllCountries);
countryRouter.route('/:id').get(cacheSingleMiddleware, getCountryByName);

export default countryRouter;
