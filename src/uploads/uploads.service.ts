import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from 'express-fileupload';

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

    async uploadFile(file: Upload) {
        if (!file || !file.buffer) {
            throw new BadRequestException('No file data found.');
        }
    
        const { originalname } = file;

        return await this.s3_upload(
            file.buffer,
            this.AWS_S3_BUCKET,
            originalname,
            file.mimetype,
        );
    }

    private async s3_upload(file: Buffer, bucket: string, name: string, mimetype: string) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: this.LocationConstraint,
            },
        };

        try {
            const s3Response = await this.s3.send(new PutObjectCommand(params));
            return s3Response;
        } catch (e) {
            throw e;
        }
    }

    async deleteFile(key: string) {
        const params = {
            Bucket: this.AWS_S3_BUCKET,
            Key: key,
        };

        try {
            const s3Response = await this.s3.send(new DeleteObjectCommand(params));
            return s3Response;
        } catch (e) {
            if (e.name === 'NoSuchKey') {
                throw new NotFoundException('File not found.');
            }
            throw e;
        }
    }
}