'use client';

import type { Attachment, Message } from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useArtifactSelector } from '@/hooks/use-artifact';

import { ArrowUpIcon, StopIcon } from './icons';
import { ArrowUp, Square, Paperclip, Search, Lightbulb, PlusIcon, MessageSquareDiff } from 'lucide-react';
import { PreviewAttachment } from './preview-attachment';
import { Button } from './ui/button';
import { SearchModeToggle } from './search-mode-toggle'
import { Textarea } from './ui/textarea';
import { SuggestedActions } from './suggested-actions';
import { DeepSearchToggle } from './deep-search-toggle';
import { JustifyModeToggle } from './justify-toggle';
import equal from 'fast-deep-equal';
import { UseChatHelpers, UseChatOptions } from '@ai-sdk/react';
import { EllipsisModeToggle } from './three-button-toggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);
  const [isButtonInput, setIsButtonInput] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isMenuSelected, setIsMenuSelected] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const buttonWords = ['Artifact', 'Canvas', 'Justify', 'Search', 'Research'];
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    if (value.startsWith('/')) {
      setIsCommandMenuOpen(true);
    } else {
      setIsCommandMenuOpen(false);
    }
    if (!buttonWords.some(word => value.startsWith(word))) {
      setIsButtonInput(false);
    }
    setIsMenuSelected(false);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput('');
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    
    <div className={`flex flex-col gap-2 max-w-3xl mx-auto w-full ${messages.length === 0 ? 'mb-[400px]' : ''} ${isArtifactVisible ? 'mr-[400px]' : ''}`}>
      <div className="relative w-full flex flex-col gap-4 rounded-[30px] bg-white shadow-lg border border-gray-200">
        <Popover open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen}>
          <PopoverTrigger asChild>
            <Textarea
              data-testid="multimodal-input"
              ref={textareaRef}
              placeholder="What's up?"
              value={isMenuSelected ? (input + ' →') : input}
              onChange={handleInput}
              className={cx(
                'min-h-[60px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-[30px] !text-base bg-white pb-16 px-6 pt-4 border border-gray-200 focus:border-gray-200 focus-visible:border-gray-200 focus:ring-0 focus-visible:ring-0',
                ((isButtonInput && /^(Artifact|Canvas|Research)\b/.test(input)) || isMenuSelected) && 'font-bold text-blue-600',
                className,
              )}
              rows={1}
              autoFocus
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();

                  if (status !== 'ready') {
                    toast.error('The Lumia A.i is answering now, wait!');
                  } else {
                    submitForm();
                  }
                }
              }}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="w-80 p-0 mt-2 rounded-2xl border border-gray-200 shadow-xl bg-white">
            <div className="flex flex-col divide-y divide-gray-100">
              <button className="flex items-start gap-3 p-4 text-blue-600 hover:bg-blue-50 w-full text-left" onClick={() => { setInput('Поиск'); setIsCommandMenuOpen(false); setIsMenuSelected(true); }}>
                <span className="mt-1">🌐</span>
                <span>
                  <span className="font-medium">Поиск</span>
                  <br />
                  <span className="text-xs text-muted-foreground">Найти в сети</span>
                </span>
              </button>
              <button className="flex items-start gap-3 p-4 text-blue-600 hover:bg-blue-50 w-full text-left" onClick={() => { setInput('Холст'); setIsCommandMenuOpen(false); setIsMenuSelected(true); }}>
                <span className="mt-1">🖌️</span>
                <span>
                  <span className="font-medium">Холст</span>
                  <br />
                  <span className="text-xs text-muted-foreground">Совместная работа над написанием текстов и кодированием</span>
                </span>
              </button>
              <button className="flex items-start gap-3 p-4 text-blue-600 hover:bg-blue-50 w-full text-left" onClick={() => { setInput('Создать изображение'); setIsCommandMenuOpen(false); setIsMenuSelected(true); }}>
                <span className="mt-1">🎨</span>
                <span>
                  <span className="font-medium">Создать изображение</span>
                  <br />
                  <span className="text-xs text-muted-foreground">Визуализируйте идеи и концепции</span>
                </span>
              </button>
              <button className="flex items-start gap-3 p-4 text-blue-600 hover:bg-blue-50 w-full text-left" onClick={() => { setInput('Глубокое исследование'); setIsCommandMenuOpen(false); setIsMenuSelected(true); }}>
                <span className="mt-1">🔎</span>
                <span>
                  <span className="font-medium">Глубокое исследование</span>
                  <br />
                  <span className="text-xs text-muted-foreground">Получите подробную информацию по любой теме</span>
                </span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="absolute bottom-0 p-2 w-full flex flex-row justify-between items-center">
          <div className="flex items-center">
          <Tooltip>
  <TooltipTrigger asChild>
  <Button
  className="rounded-full border border-gray-200 size-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-600"
  variant="ghost"
  onClick={(event) => {
    event.preventDefault();
    fileInputRef.current?.click();
  }}
>
  <PlusIcon className="size-5" />
</Button>

  </TooltipTrigger>
  <TooltipContent side="top">
  Attach files and more
  </TooltipContent>
</Tooltip>

            <SearchModeToggle isSearchMode={isSearchMode} setIsSearchMode={setIsSearchMode} />
            <DeepSearchToggle  />
            <JustifyModeToggle  />
            <EllipsisModeToggle onSectionSelect={(text: string) => { setInput(text); setIsButtonInput(true); }} />
          </div>

          <div>
            {status === 'submitted' ? (
              <StopButton stop={stop} setMessages={setMessages} />
            ) : (
              <SendButton
                input={input}
                submitForm={submitForm}
                uploadQueue={uploadQueue}
              />
            )}
          </div>
        </div>

        <input
          type="file"
          className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          tabIndex={-1}
        />

        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div
            data-testid="attachments-preview"
            className="flex flex-row gap-2 overflow-x-scroll items-end px-4"
          >
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}

            {uploadQueue.map((filename) => (
              <PreviewAttachment
                key={filename}
                attachment={{
                  url: '',
                  name: filename,
                  contentType: '',
                }}
                isUploading={true}
              />
            ))}
          </div>
        )}
      </div>
      {messages.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-2">
          <SuggestedActions chatId={chatId} append={append} mode={isSearchMode ? 'search' : 'general'} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Lumia may contain errors. We recommend that you check important
          information.
        </p>
      )}
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;

    return true;
  },
);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      data-testid="stop-button"
      variant={undefined}
      className="rounded-full mr-1 mt-2 size-8 flex items-center justify-center bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:bg-black"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopIcon size={7} />
    </Button>
  );
}
const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      data-testid="send-button"
      className="rounded-full mr-1 mt-2 size-8 flex items-center justify-center bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:bg-black"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUp className="size-5" strokeWidth={3} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
