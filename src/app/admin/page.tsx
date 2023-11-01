"use client";
import React, { useEffect, useState } from 'react'
import RootLayout from './Layout'
import { useDispatch } from 'react-redux';
import { fetchDoctors, updateDoctorStatus } from '../redux/admin_slice';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { Certificate, Clinic, Data, Doctor } from '../utils/doctorModel';
import './style.css'
import { Button } from '../components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function AdminDashboard() {
  const MapStyle = {
    width: "100%",
    height: 500
  };
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.admin.loading);
  const [res, setRes] = useState<Data[]>([]);
  const [doctor, setDoctor] = useState<Data>();
  // c
  const getDoctors = async () => {
    console.log('getDoctors');
    const response = await dispatch(fetchDoctors());
    console.log('res', response.payload.data);
    setRes(response.payload.data); // Update the state with the fetched data
  }

  const updateStatus = async (status: string) => {
    console.log('updateStatus');
    const response = await dispatch(updateDoctorStatus({ doctorId: doctor!._id as string, status: status }));
    console.log('res', response);
    // Update the state with the fetched data of that doctor currently selected
    setRes(res.map((doctorData: Data) => {
      if (doctorData._id === doctor!._id) {
        doctorData.status = status;
      }
      return doctorData;
    }));
  }

  useEffect(() => {
    console.log('useEffect');
    getDoctors();
  }, [])

  return (
    <RootLayout>
      {/* <Button
      onClick={() => {
        router.push('/admin/therapy');
      }}
      style={{"width":"200px"}}
      >Manage therapies</Button> */}
      <div className="admin-dashboard-container">

        <div className='admin-dashboard-header'>
          <h1>List of all doctors 🔽</h1>
          <ul>
            <li>-- Approved list</li>
            <li>-- Suspended list</li>
          </ul>
          <h1>Personal details</h1>
          <h1
            onClick={
              () => {
                router.push('/admin/therapy');
              }
            }
          >Therapy details</h1>
        </div>
        <div className='admin-dashboard-list'>
          {
            loading ? <h1>Loading...</h1> : null
          }
          {
            res && res.map((doctorData: Data) => {
              return <h1 key={doctorData._id}
                onClick={(e) => setDoctor(doctorData)}
                className='bg-slate-300'
              >
                <div className='flex'>
                  <Image
                    className="banner-image"
                    src="/qualified_doctors.webp"
                    alt="Your image"
                    width={64}
                    height={64}
                    style={{
                      // "width": "50vw",
                      // "height": "300px!important",
                      "backgroundColor": "white",
                      "margin": "8px",
                      "borderRadius": "64px",
                    }}
                  />
                  <div>

                    <p className='admin-doctor-name'> {doctorData.fullName ? doctorData.fullName : "No name"} </p>
                    <p className='admin-doctor-designation'> MBBS in homeopatic </p>
                  </div>
                </div>
              </h1>
            })
          }
        </div>

        <div className='admin-dashboard-details'>
          {
            doctor ?
              <h1>

                <div className='flex'>
                <Image
                    className="banner-image"
                    src="/qualified_doctors.webp"
                    alt="Your image"
                    width={128}
                    height={128}
                    style={{
                      "backgroundColor": "white",
                      "margin": "8px",
                      // "borderRadius": "64px",
                    }}
                  />
                  <div >
                    <p className='text-st'>Full name - {doctor.fullName ? doctor.fullName : "No name"} </p>

                    <p className='text-st'>Mobile No - {doctor.countryCode} {doctor.mobileNo} </p>

                    <p className='text-st'>Email : {doctor.email ? doctor.email : "No email"} </p>

                    <p className='text-st'>Age : 40</p>

                  </div>
                </div>

                {/* <p>Status : {doctor.status} </p> */}
                <p> Doctor Records  </p>
                <div className='flex'>
                {
                  doctor.certificate.length ? doctor.certificate.map((certificate: Certificate, index: number) => {
                    return <p>
                      {/* <a key={index} href={`${certificate.link}`} target='_blank'> {certificate.label} </a> */}
                      <Image key={index}
                        width={80}
                        height={80}
                        loader={({ src }) => `${src}`}
                        src={`${certificate.link}`}
                        alt={`${certificate.label}`}
                      />
                    </p>
                  }) : "No records"
                }
                </div>
                <p className='admin-dd'>Location</p>

                <iframe
        src={`https://maps.google.com/maps?q=${doctor.clinics[0].location.lat},${doctor.clinics[0].location.lng}&z=15&output=embed`}
        width={MapStyle.width}
        height={MapStyle.height}
       
        style={{ border: 0 }}
        aria-hidden="false"
        
        title="Humanity First Indonesia"
      />

                <p className='admin-dd'>Venue Details</p>

                {
                  doctor.clinics.length ? doctor.clinics.map((clinic: Clinic, index: number) => {
                    return <p className='pb-2'>
                      <p>Venue name : {clinic.name}</p>
                      <p>Venue location: 
                      <a key={index} href={`https://www.google.com/maps?q=${clinic.location.lat},${clinic.location.lng}`} target='_blank'> link </a>
                      </p>
                      <p>Clinic timings</p>
                      <p>Time : {clinic.openTime} to {clinic.closeTime}</p>
                    </p>
                  }) : "No clinics"
                }

                <p>Therapy</p>
                {
                  doctor.therapy.length ? doctor.therapy.map((therapy: string, index: number) => {
                    return <p>
                      <Link key={index}
                        href={`/admin/therapy/${therapy}`}
                        target='_blank'> {therapy} </Link>
                    </p>
                  }
                  ) : "No therapy"
                }
                {/* // doctor.status === 'pending' ? 
                  // <div> */}
                  <div className='flex' style={{"justifyContent":"center"}}>
                <Button style={{ "width": "120px" }} onClick={() => updateStatus('accepted')}> Accept </Button>
                <Button style={{ "width": "120px" }} onClick={() => updateStatus('rejected')}> Reject </Button>
                <Button style={{ "width": "120px" }} onClick={() => updateStatus('suspend')}> Suspend </Button>
                    </div>
                {/* // </div> */}
                {/* // : null  */}

              </h1> : "No doctor selected"
          }
        </div>
      </div>
    </RootLayout>
  )
}

export default AdminDashboard