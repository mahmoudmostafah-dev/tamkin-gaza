import { IUser } from '../Interfaces/User/user.interface';
import { IDecoded } from './token.types';

export interface I_Request extends Request {
  user?: IUser;
  decoded: IDecoded;
}
