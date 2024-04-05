import React,{useEffect,useState} from 'react';
import './index.css'
import Cookies from 'js-cookie'
import {data} from '../data'
import SavedPost from '../SavedPost';
import BackBtn from '../BackBtn';
import Loader from 'react-loader-spinner';
import {URL} from '../data'


const ShowStarred = () => {
    const [likedPosts,setLikedPosts] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(() => {
        async function fetchLikedPosts(){ 
        const jwtToken = Cookies.get('jwt_token')
        const url = `${URL}/jobs/saved`
        const options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },

        }
        const fetchedData = await fetch(url,options)
        const storedData = await fetchedData.json()
        const likedList = (storedData && storedData.likes.map(each => each.like_id)) || []
        let tempData = []
        for(const liked of likedList){
            const eachItem = data.find(each => each.id === liked)
            tempData.push(eachItem)
        }
            setIsLoading(false)
            setLikedPosts(tempData)
        }
        fetchLikedPosts()
    },[])
    if(isLoading){
        return (
            <div className="loader-container" data-testid="loader">
                <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
        )
    }
    if(likedPosts.length>0){
        return (
            <>
            <BackBtn/>
            <div className='AllDataOfItems'>
                <div className='thirteen'>
                <h1 className='saved-jobs-title'>Saved Job Posts</h1>
                </div>
                {likedPosts && likedPosts.map(eachPost => {
                    return <SavedPost
                    each={eachPost} 
                    key={eachPost.id}/>
                })}
            </div>
            </>
            
        )
    }
    else{
        return (
            <>
            <BackBtn/>
            <div className='no-saved-box'>
                <img src="https://res.cloudinary.com/da7y99axc/image/upload/v1710311214/Search-rafiki_nj8lqk.png" 
                className='no-saved-img'
                alt="No Saved Posts yet"/>
                <h1 className='no-saved'>Keep track of jobs you're interested in. <br/>
                Select the heart icon on a job post to save it for later.</h1>
            </div>
            </>
        )
    }
}

export default ShowStarred;
