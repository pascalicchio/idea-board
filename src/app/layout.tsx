import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Board - Organize Ideas & Tasks',
  description: 'Kanban board for organizing projects across TrendWatcher, HackerStack, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
