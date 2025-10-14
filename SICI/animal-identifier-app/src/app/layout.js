import { Providers } from './providers'; // Import the new wrapper component
import './globals.css';

export const metadata = {
  title: 'Animal Identifier',
  description: 'Identify animals from images',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Use the new <Providers> component to wrap your children */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}