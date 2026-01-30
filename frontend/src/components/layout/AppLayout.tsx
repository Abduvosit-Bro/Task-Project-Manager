import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
