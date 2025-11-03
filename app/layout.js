import '../styles/globals.css'

export const metadata = {
  title: 'Farewell Digital Card',
  description: '同期からのメッセージページ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-b from-sky-50 via-blue-50 to-blue-100 text-gray-800 overflow-x-hidden font-zen">
        {children}
      </body>
    </html>
  )
}
