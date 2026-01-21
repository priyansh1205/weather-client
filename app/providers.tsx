'use client';

import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // This can be used for other global providers (theme, auth, etc.)
  // React Query is now in the route group layout
  return <>{children}</>;
}
