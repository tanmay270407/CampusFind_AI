'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Logo, LogoIcon } from '@/components/logo';
import { Bell, FilePlus, Home, Search, SquareStack, ShieldCheck, LogOut, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/my-items', label: 'My Reported Items', icon: SquareStack },
    { href: '/dashboard/lost/new', label: 'Report Lost', icon: Search },
    { href: '/dashboard/found/new', label: 'Report Found', icon: FilePlus, roles: ['staff', 'admin'] },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/claims', label: 'Manage Claims', icon: ShieldCheck, roles: ['admin'] },
];

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="hidden h-8 items-center px-2 group-data-[collapsible=icon]:flex">
            <LogoIcon />
        </div>
        <div className="flex h-8 items-center pl-2 group-data-[collapsible=icon]:hidden">
            <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            {menuItems.map((item) => {
                if(item.roles && !item.roles.includes(user!.role)) return null;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                    <SidebarMenuItem key={item.label}>
                        <Link href={item.href} passHref>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.label, side: 'right' }}
                            >
                                <span>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/dashboard/profile" passHref>
                    <SidebarMenuButton tooltip={{ children: 'Settings', side: 'right' }}>
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Log Out', side: 'right' }}>
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
