import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UploadPdfDto } from './contracts/dtos/uploadPdf.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
	origin: (origin, callback) => {
    const whiteList = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3001/api',
      'https://seve.harlock.fr',
      'http://seve.harlock.fr',
      'https://api.seve.harlock.fr',
      'http://api.seve.harlock.fr',
      'https://api.seve.harlock.fr/api',
      'http://api.seve.harlock.fr/api',
      '*'
    ]
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
	allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, x-api-secret',
	methods: 'GET, POST, PUT, DELETE, OPTIONS',
  })

  // Swagger's configuration
  const config = new DocumentBuilder()
    .setTitle('Seve API')
    .setDescription("Documentatio of Seve's API")
    .setVersion('1.0')
	.addSecurity('x-api-secret', {
		type: 'apiKey',
		in: 'header',
		name: 'x-api-secret',
	  })
    .addTag('nestjs')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        },
        'access-token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      UploadPdfDto
    ]
  });
  SwaggerModule.setup('api', app, document);

  // await app.listen(3001);
  await app.listen(process.env.PORT);
}
bootstrap();
