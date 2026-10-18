import React from 'react'
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector(state => state?.user?.onlineUser)

  //Amit Prajapati

  let avatarName = ""

  if (name) {
    const splitName = name?.split(" ")

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0]
    } else {
      avatarName = splitName[0][0]
    }
  }

  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-gray-200',
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200"
  ]

  const randomNumber = Math.floor(Math.random() * 9)

  const isOnline = onlineUser.includes(userId)
  return (
    <div
      className="relative shrink-0 rounded-full text-slate-800 font-bold"
      style={{
        width: `${width}px`,
        height: `${width}px`,
        aspectRatio: "1 / 1"
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "Avatar"}
          className="block h-full w-full rounded-full object-cover"
        />
      ) : (
        name ? (
          <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
            {avatarName}
          </div>
        ) : (
          <PiUserCircle
            size={width}
          />
        )
      )
      }

      {isOnline && (
  <span
    className="absolute bottom-0 right-0
               h-3 w-3 rounded-full
               border-2 border-slate-800 bg-green-500"
  />
)}

      {/* {
        isOnline && (
          <div className='bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
        )
      } */}

    </div>
  )
}

export default Avatar
