import {
    Body,
    Controller,
    Delete,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { KeyFileDto } from './dto/key-file-dto';
  
@Controller()
export class UploadController {

    constructor(private readonly uploadService: UploadsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            return this.uploadService.uploadFile(file);
        } catch (error) {
            throw error;
        }
    }

    @Delete('upload')
    delete(@Body() dto: KeyFileDto) {
        try {
            return this.uploadService.deleteFile(dto.key)
        } catch (error) {
            throw error;
        }
    }
}