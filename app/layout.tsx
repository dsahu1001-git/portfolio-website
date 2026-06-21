import type { Metadata } from 'next';
import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import { ScrollSignal } from '@/components/shared/ScrollSignal';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { BackToTop } from '@/components/shared/BackToTop';
import { CopyCodeButton } from '@/components/blog/CopyCodeButton';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deepaksahu.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Deepak Kumar Sahu | Platform Engineering Leader',
    template: '%s | Deepak Kumar Sahu',
  },
  description:
    'Personal brand site for Deepak Kumar Sahu: platform engineering, DevOps leadership, technical writing, and reliable cloud systems.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Deepak Kumar Sahu | Platform Engineering Leader',
    description:
      'Platform engineering leader building reliable, cost-aware developer platforms at scale.',
    url: siteUrl,
    siteName: 'Deepak Kumar Sahu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deepak Kumar Sahu | Platform Engineering Leader',
    description:
      'Platform engineering leader building reliable, cost-aware developer platforms at scale.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ScrollSignal />
              <BackToTop />
            </div>
            <CopyCodeButton />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}