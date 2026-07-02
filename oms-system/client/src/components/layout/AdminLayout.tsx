import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Users, PlusCircle, LogOut, Settings, ChevronsUpDown } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { logout, getMe } from '@/lib/api';
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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Create Order', href: '/orders/create', icon: PlusCircle },
];

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes — no need to refetch on every mount
  });
  const email = (meData?.user?.email as string) ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/login'),
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-12 items-center px-2">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">OMS Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{email}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-56">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 focus:text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center gap-2 border-b px-6 h-14">
          <SidebarTrigger />
        </div>
        <div className="p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
