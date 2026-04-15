import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('GlobalExceptionFilter');

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        // const request = ctx.getRequest();
        console.log(exception);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Extract message from the exception response
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                // Handle both single message and array of messages
                message = (exceptionResponse as any).message || exception.message;
            } else {
                message = exception.message;
            }
        } else if (exception.code === '23505') {
            // Postgres unique violation
            status = HttpStatus.BAD_REQUEST;
            message = exception.detail || 'Duplicate entry';
        }

        this.logger.error(
            `Status: ${status} Error: ${JSON.stringify(message)}`,
            exception.stack,
        );

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
}
