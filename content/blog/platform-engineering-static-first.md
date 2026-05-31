---
title: 'Why This Site Is Static First'
description: 'A short note on building a personal brand platform that stays fast, portable, and close to zero cost.'
publishedAt: 2026-05-15
updatedAt: 2026-05-15
author: 'Deepak Kumar Sahu'
tags:
  - platform-engineering
  - nextjs
  - performance
category: 'tech'
heroImage: /images/blog/placeholder.svg
heroImageAlt: 'Abstract static-first architecture placeholder'
draft: false
featured: true
readingTime: '3 min read'
---

The first version of this site is intentionally static-first.

Static pages are cheap to host, easy to cache, fast on mobile networks, and simple to move if a vendor stops being useful. That matters when the site is meant to grow from a career portfolio and blog into smaller engagement sections over time.

Dynamic features should earn their place. Contact forms, scoreboards, newsletter sync, and affiliate tracking can live behind small API routes. Everything else can be pre-rendered.

This keeps the architecture simple:

- Markdown content stays portable.
- Pages are generated ahead of time.
- JavaScript is only added where interaction needs it.
- Database usage starts only when persistence is valuable.

The goal is not to avoid modern tooling. The goal is to use it with restraint.
