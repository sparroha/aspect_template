import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/style.css'
import '../public/css/helper.css'
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Aspect Bridge Template',
  description: 'Template',
  applicationName: 'Template',
  authors: [{url:'https://aspectbridge.com', name:'Keith Dockery'}],
  keywords: 'Template, Aspect Bridge, Aspect, Bridge, AspectBridge, Aspect-Bridge, Aspect_Bridge, AspectBridge.com, Aspect-Bridge.com, Aspect_Bridge.com',
  creator: 'Keith Dockery',
  publisher: 'Aspect Bridge',
  icons: '/assets/binary2.png',
  assets: '/assets',
}
export const viewport: Viewport = {width: 'device-width', initialScale: 1}
export default async function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang={'en'} /*style={{maxHeight: '100vh'}}*/>
    <body>
      <div id="body_layout">
          {children}
      </div>
    </body>
  </html>
}