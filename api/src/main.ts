import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS for the React frontend
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:4173'],
        credentials: true,
    });
    // Define un prefijo global a las rutas
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            // ! Remueve los datos que van de más en el body de la request
            // ! Y unicamente envía lo que se ha especificado en el DTO
            whitelist: true,

            // ! Si hay datos de más en el body de la request tira un error
            // ! Indicando que la propiedad no debería de existir
            forbidNonWhitelisted: true,

            // ! Excluye los campos undefined
            transformOptions: {
                exposeUnsetFields: false,
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
