import './style.css'
function Footer() {
        return (
            <div className='flex flex-row 
                justify-evenly  
                h-32 p-8 background-shadow footer'
                >
                <div>
                    <h2>
                        @Copyright Doctor 2023
                    </h2>
                </div>
                <div>
                    <h2>Doctor App</h2>
                </div>
                <div>
                    <h2>Our services</h2>
                    <ul>
                        <li>Therapy</li>
                        <li>Consultation</li>
                        <li>Doctor</li>
                    </ul>

                </div>
                <div>
                    <h2>About us</h2>
                    <ul>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                        <li>LinkedIn</li>
                    </ul>

                </div>
            </div>
        )
    }

    export default Footer;