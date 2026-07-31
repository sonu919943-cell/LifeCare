import React from 'react';

export const metadata = {
  title: 'Kaamorax Admin — Operations Console',
  description: 'Enterprise moderation, KYC verification, analytics & live platform monitoring for Kaamorax workforce marketplace',
  keywords: 'kaamorax admin, workforce, blue collar, KYC verification, operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: '#020817',
        color: '#f1f5f9',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        {children}
      </body>
    </html>
  );
}
