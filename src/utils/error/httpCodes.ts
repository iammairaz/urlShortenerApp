type IHttpCodes = {
    [key:number]: string;
}

const httpResponseCodes: IHttpCodes = {
    200: "OK",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error"
}

export default httpResponseCodes;