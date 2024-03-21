import Cookies from 'js-cookie'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'

const Home = () => {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken === undefined) {
        return <Redirect to="/login" />
    }
   return (
        <div className='back'>
            <h1>Hello I'm Abhiteja Samudrla</h1>
        </div>
    )
}

export default Home