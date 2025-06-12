"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '@/redux/reducers/AuthReducer';
import { LogOut } from 'lucide-react';
import SignOutWrapper from '@/lib/SignOutWrapper';


const Logout:React.FC = () => {
    const dispatch = useDispatch();
    return (
        <Button
            variant="destructive"
            className="w-fit"
            onClick={() => {
                SignOutWrapper({
                    callbackUrl: "/login"
                })
                dispatch(clearAuthData());
            }}>
        Logout
        <LogOut/>
        </Button>
    )
}

export default Logout