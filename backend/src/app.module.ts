import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './item/item.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [DatabaseModule, ItemModule, MinioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
