import React from 'react';
import './style.css';
import Link from 'next/link';
import Button from './Button';
function Header() {
        return (
            <div className='flex flex-row 
                justify-between  
                h-32 p-8 background-shadow header'>
                {/* <a href="/home/login">User login </a> */}
                {/* <a href="/admin/login">Admin login</a> */}
                {/* <a href="/doctor/login">Doctor login</a> */}
                <div className='header-logo'>
                    LOGO
                </div>

                <div className='header-body'>
                    <Link href="/home">Home</Link>
                    <div>Therapy 🔽 </div>
                    <div>Contact Us</div>
                    <Button> 
                        <Link href="/home/login">Login</Link>    
                    </Button>
                </div>
            </div>
        )
    }

export default Header;