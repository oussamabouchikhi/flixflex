import { User } from '../users/schemas/user.schema';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
