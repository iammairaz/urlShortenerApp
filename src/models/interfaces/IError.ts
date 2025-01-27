export interface IResponse {
    status?: number;
}
export interface IError {
    status: number | undefined;
    response?: IResponse;
    message?: string
}