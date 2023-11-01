"use client";
import { Button, Footer, Header, PhoneInput, Tags } from '@/app/components';
import { DAYS, GOOGLE_MAPS_API_KEY } from '@/app/utils/constant';
import React, { useMemo, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files';
import { auth } from '@/app/firebase';
import "./style.css"
import { Main } from '@/app/components/layouts';
import { Autocomplete, GoogleMap, Marker, MarkerF, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import Geocode, { setApiKey } from "react-geocode";
import { Certificate, Clinic, Data } from '@/app/utils/doctorModel';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getDoctorData, updateDoctor, uploadCertificate } from '@/app/redux/doctor_slice';



function DoctorRegister() {

    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [countryCode, setCountryCode] = useState('');
    const [expand, setExpand] = useState(false);
    const [certificates, setCertificates] = useState<File[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [expanded, setExpanded] = React.useState(false);
        const [OTP, setOTP] = React.useState('');
        const [res, setRes] = React.useState<ConfirmationResult>();
    const [clinic, setClinic] = useState<Clinic>({
        name: '',
        location: {
            lat: 0,
            lng: 0
        },
        openTime: '',
        closeTime: '',
        _id: undefined
    });
    const dispatch = useDispatch<any>();
    const router = useRouter();

    const uploadCertificates = async () => {
        certificates.map(async (certificate: File) => {
            // TODO - upload to firebase
            const res = await dispatch(uploadCertificate({ file: certificate }));
            console.log('res', res);
        });
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0]
        console.log(file);
        setCertificates([...certificates, file]);
    };

    const register = async () => {
        const res = await dispatch(getDoctorData({
            countryCode: countryCode,
            mobileNo: phoneNumber,
        })); // Ignore the error
        console.log('res', res);
        const data = res;
        uploadCertificates();

        const res1 = await dispatch(updateDoctor({
            fullName: "kishan",
            email: "kishan-ace@gmail.com",
            clinics: clinics,
            therapy: [],


        }));
        console.log('res1', res1);
        router.push('/doctor');
    }

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

const verifyOTP = (e:React.ChangeEvent<HTMLInputElement>) => {
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
                        register();
                        // open doctor dashboard
                        
                }
                ).catch((error) => {
                        // User couldn't sign in (bad verification code?)
                        
                        console.log('error', error);
                });

        }
}


    return (
        <Main>
            <Header />
            <div className='doctor-details'>
                <h3>Personal Details</h3>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='Enter email address'
                    className='doctor-form-fields'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <PhoneInput onPhoneData={handlePhoneData} />

            </div>

            <div className='doctor-file-upload'>

                <div className='doctor-file-upload-header'>
                    <div>Upload Doctor's Certificate(s)</div>

                </div>
                <input
                    type="file"
                    accept=".pdf, .doc, .doc, .jpg, .png" // Specify the accepted file types (optional)
                    onChange={handleFileChange} // Attach the event handler
                >
                    {/* <Button style={{ 'padding': '80px' }}>
                        <div>
                            Drop here or Upload
                        </div>
                    </Button> */}
                    {/* </FileUploader> */}
                </input>
                <h3 style={{ "textAlign": "center" }}>TODO - show all the documents to be added</h3>
                {
                    certificates.map((certificate) => {
                        return (
                            <div key={certificate.name}>
                                <h3>{certificate.name}</h3>
                            </div>
                        )
                    })
                }
            </div>
            {/*Clinic location*/}



            <div>

                <Accordion>
                    <AccordionItem dangerouslySetExpanded={expand}  >
                        <AccordionItemHeading onClick={(e) => setExpand(!expand)}>
                            <AccordionItemButton>
                                Add clinic location
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>


                            <div className='doctor-timings'>
                                <h3>Location</h3>
                                <Map onLocationChange={(location) => setClinic({ ...clinic, location })} />
                                {/* <h3>Working Hours</h3> */}
                                <input
                                    type="text"
                                    id="clinic"
                                    name="clinic"
                                    placeholder='Enter name of clinic'
                                    className='doctor-form-fields'
                                    value={clinic.name}
                                    onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                                />
                                {/* Sat, sun, monday, etc picker and time picker */}
                                {/* <div className='doctor-timings-week'>
                                    {
                                        DAYS.map((day) => {
                                            return <Tags key={day} text={`${day}`}></Tags>
                                        }
                                        )
                                    }
                                </div> */}
                                <div className='doctor-timings-time'>
                                    <div>Start time</div>
                                    <input type="time" id="appt" name="appt"
                                        min="09:00" max="18:00" required
                                        onChange={(e) => setClinic({ ...clinic, openTime: e.target.value })}
                                    />
                                    <div>End time</div>
                                    <input type="time" id="appt" name="appt"
                                        min="09:00" max="18:00" required
                                        onChange={(e) => setClinic({ ...clinic, closeTime: e.target.value })}
                                    />
                                </div>
                                <Button style={{ 'width': '30%', 'marginLeft': '35%' }}
                                    onClick={() => setClinics([...clinics, clinic])}
                                >Add</Button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
                <h3 style={{ "textAlign": "center" }}>Show all the clinics</h3>
                {
                    clinics.map((clinic) => {
                        return (
                            <div key={clinic.name}>
                                <h3>{clinic.name}</h3>
                                <h3>{clinic.openTime} - {clinic.closeTime}</h3>
                                <h3>{clinic.location.lat} - {clinic.location.lng}</h3>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${clinic.location.lat},${clinic.location.lng}`} target='_blank'>Open in google maps</a>
                            </div>
                        )
                    })
                }
            </div>
            <Button style={{ 'width': '30%', 'marginLeft': '35%' }}
                onClick={() => generateOTP()}
            >Register</Button>
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

            <Footer />
        </Main>
    )
}

interface MapProps {
    onLocationChange: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ onLocationChange }: MapProps) => {

    Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
    Geocode.enableDebug();
    const [latLng, setLatLng] = useState({ lat: 19.0208425, lng: -72.8311203 });

    const handleAddressChange = (e: any) => {
        const address = e.target.value;
        Geocode.fromAddress(address).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(response);
                // Update the state variables with latitude and longitude
                setLatLng({ lat, lng });

                // Invoke the onLocationChange callback with the new latitude and longitude
                onLocationChange({ lat, lng });
            }
        );
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    return (
        <div>
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={latLng}
                    zoom={10}
                    onClick={(e) => {
                        const lat = e.latLng!.lat();
                        const lng = e.latLng!.lng();
                        setLatLng({ lat, lng });
                        onLocationChange({ lat, lng });
                    }}
                >
                    <Autocomplete
                    >
                        <input
                            type="text"
                            placeholder="Enter address"
                            onChange={handleAddressChange}
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid var(--primary-color-dark)`,
                                width: `256px`,
                                height: `64px`,
                                padding: `1rem 2rem`,
                                borderRadius: `0.9rem`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `1rem`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-120px",
                            }}
                        />
                    </Autocomplete>
                    <Marker position={latLng} />
                </GoogleMap>
            )}
        </div>
    )
}

export default DoctorRegister

// const data: Data = {
//     email: email,
//     mobileNo: phoneNumber.toString(),
//     countryCode: countryCode,
//     fullName: 'test',
//     status: 'pending',
//     certificate: [],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     clinics: [],
//     token: 'test',
//     therapy: [],
//     _id: undefined,
//     __v: undefined
// }