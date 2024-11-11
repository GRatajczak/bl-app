import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sections/AppSidebar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Blokline App",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarTrigger className="self-start" />
                    <main className="flex p-10 size-full">{children}</main>
                </SidebarProvider>
                <Toaster />
            </body>
        </html>
    );
}
