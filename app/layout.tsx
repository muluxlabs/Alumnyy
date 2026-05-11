import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beyond Borders Collective",
  description: "From study abroad to global impact",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
