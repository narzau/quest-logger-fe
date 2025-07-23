import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice',
  robots: 'noindex,nofollow',
};

export default function PublicInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 