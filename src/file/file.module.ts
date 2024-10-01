import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
