"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import Logout from '../Auth/Logout'

const MainProfile:React.FC = () => {
    const auth = useSelector((state:RootState) => state.auth);
    return (
    <div>
        {
            auth.isAuthenticated && 
            <Logout/>
        }
    </div>
  )
}

export default MainProfile