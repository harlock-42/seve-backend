import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import ProjectsModule from './projects/projects.module';
import ImagesModule from './images/images.module';
import { Project } from './projects/entities/projects.entity';
import { LoggerMiddleware } from './logger.middleware';
import MailModule from './mail/mail.module';
import { Company } from './companies/entities/companies.entity';
import { Contract } from './contracts/entities/contracts.entity';
import ProjectModule from './projects/projects.module';
import { ContractModule } from './contracts/contracts.module';
import { AuthModule } from './auth/auth.module';
import { Address } from './address/address.entity';
import AddressModule from './address/address.module';
import { Token } from './token/token.entity';
import { TokenModule } from './token/token.module';
import { PdfFile } from './contracts/entities/pdfFiles.entity';
import { News } from './contracts/entities/news.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Project,
          Company,
          Contract,
          Address,
          Token,
          PdfFile,
          News
        ],
        synchronize: true,
      }),
    }),
    ProjectsModule,
    ImagesModule,
    MailModule,
    ProjectModule,
    ContractModule,
    AuthModule,
    AddressModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			.forRoutes({
				path: '*',
				method: RequestMethod.ALL
			})
	}
}
