import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist:true,
		})
	);

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The ft_transcendence API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)


  await app.listen(3000);
}
bootstrap();
