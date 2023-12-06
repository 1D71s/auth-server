import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RefreshToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    return ctx.req.cookies["REFRESH_TOKEN"];
});
