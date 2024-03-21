import Navbar from "@/components/navbar/Navbar";
import { Inter, Roboto, Poppins } from "next/font/google";
import Footer from "@/components/footer/Footer";
import AppContext from '@/components/Wrappers/AppWrapper'
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
          <AppContext>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              {children}
              <Footer /> 
            </Suspense>
          </AppContext>
      </body>
    </html>
  )
}