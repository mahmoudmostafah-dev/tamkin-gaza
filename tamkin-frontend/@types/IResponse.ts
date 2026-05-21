export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAction {
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  query?: Record<string, any>;
  description?: string;
}

export interface IError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface IResponse<T> {
  message: string;
  success: boolean;
  data: T;
  error?: IError;
  statusCode?: number;
  actions?: IAction[];
  pagination?: IPagination;
}
