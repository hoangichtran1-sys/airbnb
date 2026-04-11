import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { JotaiProvider } from "@/providers/jotai-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const font = Nunito({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Airbnb App",
    description: "Airbnb app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${font.className} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <NuqsAdapter>
                    <QueryProvider>
                        <JotaiProvider>
                            <AuthProvider />
                            <Toaster />
                            {children}
                        </JotaiProvider>
                    </QueryProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
