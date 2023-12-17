import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';

export const RefreshToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    const refresh = ctx.req.cookies["REFRESH_TOKEN"]

    if (!refresh) {
        throw new UnauthorizedException("Invalid refresh.");
    }

    return refresh;
});
