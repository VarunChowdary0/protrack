"use client"
import React from 'react'
import { signOut } from "next-auth/react";
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '@/redux/reducers/AuthReducer';


const Logout:React.FC = () => {
    const dispatch = useDispatch();
    return (
        <Button
            variant="outline"
            className="w-full"
            onClick={() => {
                signOut({ callbackUrl: "/login" })
                dispatch(clearAuthData());
            }}>
        Logout
        </Button>
    )
}

export default Logout