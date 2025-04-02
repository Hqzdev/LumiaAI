'use client'

import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toggle } from '@/components/ui/toggle'

export function SearchModeToggle() {
  const [isSearchMode, setIsSearchMode] = useState(true)

  useEffect(() => {
    const savedMode = getCookie('search-mode')
    if (savedMode !== null) {
      setIsSearchMode(savedMode === 'true')
    }
  }, [])

  const handleSearchModeChange = (pressed: boolean) => {
    console.log('Pressed:', pressed); // Добавьте этот лог
    setIsSearchMode(pressed);
    setCookie('search-mode', pressed.toString());
  };

  return (
    <Toggle
      aria-label="Toggle search mode"
      pressed={isSearchMode}
      onPressedChange={handleSearchModeChange}
      className={cn(
        'gap-1 px-3 text-muted-foreground bg-background rounded-full',
        'data-[state=on]:bg-accent-blue data-[state=on]:text-accent-blue-foreground',
        'hover:bg-accent hover:text-accent-foreground transition-all duration-300'
      )}
    >
      <Globe className="size-4" />
      <span className="text-xs">Search</span>
      {isSearchMode && (
        <span className="text-green-500 text-xs ml-1">✓</span>
      )}
    </Toggle>
  );
}