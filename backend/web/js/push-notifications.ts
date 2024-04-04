// console.log("Hello world")

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getMessaging,getToken,onMessage} from 'firebase/messaging'
// import { firebaseConfig,vapidKey } from "./config";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// const messaging = getMessaging(app)
 
// Notification.requestPermission().then(permission => {
//     if(permission === 'granted') {
//         console.log('Notification permission granted')
//         init()
//     }
//     else{
//         console.log('Notification permission denied')
//     }
// }
// )
 

// const init = () => {
//     getToken(messaging, { vapidKey }).then((currentToken) => {
//         if (currentToken) {
//             console.log('current token for client: ', currentToken);
//         } else {
//             console.log('No registration token available. Request permission to generate one.');
//         }
//     }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//     });
    
// }


import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { firebaseConfig, vapidKey } from './config'
 
// Initialize Firebase
 
 
Notification.requestPermission().then(permission => {
    if(permission === 'granted') {
        console.log('Notification permission granted')
        initFirebase();
    }
    else{
        console.log('Notification permission denied')
    }
}
)
 
const initFirebase = () => {
    const app = initializeApp(firebaseConfig);
 
    const messaging = getMessaging(app);
 
    // onMessage(messaging, (payload) => {
    //     console.log('foreground Message Received', payload);
 
    //     new Notification('Test Foreground Notification', {
    //         title : 'Test Notification',
    //         message : payload.data.message,
    //         contextMessage : payload.data.message,
    //     } as any)   
    // })
    
    getToken(messaging, { vapidKey }).then((currentToken) => {
        if (currentToken) {
            console.log('current token for client: ', currentToken);
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
}
 
