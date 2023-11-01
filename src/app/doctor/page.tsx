"use client";
import React, { useEffect } from 'react'
import { Main } from '../components/layouts'
import { Button, Footer, Header } from '../components';
import "./style.css"
import { useSelector } from 'react-redux';
import {Doctor, Data as DoctorData } from '../utils/doctorModel';
import { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';
import { Data as PatientData} from '../utils/userModel';
import { useDispatch } from 'react-redux';
import { getPatients } from '../redux/doctor_slice';

function DoctorDashboard() {
  const data = useSelector((state: RootState) => state.doctor) ;
  const doctor = useSelector((state: RootState) => state.doctor.doctor) as unknown as DoctorData ;
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [patient, setPatient] = React.useState<any>();
  const [currentPatient, setCurrentPatient] = React.useState<PatientData>();

  console.log('data', data);
  console.log('doctor', doctor);

  const getPatientDetails = async () => {
    const res = await dispatch(getPatients({}));
    console.log('res', res.payload.data);
    setPatient(res.payload.data);
  }
  useEffect(() => {
    console.log('useEffect');
    getPatientDetails();

  },[]);


  return (
    <Main>
      <Header />
      <div className='doctor-dashboard'>
        <div style={{"flexGrow": "3"}}>
          hi
          {
            patient?.map((item: any) => {
              return (
                <div key={item._id} onClick={()=>{
                  setCurrentPatient(item);
                  // router.push(`/doctor/patient/${item._id}`)
                }}>
                  {item.fullName ? item.fullName : item._id}
                </div>
              );
            })
          }
        </div>
        <div style={{"flexGrow": "12"}}>
          {
          doctor.status? <>
            <div>
              {
                currentPatient ? 
                <div style={{"display":'flex', 'flexDirection':'column'}}>
                    <div>
                    {currentPatient.fullName}
                    </div>
                    <div>
                    {currentPatient._id}
                    </div>
                    <div>
                    {currentPatient.accidentalHistory}
                    </div>
                    <div>
                    {currentPatient.beauty}
                    </div>
                    <div>
                    {currentPatient.otherDisease}
                    </div>
                  </div>
                  : "Select a patient"
              }
            </div>
          </>: "You are not approved yet"
          }
        </div>
      </div>
        <Button
        onClick={()=>{router.push('/doctor/settings')}}
        >Settings</Button>
      <Footer />
    </Main>
  )
}

export default DoctorDashboard
