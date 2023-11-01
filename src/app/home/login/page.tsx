"use client";
import RootLayout from '../Layout'
import { auth } from '@/app/firebase';
import React, { useState } from 'react'
import "./style.css"
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, PhoneInput } from '@/app/components';
import { userLogin } from '@/app/redux/user_slice';


function UserLogin() {

    const [phoneNumber, setPhoneNumber] = React.useState(0);
    const [countryCode, setCountryCode] = useState('');
    const [expanded, setExpanded] = React.useState(false);
    const [OTP, setOTP] = React.useState('');
    const dispatch = useDispatch<any>();
    const router = useRouter();
    const [res, setRes] = React.useState<ConfirmationResult>();

    const handlePhoneData = (code: string, number: number) => {
        setCountryCode(code);
        setPhoneNumber(number);
    };

    const generateRecaptcha = () => {
        console.log('generateRecaptcha');
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container", {
            'size': 'invisible',
            'callback': function (response: any) {
                console.log("Captcha Resolved");
            },
        }
        );
        // defaultCountry: "IN",
        console.log('recaptchaVerifier', recaptchaVerifier);
        return recaptchaVerifier;
    }

    const generateOTP = async () => {
        try {
            const phNo = '' + countryCode + phoneNumber;
            if (phNo.length >= 10) {
                console.log('phNo', phNo);
                setExpanded(true);
                const appVerifier = generateRecaptcha();

                // const appVerifier = window.recaptchaVerifier;
                const confirmationResult = await signInWithPhoneNumber(auth, phNo, appVerifier).then(
                    (confirmationResult: ConfirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        setRes(confirmationResult);
                        console.log('confirmationResult', res);
                        // ...
                    }
                ).catch((error) => {
                    // Error; SMS not sent
                    // ...
                    console.log('error', error);
                });
            }
        }
        catch (err) {
            console.log('err=> ', err);
        }
    }

    const verifyOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value;
        setOTP(code);
        if (code.length === 6) {
            console.log('OTP', code);
            console.log('res', res);
            const confirmationResult = res;
            confirmationResult!.confirm(code).then((result) => {
                // User signed in successfully.
                const user = result.user;
                console.log('user', user);
                login();
                // open doctor dashboard
                router.push('/doctor');
            }
            ).catch((error) => {
                // User couldn't sign in (bad verification code?)

                console.log('error', error);
            });

        }
    }

    const login = async () => {
        try {
            const res = await dispatch(userLogin({
                countryCode: countryCode,
                mobileNo: phoneNumber,
            })); // Ignore the error
            // console.log('res => ', res.payload as Doctor);
            router.push('/home/dashboard');
        }
        catch (err) {
            console.log('err', err);
        }
    }


    return (
        <RootLayout>
            <div className='user-login'>
                <h3>Welcome to doctors app! Users please register with mobile number</h3>
                <div className='user-details'
                    style={{ 'marginLeft': '60px' }}
                >
                    <PhoneInput onPhoneData={handlePhoneData} />
                    {/* <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder='Enter password'
                                                className='home-form-fields'
                                                value={password}
                                                onChange={(e) => setPassword(ce.target.value)}
                                        /> */}
                </div>
                <Button style={{ 'width': '30%' }}
                    onClick={() => {
                        try {
                            generateOTP();
                            // login();
                            // open doctor dashboard
                            // router.push('/doctor');

                        } catch (err) {
                            console.log('err', err);
                        }

                    }}
                >Submit</Button>
                {
                    expanded ?
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Enter email address'
                            className='user-form-fields'
                            value={OTP}
                            onChange={(e) => { verifyOTP(e) }}
                        /> : null
                }
                <div id="recaptcha-container"></div>
                <h3>OR</h3>
                <Button style={{ 'width': '30%' }}>
                    <a href='/doctor/register' style={{ 'width': '30%' }}>Register</a>
                </Button>
            </div>
        </RootLayout>
    )
}

export default UserLogin