import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import {
  Package,
  Users,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/locale-switcher';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('admin.layout');
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">{t('panelName')}</h1>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/admin" icon={LayoutDashboard}>
            {t('navHome')}
          </NavLink>
          <NavLink href="/admin/clients" icon={Users}>
            {t('navClients')}
          </NavLink>
          <NavLink href="/admin/orders" icon={ClipboardList}>
            {t('navOrders')}
          </NavLink>
          <NavLink href="/admin/reports" icon={BarChart3}>
            {t('navReports')}
          </NavLink>
          <NavLink href="/admin/settings" icon={Settings}>
            {t('navSettings')}
          </NavLink>
        </nav>

        {/* Locale Switcher */}
        <div className="p-4 border-t flex justify-center">
          <LocaleSwitcher />
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
