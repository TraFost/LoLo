export type ApiResponse = {
  message: string;
  success: boolean;
};

export interface ResponseWithData<T> extends ApiResponse {
  data: T;
}

export interface ErrorBody extends ApiResponse {
  requestId?: string;
  details?: unknown;
}
