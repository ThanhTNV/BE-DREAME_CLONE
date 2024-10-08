import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  NotImplementedException,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from './file.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { read, utils, write } from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

@Controller('file')
@ApiTags('File')
// @UseGuards(AuthGuard('api-key'))
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="SheetJSNest.xlsx"')
  async downloadXlsxFile(): Promise<StreamableFile> {
    return await this.fileService.downloadFile();
  }

  @Post('upload') //  <input type="file" id="upload" name="upload">
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(FileInterceptor('upload'))
  async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.uploadFile(file);
  }
}
