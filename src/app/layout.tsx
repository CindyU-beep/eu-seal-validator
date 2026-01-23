import type { Metadata } from 'next';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';
import { ErrorFallback } from '@/components/ErrorFallback';
import '@/main.css';
import '@/styles/theme.css';
import '@/index.css';

export const metadata: Metadata = {
  title: 'EU Seal Validator | Henkel',
  description: 'AI-powered validation of EU regulatory hazard pictograms on product labels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {children}
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}
