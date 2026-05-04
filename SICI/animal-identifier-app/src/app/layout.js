import { Providers } from './providers'; 
import './globals.css';

export const metadata = {
  title: 'Animal Identifier',
  description: 'Identify animals from images',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}