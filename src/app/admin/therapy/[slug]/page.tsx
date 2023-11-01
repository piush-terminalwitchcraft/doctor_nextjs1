// import { useRouter } from 'next/router';
// import React, { useEffect } from 'react'
import RootLayout from '../../Layout'
// import { useDispatch } from 'react-redux';

export default function AdminTherapyDetails({ params }: { params: { slug: string }}) {
    // const router = useRouter();
    // const { slug } = router.query;
    // const [data, setData ] = React.useState<any>(null);
    // const dispatch = useDispatch<any>();

    const fetchData = async () => {
        try {
            // const res = await dispatch(fetc);
            // setData(res.payload);
        }
        catch (err) {
            console.log('err', err);
        }
    }
    // useEffect(() => {
    //     fetchData(); 
    // } 
    // , []);

  return (
    <RootLayout>

    <div>AdminTherapyDetails {params.slug}</div>
    </RootLayout>
  )
}
