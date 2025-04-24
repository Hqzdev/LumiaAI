'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SidebarToggle } from './sidebar-toggle';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // Handler for search button
  const handleSearchClick = () => {
    setOpenMobile(false);
    router.push('/search');
    router.refresh();
  };

  // Handler for new chat (LumiaAI)
  const handleNewChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMobile(false);
    router.push('/');
    router.refresh();
  };

  // Цвет фона для сайдбара и кнопок сверху
  const sidebarBg = 'bg-zinc-100 dark:bg-zinc-900';
  // Цвет фона для кнопок сверху (чтобы совпадал с sidebarBg)
  const buttonBg = 'bg-zinc-100 dark:bg-zinc-900';
  // Цвет текста для блока ссылок ниже
  const sectionText = 'text-gray-700 dark:text-gray-300';

  return (
    <Sidebar className={`group-data-[side=left]:border-r-0 ${sidebarBg}`}>
      <SidebarHeader className={sidebarBg}>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center w-full">
            {/* Toggle sidebar on the left */}
            <div className="flex flex-row gap-2">
              <SidebarToggle className={buttonBg} />
            </div>
            {/* New Chat and Search on the right */}
            <div className="flex flex-row gap-2 ml-auto">
              {/* ВЕРНУЛИ КНОПКИ New Chat и Search */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`p-0 h-[38px] w-[38px] rounded-xl [&_svg]:size-[22px] text-[#6B7280] ${buttonBg}`}
                    onClick={handleNewChatClick}
                  >
                    <span className="sr-only">New Chat</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Chat</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`p-0 h-[38px] w-[38px] rounded-xl [&_svg]:size-[22px] text-[#6B7280] ${buttonBg}`}
                    onClick={handleSearchClick}
                  >
                    <span className="sr-only">Search</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={sidebarBg}>
        {/* separator top (толще и ниже) */}
        <div className="h-2" />
        <div className="border-t-2 border-zinc-300 dark:border-zinc-700 mb-2" />
        {/* English section */}
        <div className={`flex flex-col gap-2 mt-4 mb-6 ${sectionText}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#"
                onClick={handleNewChatClick}
                className={`flex items-center px-6 py-2 rounded-xl text-md transition-colors duration-200 hover:bg-zinc-200 group ${sectionText}`}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <span className="text-md group-hover:text-[#2563eb] transition-colors duration-200">LumiaAI</span>
              </a>
            </TooltipTrigger>
            <TooltipContent align="end">
              Новый чат
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#"
                className={`flex items-center px-6 py-2 rounded-xl text-md transition-colors duration-200 hover:bg-zinc-200 group ${sectionText}`}
              >
                <span className="text-md group-hover:text-[#059669] transition-colors duration-200">Explore AI</span>
              </a>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#"
                className={`flex items-center px-6 py-2 rounded-xl text-md transition-colors duration-200 hover:bg-zinc-200 group ${sectionText}`}
              >
                <span className="text-md group-hover:text-[#E4481C] transition-colors duration-200">Library</span>
              </a>
            </TooltipTrigger>
          </Tooltip>
        </div>
        {/* separator bottom */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 mt-2 mb-2" />
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter className={sidebarBg}>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
