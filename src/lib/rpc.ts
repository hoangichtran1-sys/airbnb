import type { App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

export const eden = treaty<App>(process.env.NEXT_PUBLIC_APP_URL!).api;
