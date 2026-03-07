import { Request } from 'express';

export interface CurrentOrgId extends Request {
  currentOrgId: string;
}
