import { UserRecord } from "firebase-admin/lib/auth/user-record";

declare module "express-serve-static-core" {
    export interface Locals {
        user: UserRecord | null | undefined;
    }
}
