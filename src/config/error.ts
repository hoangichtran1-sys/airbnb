import { ErrorCode } from "@/enums/error-code";

export class BusinessError extends Error {
    public status: number;
    public error_code: string;

    constructor(
        message: string,
        status = 500,
        error_code = ErrorCode.INTERNAL_SERVER_ERROR,
    ) {
        super(message);
        this.status = status;
        this.error_code = error_code;
    }
}
