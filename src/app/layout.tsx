import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <head>
        <title>koko - おしゃれなチャットアプリ</title>
        <meta name="description" content="kokoはサーバレス環境で動作するおしゃれなチャットアプリです" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
