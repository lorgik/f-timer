import type { Metadata } from 'next'
import { Chivo_Mono } from 'next/font/google'
import './globals.scss'

const rubik = Chivo_Mono({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata: Metadata = {
    title: 'F-timer',
    description: 'Приложение для фокусирования',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <link rel="icon" href="/logo.svg" sizes="any" />

            <body className={rubik.className}>{children}</body>
        </html>
    )
}
