'use client'
import { auth } from '@/app/firebase';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import "@/app/globals.css"
import "@/app/home/home.css"
import { Carousel, Main, Popup, Spacer } from '@/app/components/layouts'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '@/app/redux/store'
import { Button, Dropdown, Footer, Header, PhoneInput, Tags, TextBox } from '@/app/components/'
import { FileUploader } from 'react-drag-drop-files';
import { BASE_URL, DISEASES, FILE_DESCRIPTION, SERVICES } from '../utils/constant'
import { useRouter } from 'next/navigation';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { updateUser, userLogin } from '../redux/user_slice';
import Image from 'next/image'

export default function Home() {
    return (
        <Main>
            <Header />
            <Body />
            <Footer />
        </Main>
    )
}



function Body() {


    return (
        <div className='flex flex-row 
            items-stretch flex-grow'
            style={{ "height": "120vh" }}
        >
            <div style={{ "width": "100%", "height": "30%", "display": "flex", flexDirection: "column", "margin":"20px" }}>
                <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error eius facilis corrupti quas natus, ullam sint, consequatur expedita pariatur dolore est labore enim sapiente blanditiis impedit quasi esse deleniti sed?
                Officia corrupti modi, laudantium adipisci dicta officiis quo autem neque dolores iusto aspernatur, quam voluptate vel laborum commodi ad. Ab incidunt, iusto et expedita dicta sit quaerat? Vel, reiciendis voluptatum.</div>
                

                <Image
                    className="banner-image"
                    src="/qualified_doctors.webp"
                    alt="Your image"
                    width={300}
                    height={300}
                    style={{
                        // "width": "50vw",
                        // "height": "300px!important",
                        "backgroundColor": "white",
                        "margin":"20px",
                    }}
                />
<Image
                    className="banner-image"
                    src="/qualified_doctors.webp"
                    alt="Your image"
                    width={300}
                    height={300}
                    style={{
                        // "width": "50vw",
                        // "height": "300px!important",
                        "backgroundColor": "white",
                        "margin":"20px",
                    }}
                />
                {/* <div
                style={{
                    "width": "50vw",
                    "height": "300px!important",
                    "backgroundColor": "white"
                }}
                >Banner 2</div> */}
            </div>
            {/* floating window */}
            {/* <div>Div 1 </div>
                <div>Div 2</div> */}
            <div className='home-form'>
                <EnquiryForm />
            </div>
        </div>
    );
}


function EnquiryForm() {

    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [disease, setDisease] = useState('');
    const [services, setServices] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [problems, setProblems] = useState<string | undefined>();
    const [OTP, setOTP] = useState('');
    const [res, setRes] = useState<ConfirmationResult>();
    const router = useRouter();
    const [countryCode, setCountryCode] = useState('');
    const dispatch = useDispatch<any>();


    const handleFileChange = (event: any) => {
        const file = event.target.files[0]
        console.log(file);
    };
    const generateRecaptcha = () => {
        console.log('generateRecaptcha');
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container", {
            'size': 'invisible',
            'callback': function (response: any) {
                console.log("Captcha Resolved");
                generateOTP();
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
            }
            ).catch((error) => {
                // User couldn't sign in (bad verification code?)

                console.log('error', error);
            });

        }
    }

    const handlePhoneData = (code: string, number: number) => {
        setCountryCode(code);
        setPhoneNumber(number.toString());
    };

    const login = async () => {
        try {
            const res = await dispatch(userLogin({
                mobileNo: phoneNumber,
                countryCode: countryCode
            }));
            console.log('res', res);
            const res2 = await dispatch(updateUser({
                fullName: 'Piush Paul',
                age: 55,
                accidentalHistory: disease,
                // otherDiseases: disease,
                beauty: services.includes('Beauty') ? "true" : "false",
                skinCare: services.includes('Skin Care') ? "true" : "false",
                weightLoss: services.includes('Weight Loss') ? 10 : 0,
                problems: problems,
                location: {
                    lat: 12.866489,
                    lng: 164.1958561
                },
            }));
            //             "fullName": "kishan k",
            // "age": 55,
            // "accidentalHistory": "test",
            // "otherDisease": "test",
            // "problems": "test",
            // "location": {
            //     "lat": 12.866489,
            //     "lng": 164.1958561
            // },
            // "weightLoss": 10,
            // "beauty": "test",
            // "skinCare": "test"

            console.log('res2', res2);
            router.push('/home/dashboard');
        }
        catch (err) {
            console.log('err', err);
        }
    }


    return (
        <>

            <div className='home-services'>
                {
                    SERVICES.map((service) => <div key={service}
                        onClick={() => {
                            // if services are added, then remove else add 
                            if (services.includes(service)) {
                                setServices(services.filter((s) => s !== service))
                            }
                            else {
                                setServices([...services, service])
                            }

                        }}

                        style={{ "backgroundColor": services.includes(service) ? "orange" : "white" }}
                    >{service}</div>)
                }
            </div>

            <TextBox setProblems={setProblems} />
            <Carousel>
                {
                    DISEASES.map((d, index) => {
                        return <div onClick={
                            () => setDisease(d + disease)
                        } key={index}
                        > <Tags text={d}
                            /></div>
                    })
                }
            </Carousel>
            <div className='home-file-upload'>
                <div className='home-file-upload-header'>
                    <div>Choose file description</div>
                    <Dropdown
                        items={FILE_DESCRIPTION}
                        initialSelectedItem={FILE_DESCRIPTION[0]}
                        onSelectItem={() => { }}
                        renderOption={(item: string) => (item)}
                    />
                </div>
                <input
                    type="file"
                    accept=".pdf, .doc, .doc, .jpg, .png" // Specify the accepted file types (optional)
                    onChange={handleFileChange} // Attach the event handler
                ></input>
            </div>

            <div >
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='Enter email address'
                    className='home-form-fields'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div >
                {/* <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder='Enter phone number'
                    className='home-form-fields'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                /> */}
                <PhoneInput onPhoneData={handlePhoneData} />
            </div>
            <Button style={{ 'width': '30%', 'marginLeft': '35%' }}
                onClick={() => {
                    // generateOTP();
                    login();
                }}
            >Submit</Button>
            {
                expanded ?
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Enter email address'
                        className='doctor-form-fields'
                        value={OTP}
                        onChange={(e) => { verifyOTP(e) }}
                    /> : null
            }
            <div id="recaptcha-container"></div>
        </>
    );
}