'use client';

import type { SearchResults as TypeSearchResults } from '@/lib/types';
import { ToolInvocation } from 'ai';
import { useChat } from 'ai/react';
import { CollapsibleMessage } from '@/components/collapsible-message';
import { SearchSkeleton } from '@/components/default-skeleton';
import { SearchResults } from './search-results';
import { SearchResultsImageSection } from './search-results-image';
import { Section, ToolArgsSection } from '@/components/section';

interface SearchSectionProps {
  tool: ToolInvocation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSection({
  tool,
  isOpen,
  onOpenChange,
}: SearchSectionProps) {
  const isToolLoading = tool.state === 'call';
  const searchResults: TypeSearchResults =
    tool.state === 'result' ? tool.result : undefined;
  const query = tool.args?.query as string | undefined;
  const includeDomains = tool.args?.includeDomains as string[] | undefined;
  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(', ')}]`
    : '';

  const header = (
    <ToolArgsSection
      tool="search"
      number={searchResults?.results?.length}
    >{`${query}${includeDomainsString}`}</ToolArgsSection>
  );

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showIcon={false}
    >
      {searchResults &&
        searchResults.images &&
        searchResults.images.length > 0 && (
          <Section>
            <SearchResultsImageSection
              images={searchResults.images}
              query={query}
            />
          </Section>
        )}
      {isToolLoading ? (
        <SearchSkeleton />
      ) : searchResults?.results ? (
        <Section title="Sources">
          <SearchResults results={searchResults.results} />
        </Section>
      ) : null}
    </CollapsibleMessage>
  );
}