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

export function DeepSearchToggle({ onToggle }: { onToggle?: () => void }) {
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
    if (onToggle) onToggle()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          aria-label="Toggle search mode"
          pressed={isDeepSearchMode}
          onPressedChange={handleDeepSearchModeChange}
          className={cn(
            'gap-0.5 px-3 py-1 rounded-full ml-2 border transition-all duration-300',
            isDeepSearchMode
              ? 'bg-blue-100 text-blue-600 border-blue-100 hover:bg-blue-200 hover:text-blue-700'
              : 'bg-background text-muted-foreground border-gray-200',
            ''
          )}
        >
          <Globe className="size-4" />
          <span className="text-xs ml-1">Search</span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="top">
        Search on the net
      </TooltipContent>
    </Tooltip>
  )
}
