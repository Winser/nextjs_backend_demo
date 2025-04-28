class HttpException extends Error {
    errorCode: number;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(errorCode: number, public readonly message: string | any) {
        super(message);
        this.errorCode = errorCode;
    }
}

export default HttpException;