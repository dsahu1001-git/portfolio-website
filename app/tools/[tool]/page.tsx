import type { Metadata } from 'next';

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { tool } = await params;
  return {
    title: `Tool: ${tool.replaceAll('-', ' ')}`,
    description: 'Free utility placeholder.',
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool } = await params;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Free tool</p>
      <h1 className="mt-3 font-heading text-3xl font-bold capitalize sm:text-4xl">
        {tool.replaceAll('-', ' ')}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        Placeholder route for a free utility. Keep the first version static and
        client-only unless persistence is genuinely needed.
      </p>
    </section>
  );
}
