"use client";
import RootLayout from '@/app/admin/Layout'
import React from 'react'
import { Button, Footer, Header, PhoneInput } from '@/app/components';
import { useDispatch } from 'react-redux';
import { adminLogin } from '@/app/redux/admin_slice';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import "./style.css"

export default function AdminLogin() {

    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const dispatch = useDispatch<any>();
    const router = useRouter();

    const login = async () => {
        try {
            const res = await dispatch(adminLogin({
                email: email,
                password: password
            })); // Ignore the error
            router.push('/admin');
            // console.log('res => ', res.payload as Doctor);
        }
        catch (err) {
            console.log('err', err);
        }
    }
    return (
        <RootLayout>

            <div className='admin-login'>
                <h3>Welcome to doctors app! Please register</h3>
                <div className='admin-details' >
                <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Enter email address'
                        className='admin-form-fields'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Enter password'
                        className='admin-form-fields'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button style={{ 'width': '30%' }}
                    onClick={() => {
                        try {
                            // generateOTP();
                            login();
                            // open doctor dashboard

                        } catch (err) {
                            console.log('err', err);
                        }

                    }}
                >Submit</Button>

                {/* <div id="recaptcha-container"></div> */}
            </div>
        </RootLayout>
    )
}
