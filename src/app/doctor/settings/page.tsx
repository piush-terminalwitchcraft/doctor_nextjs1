"use client";
import React, { useEffect } from 'react'
import RootLayout from '../Layout'
import { useDispatch } from 'react-redux';
import { addTherapy, getTherapies } from '@/app/redux/doctor_slice';
import { Button } from '@/app/components';
import './style.css'

const  DoctorSettings = () => {
  const [therapies, setTherapies] = React.useState([]);
  const [selectedTherapies, setSelectedTherapies] = React.useState<any>([]); 
  const dispatch = useDispatch<any>();

  const getAllTherapies = async () => {
    const res = await dispatch(getTherapies({}));
    setTherapies(res.payload.data);
    console.log(res.payload.data);
    
  }

  const addAllTherapies = async () => {

    selectedTherapies.forEach(async (therapy: any) => {
      const res = await dispatch(addTherapy({therapy}));
      console.log(res.payload.data);
    })
    alert("Saved");
  }
  useEffect(() => {
      getAllTherapies();
  }, []);


  return (
    <RootLayout>
      <div>

      <div>Doctor Settings</div>
      <h2>Add therapies</h2>
      {
        therapies.map((therapy: any, index: number) => {
          return (
            <div key={therapy._id}
            onClick={() =>{
              // if it is there add, else remove it
              const index = selectedTherapies.findIndex((item: any) => item === therapy._id);
              if (index === -1) {
                setSelectedTherapies([...selectedTherapies, therapy._id]);
              }
              else {
                const newSelectedTherapies = [...selectedTherapies];
                newSelectedTherapies.splice(index, 1);
                setSelectedTherapies(newSelectedTherapies);
              }

            }}
            >{therapy._id} + {therapy.therapy}</div>
            )
          })
        }
      <h1>Selected therapies</h1>
      {
        selectedTherapies.map((therapy: any, index: number) => {
          return (
            <div key={therapy}>{therapy}</div>
            )
        })
      }
      <Button
        onClick={() => {
          addAllTherapies();
        }}
        >Save</Button>
        <h1>OR</h1>

        <div>Add therapy</div>
          <AddTherapy />
        </div>
    </RootLayout>
  )
}

function AddTherapy () {
  const [heading, setHeading] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [advantages, setAdvantages] = React.useState<string>('');
    const [testimonials, setTestimonials] = React.useState<string>('');
    const [video, setVideo] = React.useState<File>();
    const [photos, setPhotos] = React.useState<File[]>([]);

    const dispatch = useDispatch<any>();

    const handleAddTherapy = async () => {
      try {
          const res = await dispatch(addTherapy({
              
                  name: heading,
                  description: description,
                  advantages: advantages,
                  testimonials: testimonials,
                  video: video,
                  photos: photos[0]
              
          }))
          console.log('res', res);
          
      } catch (err) {
          console.log('err', err);
      }
  }
    return (
      <div className='doctor-therapy-add'>
      <div className='doctor-therapy-add-heading'>
          <input
              type="text"
              id="heading"
              name="heading"
              placeholder='Enter heading'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.value', e.target.value);
                  setHeading(e.target.value);
              }}
          />
      </div>
      <div className='doctor-therapy-add-description'>
          <input
              type="text"
              id="description"
              name="description"
              placeholder='Enter description'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.value', e.target.value);
                  setDescription(e.target.value);
              }}
          />
      </div>
      <div className='doctor-therapy-add-advantages'>
          <input
              type="text"
              id="advantages"
              name="advantages"
              placeholder='Enter advantages'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.value', e.target.value);
                  setAdvantages(e.target.value);
              }}
          />
      </div>
      <div className='doctor-therapy-add-testimonials'>
          <input
              type="text"
              id="testimonials"
              name="testimonials"
              placeholder='Enter testimonials'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.value', e.target.value);
                  setTestimonials(e.target.value);
              }}
          />
      </div>
      <div className='doctor-therapy-add-video'>
          <div>Add video</div>
          <input
              type="file"
              id="video"
              name="video"
              placeholder='Enter video'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.value', e.target.files);
                  if(e.target.files && e.target.files.length > 0){
                    setVideo(e.target.files[0]);
                  }
              }}
          />
      </div>
      <div className='doctor-therapy-add-image'>
          <div>Add image</div>
          <input
              type="file"
              id="image"
              name="image"
              placeholder='Enter image'
              className='doctor-form-fields'
              onChange={(e) => {
                  console.log('e.target.files', e.target.files);
                  if (e.target.files && e.target.files.length > 0) {
                      setPhotos([...photos, e.target.files[0]]);
                  }
              }}
          />
          {
              photos ? photos.map((photo: File) => {
                  return (
                      <div className='doctor-therapy-add-image-item'>
                          <img src={URL.createObjectURL(photo)} alt={photo.name} />
                      </div>
                  )
              }) : null
          }
          <Button onClick={() => {
              handleAddTherapy();
          }} > Add therapy </Button>
      </div>
  </div>
    )
}

export default DoctorSettings;