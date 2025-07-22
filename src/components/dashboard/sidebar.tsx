"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  Home,
  ListTodo,
  User,
  Settings,
  LogOut,
  X,
  CreditCard,
  FileText,
  ChevronRight,
  Menu,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { calculateLevelInfo } from "@/lib/utils";

interface SidebarProps {
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { logout } = useAuth();

  // Debug logging
  console.log('Sidebar props:', { isCollapsed, hasToggleFunction: !!onToggleCollapse });

  // Calculate level progress
  const levelInfo = user
    ? calculateLevelInfo(user.level, user.experience)
    : {
        level: 1,
        currentXp: 0,
        nextLevelXp: 100,
        progress: 0,
      };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Quests", href: "/quests", icon: ListTodo },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Time Tracking", href: "/time-tracking", icon: Clock },
    { name: "Billing", href: "/subscription", icon: CreditCard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full py-4">
      {/* Toggle button - Always visible */}
      {onToggleCollapse && (
        <div className={cn(
          "flex px-2 mb-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/dashboard" className="text-lg font-bold px-2">
              Quest Logger
            </Link>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleCollapse}
            className="h-9 w-9 bg-primary/10 border border-primary/20 hover:bg-primary/20"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      <div className={cn(
        "px-4 flex items-center md:hidden",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && !onToggleCollapse && (
          <Link href="/dashboard" className="text-lg font-bold">
            Quest Logger
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>



      {user && !isCollapsed && (
        <Card className="mx-4 my-4 p-4 bg-card">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.username}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Level {levelInfo.level}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs mb-1">
              <span>{levelInfo.currentXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP</span>
            </div>
            <Progress value={levelInfo.progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Collapsed user avatar */}
      {user && isCollapsed && (
        <div className="flex justify-center mx-2 my-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <nav className="mt-2 flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium rounded-md group transition-colors relative",
                isCollapsed ? "px-2 py-3 justify-center" : "px-2 py-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-primary/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isCollapsed ? "mr-0" : "mr-3",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && item.name}

              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "mt-auto py-2",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <Button
          variant="ghost"
          className={cn(
            "text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start"
          )}
          onClick={() => logout()}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
