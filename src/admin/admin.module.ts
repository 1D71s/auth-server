import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { UserModule } from "@src/user/user.module";

@Module({
      providers: [AdminResolver, AdminService],
      imports: [
            UserModule
      ]
})
export class AdminModule {}
