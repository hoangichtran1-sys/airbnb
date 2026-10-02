import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";
import { app as serverApp } from "@/app/api/[[...slugs]]/route";

export const eden =
    typeof process === undefined
        ? treaty(serverApp).api
        : treaty<App>(process.env.NEXT_PUBLIC_APP_URL!).api;
