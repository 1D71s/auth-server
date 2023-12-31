import { AttemptType } from "@prisma/client";

export interface AttemptTypes {
    userId: string,
    where: AttemptType,
    user_agent: string,
}