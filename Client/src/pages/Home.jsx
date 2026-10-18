import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('user', user)

  const fetchUserDetails = async () => {
    try {
      const token = user.token || localStorage.getItem("token");

      if (!token) {
        console.log("No authentication token found");
        navigate("/email");
        return;
      }
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;

      const response = await axios({
        url: URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      const userData = response.data.data;

      if (!userData || userData.logout) {
        console.error("User details missing:", response.data);
        dispatch(logout());
        navigate("/email");
        return;
      }
      if (response.data.success && response.data.data) {
        dispatch(setUser(response.data.data));
        console.log("current user Details", response)
      }
    } catch (error) {
      console.error(
        "User details error:",
        error.response?.data || error.message
      );
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  /***socket connection */

  /*** Socket connection */
  useEffect(() => {
    // Wait until the user is authenticated
    if (!user.token) return;

    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: user.token
      },
      withCredentials: true
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('Online users:', data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
      dispatch(setSocketConnection(null));
    };
  }, [user.token, dispatch]);



  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`} >
        <Outlet />
      </section>


      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img
            src={logo}
            width={250}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
