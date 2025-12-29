// src/file/file.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid'; // For generating unique filenames

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Specify the directory to save files
        filename: (req, file, cb) => {
          // Generate a unique filename
          const randomName = uuid();
          const newFileName = `${randomName}${extname(file.originalname)}`;
          cb(null, newFileName);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 },
      // You can add other Multer options here, e.g., limits, fileFilter
      // limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
      // fileFilter: (req, file, cb) => {
      //   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      //     return cb(new Error('Only image files are allowed!'), false);
      //   }
      //   cb(null, true);
      // },
    }),
  ],
  controllers: [FileController],
  // ... other module configurations (controllers, providers, exports)
})
export class FileModule {}
