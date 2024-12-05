'use client';


import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  //const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
       <div className="flex h-screen">
      {/* <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
      </main>
    </SidebarProvider>
    
  );
}