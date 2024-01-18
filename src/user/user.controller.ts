import { Body, Controller, Delete, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from '@app/common/decorators/getData/getuser-decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth-guard';
import { JwtPayloadUser } from '@src/auth/iterfaces';
  
@Controller()
export class UserController {
    
    constructor(private readonly userService: UserService) {}

    @Post('upload/avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    changeAvatar(@User() user: JwtPayloadUser, @UploadedFile() file: Express.Multer.File) {
        try {
            return this.userService.changeAvatar(user.id, file);
        } catch (error) {
            throw error;
        }
    }

    @Delete('upload')
    @UseGuards(JwtAuthGuard)
    deleteAvatar(@User() user: JwtPayloadUser) {
        try {
            return this.userService.deleteAvatar(user.id);
        } catch (error) {
            throw error;
        }
    }
}