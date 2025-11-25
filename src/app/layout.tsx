import { inter } from "@/config/fonts";
import { TopMenu } from "@/components/TopMenu";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <TopMenu />
        {children}
      </body>
    </html>
  );
}
