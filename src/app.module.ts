import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './core/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserInterceptor } from './core/Interceptors/user.interceptor';
import { ExceptionMiddleware } from './core/middleware/exception.middleware';
import { ResponseMiddleware } from './core/middleware/response.middleware';
import { AuthGuard } from './core/guards/auth.guards';
import { DigiflazzModule } from './digiflazz/digiflazz.module';

@Module({
  imports: [
    AuthModule,
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    DigiflazzModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionMiddleware,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
