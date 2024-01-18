import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadController } from './uploads.controller'

@Module({
    providers: [UploadsService],
    controllers: [UploadController],
})
export class UploadsModule {}