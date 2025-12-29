/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/file/file.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Import for type safety
import { AdminGuard } from 'src/modules/iam/guards/admin/admin.guard';
import { SessionGuard } from 'src/modules/iam/guards/session/session.guard';

@Controller('files')
export class FileController {
  @UseGuards(SessionGuard, AdminGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name from the form-data
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(1001, file); // Access file details
    return {
      message: 'success',
      filename: file.filename,
    };
  }
}
