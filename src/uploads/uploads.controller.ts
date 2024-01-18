import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
  
@Controller()

export class UploadController {

    constructor(private readonly uploadService: UploadsService) { }
    
    @Get('upload/:folder/:image')
    getImage(@Param('folder') folder: string, @Param('image') image: string, @Res() res: Response) {
        try {
            return this.uploadService.getImage(folder, image, res)
        } catch (error) {
            throw error;
        }
    }
}