'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/ToastProvider';

export function ContactForm() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    });
    const result = (await response.json()) as {
      error?: string;
      mode?: string;
    };

    if (response.ok) {
      toast(
        result.mode === 'dry-run'
          ? 'Message validated. Email delivery is not configured yet.'
          : 'Message sent. I will get back to you soon.',
        'success',
      );
      event.currentTarget.reset();
    } else {
      toast(result.error ?? 'Unable to send your message.', 'error');
    }
    setIsSubmitting(false);
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-border bg-card p-6"
      onSubmit={handleSubmit}
    >
      <Input name="name" placeholder="Your name" required />
      <Input name="email" placeholder="you@example.com" required type="email" />
      <Input name="subject" placeholder="Subject" required />
      <Textarea
        name="message"
        placeholder="What should we talk about?"
        required
      />
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
      {message ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}