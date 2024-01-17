import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { KeyFileDto } from './dto/key-file-dto';
import { Response } from 'express';
  
@Controller()
export class UploadController {

    constructor(private readonly uploadService: UploadsService) {}

    @Post('upload/:directory')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Param('directory') directory: string) {
        try {
            return this.uploadService.uploadImage(file, directory);
        } catch (error) {
            throw error;
        }
    }

    @Get('upload/:folder/:image')
    getImage(@Param('folder') folder: string, @Param('image') image: string, @Res() res: Response) {
        try {
            return this.uploadService.getImage(folder, image, res)
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