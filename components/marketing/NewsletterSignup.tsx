'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface NewsletterSignupProps {
  compact?: boolean;
}

export function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    const formData = new FormData(event.currentTarget);
    const topics = formData.getAll('topics');
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        topics,
      }),
    });
    const result = (await response.json()) as {
      error?: string;
      message?: string;
    };

    setMessage(result.message ?? result.error ?? 'Please try again.');
    setIsSubmitting(false);

    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit}
    >
      <div
        className={
          compact
            ? 'flex flex-col gap-3 sm:flex-row'
            : 'grid gap-3 sm:grid-cols-[1fr_auto]'
        }
      >
        <Input
          aria-label="Email address"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Joining...' : 'Join newsletter'}
        </Button>
      </div>
      <fieldset className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <legend className="sr-only">Newsletter topics</legend>
        <label className="flex items-center gap-2">
          <input defaultChecked name="topics" type="checkbox" value="ai" />
          AI developments
        </label>
        <label className="flex items-center gap-2">
          <input defaultChecked name="topics" type="checkbox" value="quantum" />
          Quantum developments
        </label>
      </fieldset>
      {message ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
