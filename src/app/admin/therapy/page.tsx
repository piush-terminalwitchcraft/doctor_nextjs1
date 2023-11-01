"use client";
import React, { useEffect } from 'react'
import RootLayout from '../Layout'
import { useDispatch } from 'react-redux';
import { acceptTherapy, addTherapy, fetchTherapies } from '@/app/redux/admin_slice';
import { Datum, Therapy } from '@/app/utils/therapyModel';
import { Button } from '@/app/components';
import './style.css'
import { useRouter } from 'next/navigation';

export default function AdminTherapy() {
    const dispatch = useDispatch<any>();
    const router = useRouter();
    const [data, setData] = React.useState<any>(null);

    const [heading, setHeading] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [advantages, setAdvantages] = React.useState<string>('');
    const [testimonials, setTestimonials] = React.useState<string>('');
    const [video, setVideo] = React.useState<string>('');
    const [photos, setPhotos] = React.useState<File[]>([]);

    const fetchData = async () => {
        try {
            const res = await dispatch(fetchTherapies());
            setData(res.payload as Therapy);
            console.log('res', res);
        }
        catch (err) {
            console.log('err', err);
        }
    }

    const handleAddTherapy = async () => {
        try {
            const res = await dispatch(addTherapy({
                therapy: {
                    name: heading,
                    description: description,
                    advantages: advantages,
                    testimonials: testimonials,
                    video: video,
                    photos: photos[0]
                }
            }))
            console.log('res', res);
            fetchData();
        } catch (err) {
            console.log('err', err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <RootLayout>
            <div className='admin-therapy'>
                {/* Add a therapy, with heading, description, advantages, testimonials (all string), and multiple video and image file picker */}
                <h3>Add a therapy</h3>
                <div className='admin-therapy-add'>
                    <div className='admin-therapy-add-heading'>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            placeholder='Enter heading'
                            className='admin-form-fields'
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setHeading(e.target.value);
                            }}
                        />
                    </div>
                    <div className='admin-therapy-add-description'>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder='Enter description'
                            className='admin-form-fields'
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setDescription(e.target.value);
                            }}
                        />
                    </div>
                    <div className='admin-therapy-add-advantages'>
                        <input
                            type="text"
                            id="advantages"
                            name="advantages"
                            placeholder='Enter advantages'
                            className='admin-form-fields'
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setAdvantages(e.target.value);
                            }}
                        />
                    </div>
                    <div className='admin-therapy-add-testimonials'>
                        <input
                            type="text"
                            id="testimonials"
                            name="testimonials"
                            placeholder='Enter testimonials'
                            className='admin-form-fields'
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setTestimonials(e.target.value);
                            }}
                        />
                    </div>
                    <div className='admin-therapy-add-video'>
                        <input
                            type="text"
                            id="video"
                            name="video"
                            placeholder='Enter youtube video link'
                            className='admin-form-fields'
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setVideo(e.target.value);
                            }}
                        />
                    </div>
                    <div className='admin-therapy-add-image'>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            placeholder='Enter image'
                            className='admin-form-fields'
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
                                    <div className='admin-therapy-add-image-item'>
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
                <h3>Admin Therapy</h3>
                {/* List all therapy */}
                {
                    data?.data.map((therapy: Datum) => {
                        return (
                            <div className='admin-therapy-list' key={therapy._id}>
                                <div className='admin-therapy-list-item'>
                                    <div className='admin-therapy-list-item-name'>
                                        {therapy._id}
                                    </div>
                                    <div className='admin-therapy-list-item-description'>
                                        {therapy.description}
                                    </div>
                                    <h3>Requested by</h3>
                                    {
                                        therapy.requestedBy ?
                                            <div className='admin-therapy-list-item-requested-by' key={therapy.requestedBy._id}>
                                                <p> {therapy.requestedBy.fullName} </p>
                                                <p> {therapy.requestedBy.mobileNo} </p>
                                                <p> {therapy.requestedBy.email} </p>
                                            </div> : null
                                    }
                                    {
                                        therapy.status === 'pending' || therapy.status === 'rejected' ?
                                            <Button className='admin-therapy-list-item-status'
                                                onClick={async () => {
                                                    var res = await dispatch(acceptTherapy({
                                                        therapyId: therapy._id,
                                                        status: 'accepted'
                                                    }))
                                                    console.log('res', res);
                                                    // set it to accepted
                                                    // setData(data.data.map((therapyData: Datum) => {
                                                    //     if(therapyData._id === therapy._id) {
                                                    //         therapyData.status = 'accepted';
                                                    //     }
                                                    //     return therapyData;
                                                    // }
                                                    // ));
                                                    await fetchData();
                                                    // Store the updated data in a variable
                                                    // router.push('/admin/therapy');
                                                }}
                                            >
                                                Approve therapy ?
                                            </Button> : null
                                    }
                                    {
                                        therapy.status === 'pending' || therapy.status === 'accepted' ?
                                            <Button className='admin-therapy-list-item-status'
                                                onClick={async () => {
                                                    var res = await dispatch(acceptTherapy({
                                                        therapyId: therapy._id,
                                                        status: 'rejected'
                                                    }));
                                                    console.log('res', res);
                                                    console.log('therapy', therapy);
                                                    console.log('data', data);
                                                    // router.push('/admin/therapy');
                                                    // set it to rejected
                                                    // setData(data.data.map((therapyData: Datum) => {
                                                    //     if(therapyData._id === therapy._id) {
                                                    //         therapyData.status = 'rejected';
                                                    //     }
                                                    //     return therapyData;
                                                    // }));
                                                    await fetchData();

                                                }}
                                            >
                                                Reject therapy ?
                                            </Button> : null
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </RootLayout>
    )
}
