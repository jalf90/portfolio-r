'use client';

import QueryClientWrapper from '@/components/QueryClient';

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <QueryClientWrapper>{children}</QueryClientWrapper>;
}
