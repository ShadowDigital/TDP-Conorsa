import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for local frontends and allow credentials
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl requests)
            if (!origin) return callback(null, true);

            // Allow localhost and development origins
            const allowedOrigins = [
                'http://localhost:5173',
                'http://localhost:3000',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:3000',
                process.env.FRONTEND_URL, // Lee el dominio desde el .env
            ];

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    // Define un prefijo global a las rutas
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Register Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('Base API example')
        .setDescription('Base API')
        .setVersion(process.env.VERSION!)
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
