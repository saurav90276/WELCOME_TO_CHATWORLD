import React from 'react'
import welcome from '../assets/welcomelogo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-slate-900'>
            <img 
              src={welcome}
              alt='logo'
              width={280}
              height={60}
            />
        </header>

        { children }
    </>
  )
}

export default AuthLayouts
