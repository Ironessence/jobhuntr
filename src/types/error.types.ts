export type ApiError =
  | {
      error: string;
      status?: number;
    }
  | Response
  | Error;
