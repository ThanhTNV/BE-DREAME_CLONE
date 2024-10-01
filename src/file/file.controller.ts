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

  // @Post('upload')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'avatar', maxCount: 1 },
  //     { name: 'background', maxCount: 1 },
  //   ]),
  // )
  // async uploadFile(
  //   @Body() body: any,
  //   @UploadedFiles(new ParseFilePipe({}))
  //   file: {
  //     avatar?: Express.Multer.File[];
  //     background?: Express.Multer.File[];
  //   },
  // ) {
  //   console.log(file);
  //   return file.avatar[0].buffer.toString('utf8');
  //   // return this.fileService.uploadFile(file);
  // }

  @Post('upload') //  <input type="file" id="upload" name="upload">
  @UseInterceptors(FileInterceptor('upload'))
  async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.uploadFile(file);
  }

  // @Get('read')
  // readXlsxFileToJSON() {
  //   throw new NotImplementedException();
  //   const file = fs.readFileSync(
  //     path.join(__dirname, '..', 'uploads', 'SheetJSNest.xlsx'),
  //   );
  //   // const data = this.fileService.readXlsxFileToJSON();
  // }

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="SheetJSNest.xlsx"')
  async downloadXlsxFile(): Promise<StreamableFile> {
    return await this.fileService.downloadFile();
  }
}
