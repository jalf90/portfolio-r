'use client';

import QueryClientWrapper from '@/components/withQueryClient';

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <QueryClientWrapper>{children}</QueryClientWrapper>;
}
