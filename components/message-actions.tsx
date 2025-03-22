import type { Message } from 'ai';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

import type { Vote } from '@/lib/db/schema';

import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row">
        <div className="flex flex-row divide-x rounded-full border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-3 h-8 text-muted-foreground rounded-l-full border-0"
                variant="ghost"
                onClick={async () => {
                  const textFromParts = message.parts
                    ?.filter((part) => part.type === 'text')
                    .map((part) => part.text)
                    .join('\n')
                    .trim();

                  if (!textFromParts) {
                    toast.error("There's no text to copy!");
                    return;
                  }

                  await copyToClipboard(textFromParts);
                  toast.success('Copied to clipboard!');
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-upvote"
                className="py-1 px-3 h-8 text-muted-foreground border-0"
                disabled={vote?.isUpvoted}
                variant="ghost"
                onClick={async () => {
                  const upvote = fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'up',
                    }),
                  });

                  toast.promise(upvote, {
                    loading: 'Upvoting Response...',
                    success: () => {
                      mutate<Array<Vote>>(
                        `/api/vote?chatId=${chatId}`,
                        (currentVotes) => {
                          if (!currentVotes) return [];

                          const votesWithoutCurrent = currentVotes.filter(
                            (vote) => vote.messageId !== message.id,
                          );

                          return [
                            ...votesWithoutCurrent,
                            {
                              chatId,
                              messageId: message.id,
                              isUpvoted: true,
                              isDownvoted: false,
                            },
                          ];
                        },
                        { revalidate: false },
                      );
                      return 'Response upvoted!';
                    },
                    error: 'Failed to upvote response.',
                  });
                }}
              >
                <ThumbsUp className={`h-4 w-4 ${vote?.isUpvoted ? 'fill-current' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upvote</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-downvote"
                className="py-1 px-3 h-8 text-muted-foreground rounded-r-full border-0"
                disabled={vote?.isDownvoted}
                variant="ghost"
                onClick={async () => {
                  const downvote = fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'down',
                    }),
                  });

                  toast.promise(downvote, {
                    loading: 'Downvoting Response...',
                    success: () => {
                      mutate<Array<Vote>>(
                        `/api/vote?chatId=${chatId}`,
                        (currentVotes) => {
                          if (!currentVotes) return [];

                          const votesWithoutCurrent = currentVotes.filter(
                            (vote) => vote.messageId !== message.id,
                          );

                          return [
                            ...votesWithoutCurrent,
                            {
                              chatId,
                              messageId: message.id,
                              isUpvoted: false,
                              isDownvoted: true,
                            },
                          ];
                        },
                        { revalidate: false },
                      );
                      return 'Response downvoted!';
                    },
                    error: 'Failed to downvote response.',
                  });
                }}
              >
                <ThumbsDown className={`h-4 w-4 ${vote?.isDownvoted ? 'fill-current' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Downvote</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
