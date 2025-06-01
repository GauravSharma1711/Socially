import { Navigate, Route,Routes } from "react-router-dom"
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/Login'
import SignUpPage from './pages/auth/signup/SignUpPage'
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationsPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

import {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

export default function App() {


	        const {data:authUser , isLoading} = useQuery({
				//query key to give unique name to query and refer it later
				queryKey : ['authUser'],
				queryFn : async() => {
                        try {
							const res = await fetch('/api/v1/auth/getme', {
                        credentials: 'include'
                              });
							const data = await res.json();
						if(!res.ok){
						throw new Error(data.error || "Something went wrong")
							}
							console.log("authUser :", data);
							 
							return data;

						} catch (error) {
							throw new Error(error);
							
						}
				},
				retry:false
			})


			if(isLoading){
				return <div className=" h-screen flex items-center justify-center" >
<LoadingSpinner size='lg' />
				</div>
			}

  return (
	<div className='flex max-w-6xl mx-auto'>
   { authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser ?<HomePage /> : <Navigate to={'/login'}/>} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} /> } />
				<Route path='/notifications' element={authUser? <NotificationsPage/>: <Navigate to={'/login'} />} />
				<Route path='/profile/:username' element={authUser? <ProfilePage/>: <Navigate to={'/login'} />} />
			</Routes>
		{  authUser &&	<RightPanel/>}
			<Toaster/>
		</div>
  )
}