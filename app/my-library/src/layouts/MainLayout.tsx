import { Header } from '../components'
import './MainLayout.scss'
import type { ReactNode } from 'react'
function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default MainLayout
