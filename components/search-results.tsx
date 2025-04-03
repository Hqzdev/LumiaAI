'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SearchResultItem } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

export interface SearchResultsProps {
  results: SearchResultItem[]
}

export function SearchResults({ results }: SearchResultsProps) {
  const [showAllResults, setShowAllResults] = useState(false)

  const handleViewMore = () => {
    setShowAllResults(true)
  }

  const displayedResults = showAllResults ? results : results.slice(0, 3)
  const additionalResultsCount = results.length > 3 ? results.length - 3 : 0

  const displayUrlName = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      const parts = hostname.split('.')
      return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0]
    } catch {
      return url
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedResults.map((result, index) => (
        <Link 
          key={index} 
          href={result.url} 
          target="_blank"
          className="block transition-transform hover:scale-[1.02]"
        >
          <Card className="h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <p className="text-sm font-medium line-clamp-2 min-h-8">
                {result.title || result.content}
              </p>
              <div className="mt-auto flex items-center gap-2">
                <Avatar className="size-4">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${result.url}`}
                    alt={displayUrlName(result.url)}
                  />
                  <AvatarFallback>
                    {displayUrlName(result.url)[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {displayUrlName(result.url)}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {!showAllResults && additionalResultsCount > 0 && (
        <div className="col-span-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewMore}
          >
            View {additionalResultsCount} more results
          </Button>
        </div>
      )}
    </div>
  )
}