import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aspect Bridge Template Home',
}
export default async function HomeLayout({children}) {
  return <div id="home_layout">
        {children}
  </div>
}