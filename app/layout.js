import Navbar from "@/components/navbar/Navbar";
import { Inter, Roboto, Poppins } from "next/font/google";
import Footer from "@/components/footer/Footer";
import AuthProvider from '@/components/AuthProvider/AuthProvider'
// import { UseGlobal } from './Context' Currently unused
import { Suspense } from 'react'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tsion for the people',
  description: 'Created for Beth-Kavod',
}

export default function RootLayout({ children }) {
  return (
    // <UseGlobal>
      <html lang="en">
        <body className={inter.className}>
            <AuthProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Navbar />
                  {children}
                  <Footer /> 
                </Suspense>
            </AuthProvider>
        </body>
      </html>
    // </UseGlobal>
  )
}