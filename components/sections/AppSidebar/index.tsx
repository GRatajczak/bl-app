"use client";
import { Home, Settings, Banknote, Cast } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const type = Cookies.get("supabase.auth.token")?.split("type: ")[1];
    const name = Cookies.get("supabase.auth.token")
        ?.split("name: ")[1]
        ?.split(";")[0];

    const items =
        type === "judge"
            ? [
                  {
                      title: "Wyloguj",
                      icon: Settings,
                      action: () => {
                          router.push(`/login`);
                          Cookies.remove("supabase.auth.token");
                      },
                  },
              ]
            : [
                  {
                      title: "Home",
                      url: "/admin",
                      icon: Home,
                      action: null,
                  },

                  {
                      title: "Sędziowie",
                      url: "/admin/judges",
                      icon: Cast,
                      action: null,
                  },
                  {
                      title: "Uczestnicy",
                      url: "/admin/competitors",
                      icon: Banknote,
                      action: null,
                  },
                  {
                      title: "Wyloguj",
                      icon: Settings,
                      action: () => {
                          router.push(`/login`);
                          Cookies.remove("supabase.auth.token");
                      },
                  },
              ];

    if (pathname === "/login") return null;

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="h-100 ">
                        <div className="bg-white size-full flex items-center justify-center flex-col gap-2 py-5">
                            <Image
                                className=""
                                src="/logo.jpg"
                                alt="logo"
                                width={100}
                                height={100}
                            />
                            <div className="font-bold">{name}</div>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {item.action ? (
                                            <button
                                                onClick={() => item.action()}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.url}
                                                className={
                                                    pathname === item.url
                                                        ? "font-bold"
                                                        : ""
                                                }
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
