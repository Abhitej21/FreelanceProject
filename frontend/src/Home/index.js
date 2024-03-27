import Cookies from 'js-cookie'
import { Link, Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'

const Home = () => {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken !== undefined) {
        return <Redirect to="/jobs" />
    }
   return (
        <div className='back'>
            <div>
            <div className='find'>
                <p>Find Your</p>
                <p>Dream Job</p>
                <p>With us easily</p>
            </div>
            <div>
                <Link to="/login">
                    <button className='start-button'>GET STARTED</button>
                </Link>
            </div>
            </div>
           
            <div>
            <img src="https://res.cloudinary.com/da7y99axc/image/upload/v1711015392/imageBack_zkzzdj.jpg" alt="JobPhoto"/>
            </div>
            
        </div>
    )
}

export default Home