'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { LazyImage } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

interface FreeImageGeneratorProps {
  srOnlyTitle?: string;
  className?: string;
}

interface GeneratedImage {
  id: string;
  url: string;
}

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 300000; // 5 minutes for free models
const MAX_PROMPT_LENGTH = 2000;

type TaskStatus = 'idle' | 'pending' | 'processing' | 'success' | 'failed';

export function FreeImageGenerator({
  srOnlyTitle,
  className,
}: FreeImageGeneratorProps) {
  const t = useTranslations('ai.free-image.generator');

  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(
    null
  );

  // Task tracking refs
  const taskRef = useRef<{
    eventId: string;
    host: string;
    apiName: string;
  } | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const promptLength = prompt.trim().length;
  const isPromptTooLong = promptLength > MAX_PROMPT_LENGTH;

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskStatus('idle');
    taskRef.current = null;
    startTimeRef.current = null;
  }, []);

  const pollTaskStatus = useCallback(async (): Promise<boolean> => {
    const task = taskRef.current;
    if (!task) return true;

    try {
      if (
        startTimeRef.current &&
        Date.now() - startTimeRef.current > GENERATION_TIMEOUT
      ) {
        resetTaskState();
        toast.error('Generation timed out. Please try again.');
        return true;
      }

      const resp = await fetch('/api/free/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'Query failed');
      }

      const { status, images } = data;

      if (status === 'success' && images?.length > 0) {
        setGeneratedImages(
          images.map((url: string, index: number) => ({
            id: `free-${Date.now()}-${index}`,
            url,
          }))
        );
        setProgress(100);
        setTaskStatus('success');
        toast.success('Image generated successfully!');
        resetTaskState();
        return true;
      }

      if (status === 'processing') {
        setTaskStatus('processing');
        setProgress((prev) => Math.min(prev + 8, 85));
        return false;
      }

      // still pending
      setProgress((prev) => Math.max(prev, 20));
      return false;
    } catch (error: any) {
      console.error('Error polling free task:', error);
      toast.error(`Query failed: ${error.message}`);
      resetTaskState();
      return true;
    }
  }, [resetTaskState]);

  // Polling effect
  useEffect(() => {
    if (!isGenerating || !taskRef.current) return;

    let cancelled = false;

    const tick = async () => {
      const done = await pollTaskStatus();
      if (done) cancelled = true;
    };

    tick();

    const interval = setInterval(async () => {
      if (cancelled) {
        clearInterval(interval);
        return;
      }
      const done = await pollTaskStatus();
      if (done) clearInterval(interval);
    }, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isGenerating, pollTaskStatus]);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error('Please enter a prompt before generating.');
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setTaskStatus('pending');
    setGeneratedImages([]);
    startTimeRef.current = Date.now();

    try {
      const resp = await fetch('/api/free/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (resp.status === 429) {
        toast.error(
          'Too many requests. Please wait a moment and try again.'
        );
        resetTaskState();
        return;
      }

      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'Failed to start generation');
      }

      taskRef.current = {
        eventId: data.eventId,
        host: data.host,
        apiName: data.apiName,
      };
      setProgress(20);
    } catch (error: any) {
      console.error('Failed to start free generation:', error);
      toast.error(`Failed to generate: ${error.message}`);
      resetTaskState();
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    if (!image.url) return;

    try {
      setDownloadingImageId(image.id);
      const resp = await fetch(
        `/api/proxy/file?url=${encodeURIComponent(image.url)}`
      );
      if (!resp.ok) throw new Error('Failed to fetch image');

      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      toast.success('Image downloaded');
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('Failed to download image');
    } finally {
      setDownloadingImageId(null);
    }
  };

  const taskStatusLabel =
    taskStatus === 'pending'
      ? 'Waiting for the model to start...'
      : taskStatus === 'processing'
        ? 'Generating your image...'
        : '';

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                {srOnlyTitle && <h2 className="sr-only">{srOnlyTitle}</h2>}
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Sparkles className="h-5 w-5" />
                  {t('title')}
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                    {t('free_badge')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="free-image-prompt">{t('prompt')}</Label>
                  <Textarea
                    id="free-image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('prompt_placeholder')}
                    className="min-h-32"
                  />
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {promptLength} / {MAX_PROMPT_LENGTH}
                    </span>
                    {isPromptTooLong && (
                      <span className="text-destructive">
                        {t('prompt_too_long')}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || isPromptTooLong}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t('generate')}
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    {taskStatusLabel && (
                      <p className="text-muted-foreground text-center text-xs">
                        {taskStatusLabel}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <ImageIcon className="h-5 w-5" />
                  {t('generated_images')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="space-y-3">
                        <div className="relative overflow-hidden rounded-lg border">
                          <LazyImage
                            src={image.url}
                            alt="Generated image"
                            className="h-auto w-full"
                          />
                          <div className="absolute right-2 bottom-2 flex justify-end text-sm">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto"
                              onClick={() => handleDownloadImage(image)}
                              disabled={downloadingImageId === image.id}
                            >
                              {downloadingImageId === image.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <ImageIcon className="text-muted-foreground h-10 w-10" />
                    </div>
                    <p className="text-muted-foreground">
                      {isGenerating
                        ? t('ready_to_generate')
                        : t('no_images_generated')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
