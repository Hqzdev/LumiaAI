import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function DeepSearchToggle() {
  const [isDeepSearchMode, setIsDeepSearchMode] = useState(true)

  useEffect(() => {
    const savedMode = getCookie('search-mode')
    if (savedMode !== null) {
      setIsDeepSearchMode(savedMode === 'true')
    }
  }, [])

  const handleDeepSearchModeChange = (pressed: boolean) => {
    setIsDeepSearchMode(pressed)
    setCookie('search-mode', pressed.toString())
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          aria-label="Toggle search mode"
          pressed={isDeepSearchMode}
          onPressedChange={handleDeepSearchModeChange}
          className={cn(
            'gap-0.5 px-3 -py-1 text-muted-foreground bg-background rounded-full ml-2 border border-gray-200',
            'data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600',
            'hover:bg-blue-100 hover:text-blue-600 transition-all duration-300',
          )}
        >
          <Globe className="size-4" />
          <span className="text-xs ml-1">Search</span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
      Search on the net
      </TooltipContent>
    </Tooltip>
  )
}
