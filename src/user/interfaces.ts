import { Bans, Token, User } from "@prisma/client";

export interface FullUser extends User{
    sessions: Token[]
    bans: Bans[]
}