import { type ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="h-screen w-full bg-gray-100 flex justify-center items-start">
      <div className="w-full min-w-[350px] max-w-[500px] h-screen bg-background shadow-xl overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
