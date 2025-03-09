import * as React from "react";
import {
  FolderOpen,
  GalleryVerticalEnd,
  File,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useVaults } from "@features/vault/renderer/hooks/useVaults";
import { useFileTree } from "@features/vault/renderer/hooks/useFileTree";
import { FileNode } from "@features/vault/preload/vault-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTreeRoot } from "./file-tree";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeVault } = useVaults();
  const fileTreeQuery = useFileTree();
  const [activeTab, setActiveTab] = React.useState("docs");
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    new Set(),
  );
  
  // Use a ref to track if we've done the initial root expansion
  const initialRootExpandDone = React.useRef(false);

  // Only expand the root folder on initial data load
  React.useEffect(() => {
    if (fileTreeQuery.data?.tree?.name && !initialRootExpandDone.current) {
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        next.add(fileTreeQuery.data!.tree.name);
        return next;
      });
      initialRootExpandDone.current = true;
    }
  }, [fileTreeQuery.data]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="flex flex-col p-0">
        <div className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Documentation</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="border-t border-border">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full flex bg-transparent h-8 border-b border-border rounded-none p-0">
              <TabsTrigger
                value="docs"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sidebar-accent rounded-none text-xs h-full"
              >
                Docs
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sidebar-accent rounded-none text-xs h-full"
              >
                Files
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-0">
        {activeTab === "docs" && (
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={item.isActive}
                          >
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {activeTab === "files" && (
          <SidebarGroup>
            {fileTreeQuery.isLoading && (
              <div className="px-3 py-2 text-sm text-sidebar-muted">
                Loading files...
              </div>
            )}

            {fileTreeQuery.isError && (
              <div className="px-3 py-2 text-sm text-red-500">
                Error loading files: {fileTreeQuery.error?.toString()}
              </div>
            )}

            {fileTreeQuery.data && fileTreeQuery.data.tree && (
              <SidebarMenu>
                <FileTreeRoot 
                  tree={fileTreeQuery.data.tree} 
                  expandedFolders={expandedFolders}
                  onToggleFolder={toggleFolder}
                />
              </SidebarMenu>
            )}

            {!activeVault && (
              <div className="px-3 py-2 text-sm text-sidebar-muted">
                No vault selected
              </div>
            )}
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
