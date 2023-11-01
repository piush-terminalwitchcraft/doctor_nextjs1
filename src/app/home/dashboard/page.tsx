"use client"
import React, { useEffect } from 'react'
import RootLayout from '../Layout'
import { Button } from '@/app/components'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function HomeDashboard() {
  
  const dispatch = useDispatch<any>();
  const userData = useSelector((state: any) => state.user.user);
  console.log('userData', userData);

  useEffect(() => {
  }, [])
  return (
    <RootLayout>
        <p>Full name : {userData.fullName}</p>
        <p>Phone number : {userData.phoneNumber ? userData.phoneNumber : "9137485819"}</p>
        <p>Country code : {userData.countryCode ? userData.countryCode : "+91"}</p>
        

        <Button>Submit</Button>
    </RootLayout>
  )
}

export default HomeDashboard