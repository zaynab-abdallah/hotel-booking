import { useLocation } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import SiteFooter from './SiteFooter'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/login' || pathname === '/register'

  return (
    <>
      <AppNavbar />
      <main className="flex-grow-1">{children}</main>
      {!hideFooter && <SiteFooter />}
    </>
  )
}
