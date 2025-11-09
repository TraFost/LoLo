export interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
  data?: {
    message?: string;
  };
  message?: string;
}
