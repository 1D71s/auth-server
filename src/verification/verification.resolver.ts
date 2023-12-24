import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { VerificationService } from './verification.service';
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { CodeDto } from "@src/verification/dto/code-dto";

@Resolver()
@UseGuards(JwtAuthGuard)
export class VerificationResolver {
    constructor(private readonly verificationService: VerificationService) {}

    @Mutation(() => Boolean)
    sendCode(@User() user: JwtPayloadUser) {
        try {
            return this.verificationService.sendConfirmCode(user);
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Boolean)
    confirmEmail(@Args('input') dto: CodeDto, @User() user: JwtPayloadUser) {
        try {
            return this.verificationService.confirmEmail(dto.code, user);
        } catch (error) {
            throw error;
        }
    }
}
