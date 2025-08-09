import './globals.css'

export const metadata = {
  title: 'سیستم مدیریت پروژه',
  description: 'شرکت طاق گستران غرب',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
