'use client';

import './globals.css';

import { AppSidebar } from '@/components/app-sidebar';
import ChatBotComponent from '@/components/ChatBotComponent'; // 👈 Import du chatbot
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TopNav } from '@/components/top-nav';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/signup' || pathname == '/forgot-password'|| pathname == '/reset-password';

  return (
    <html lang="fr">
      <head>
      <link rel="icon" href="/1.png" type="image/png" sizes="80x80" />    
      <title>Apprencia</title>
      </head>
      <body className={inter.className}>
        {isPublicPage ? (
          <main>{children}</main>
        ) : (
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <TopNav />
                <main className="flex-1 p-6 bg-gradient-to-br from-teal-50/30 via-cyan-50/20 to-white">{children}</main>
              </div>
            </div>
            <ChatBotComponent /> {/* 👈 Ajout du chatbot ici */}
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}
