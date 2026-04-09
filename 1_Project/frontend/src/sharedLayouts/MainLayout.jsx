import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router'

const MainLayout = () => {
  return (
    <div>
      <Navbar/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default MainLayout
