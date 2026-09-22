import { ISchool } from '../modules/schools/school.model';

declare global {
  namespace Express {
    interface Request {
      school?: ISchool;
    }
  }
}

export {};