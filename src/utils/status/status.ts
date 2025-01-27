export class APIResponse {
    public status: any;
    public message: any;
    constructor(status = 200, message = '') {
        this.status = status;
        this.message = message;
    }
}

export class ResponseWithObject {
    public status: any;
    public message: any;
    public details: any;
    constructor(status = 200, message = '', details = {}) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
}