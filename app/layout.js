import Navbar from "@/components/navbar/Navbar";
import { Inter, Roboto, Poppins } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { UserProvider } from '@/components/AuthProvider/UserContext'
import { Suspense } from 'react'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tsion for the people',
  description: 'Created for Beth-Kavod',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <UserProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                {children}
                <Footer /> 
              </Suspense>
          </UserProvider>
      </body>
    </html>
  )
}