/**
 * Response Basic Handle
 */
export interface HttpResponse {
  errorCode: string | number;
  errorMsg: string;
  data?: any;
}

/**
 * Response Server Exception
 */
export interface HttpResponseException {
  message: string;
  code?: string | number;
  stack?: string;
}
