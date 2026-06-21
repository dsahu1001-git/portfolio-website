'use client';

import { useEffect } from 'react';

export function CopyCodeButton() {
  useEffect(() => {
    const copyIcon = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`;
    const checkIcon = `<svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;

    const style = document.createElement('style') as HTMLStyleElement;
    style.textContent = `
      .copy-code-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(14,14,14,0.72);
        backdrop-filter: blur(12px);
        color: #a0aec0;
        cursor: pointer;
        opacity: 0;
        transition: opacity 200ms ease, color 200ms ease, border-color 200ms ease;
      }
      .copy-code-btn:hover {
        color: #00f5ff;
        border-color: rgba(0,245,255,0.5);
      }
      .prose-brand pre:hover .copy-code-btn,
      .prose pre:hover .copy-code-btn {
        opacity: 1;
      }
      .copy-code-btn.copied {
        color: #00f5ff;
        border-color: rgba(0,245,255,0.5);
      }
    `;
    document.head.appendChild(style);

    const preElements = document.querySelectorAll<HTMLPreElement>('.prose-brand pre, .prose pre');

    preElements.forEach((pre) => {
      const preEl = pre as HTMLPreElement;
      if (preEl.querySelector('.copy-code-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = copyIcon;

      btn.addEventListener('click', async () => {
        const code = preEl.querySelector('code');
        const text = code?.innerText ?? '';
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = checkIcon;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = copyIcon;
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          // clipboard not available
        }
      });

      preEl.style.position = 'relative';
      preEl.appendChild(btn);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}