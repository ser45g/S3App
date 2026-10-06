import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import {
  AtSignIcon,
  FileDownIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import { Separator } from "@base-ui/react";

export type NavMenuItem = {
  title: string;
  url: string;
  icon: React.ReactNode | null;
  items: NavMenuItem[];
};

export const data = {
  navMain: [
    {
      title: "Application",
      url: "/",
      items: [
        {
          title: "Home",
          url: "/",
          icon: <HomeIcon />,
        },
        {
          title: "File Upload/Download",
          url: "/file",
          icon: <FileDownIcon />,
        },
        {
          title: "Information",
          url: "/info",
          icon: <InfoIcon />,
        },
      ],
    },
    {
      title: "Help",
      url: "/",
      items: [
        {
          title: "Accessibility",
          url: "/help",
          icon: <HelpCircleIcon />,
        },
      ],
    },
  ] as NavMenuItem[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row gap-2 items-center">
        <img
          src="https://cdn.worldvectorlogo.com/logos/amazon-s3-simple-storage-service.svg"
          className="w-8 h-8 rounded-full"
        />{" "}
        S3 Storage
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      className="flex w-full h-full"
                      to={item.url}
                    >
                      <SidebarMenuButton
                        className="flex w-full h-full"
                        isActive={item.url == location.pathname}
                      >
                        <div className="flex items-center-safe flex-row  gap-1.5">
                          {item.icon} {item.title}
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <Separator className="bg-primary h-[2px] w-full" />
        <div className="flex flex-row gap-2 items-center">
          <AtSignIcon size={30} />
          <p className="text-muted-foreground text-sm">
            If anything, contact me at sergey1pes@gmail.com
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
