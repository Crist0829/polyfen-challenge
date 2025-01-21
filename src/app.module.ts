import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProspectsModule } from './prospects/prospects.module';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
  }), 
  MongooseModule.forRoot(`mongodb://mongodb:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, {
  }),
  ProspectsModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
