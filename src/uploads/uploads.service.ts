import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from 'express-fileupload';
import * as mimeTypes from 'mime-types';
import { Response } from 'express';
import axios from 'axios';
import { ImageEntity } from './entity/Image-entity';
import { Message } from '../common/global-endity/message-endity'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
    private readonly AWS_S3_BUCKET: string = process.env.AWS_BUCKET;
    private readonly LocationConstraint: string = process.env.AWS_REGION;
    private readonly s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    async uploadImage(file: Upload, directory: string): Promise<ImageEntity>  {

        if (!file || !file.buffer) {
            throw new BadRequestException('No file data found.');
        }
        
        const mimeType = mimeTypes.lookup(file.originalname);
        
        if (!mimeType || !mimeType.startsWith('image/')) {
            throw new BadRequestException('Invalid file format. Only images are allowed.');
        }
    
        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, file.mimetype, directory);
    }

    private async s3_upload(file: Buffer, bucket: string, mimetype: string, directory: string): Promise<ImageEntity> {
        const keyFile = `image_${uuidv4()}.${mimetype.split('/')[1] || 'jpg'}`;

        const params = {
            Bucket: bucket,
            Key: `${directory}/${String(keyFile)}`,
            Body: file,
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: this.LocationConstraint,
            },
        };

        try {
            await this.s3.send(new PutObjectCommand(params));
            return { image: params.Key };
        } catch (error) {
            throw error;
        }
    }

    async getImage(folder: string, image: string, res: Response): Promise<void> {
        const s3Url = `https://${this.AWS_S3_BUCKET}.s3.${this.LocationConstraint}.amazonaws.com/${folder}/${image}`;
    
        const response = await axios.get(s3Url, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
    
        res.set('Content-Type', contentType);
    
        const contentLength = response.headers['content-length'];

        if (contentLength) {
          res.set('Content-Length', contentLength);
        }
    
        res.send(response.data);
    }

    async deleteFile(key: string): Promise<Message>  {
        const params = { Bucket: this.AWS_S3_BUCKET, Key: key };

        try {
            await this.s3.send(new DeleteObjectCommand(params));
            return { success: true, message: 'File deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}