export const metadata = {
  title: "Training PoC",
  description: "Free / Paid / Org with R2-backed content"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 20, lineHeight: 1.5 }}>
        <h1>Training PoC</h1>
        <p style={{ opacity: 0.7 }}>
          R2-backed manifests & shards • Simulate roles via <code>?pro=1</code> and <code>?org=acme</code>
        </p>
        {children}
      </body>
    </html>
  );
}
