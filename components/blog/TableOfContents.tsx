interface TableOfContentsProps {
  headings: string[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-semibold">On this page</p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading}>
            <a
              className="text-sm text-muted-foreground hover:text-primary"
              href={`#${slugify(heading)}`}
            >
              {heading}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
