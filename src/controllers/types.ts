export enum ErrorStatus {
  connerr = 'connection error',
  sererr = 'server error',
  valerr = 'validation error',
}

export interface ValidationError {
  param: string
  msg: string
}

export interface ServerError {
  msg: string
  [id: string]: string
}

export interface ServerSuccessResponse<T> {
  status: string
  message: T
  token?: string
}

export interface ServerErrorResponse<T> {
  status: T extends ErrorStatus.valerr
    ? ErrorStatus.valerr
    : T extends ErrorStatus.connerr
      ? ErrorStatus.connerr
      : ErrorStatus.sererr
  message?: string
  errors: T extends ErrorStatus.valerr
    ? ValidationError[]
    : ServerError
}
