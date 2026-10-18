import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {

      const user = action.payload

      if (!user) return

      state._id = user._id ?? ""
      state.name = user.name ?? ""
      state.email = user.email ?? ""
      state.profile_pic = user.profile_pic ?? ""

    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logout: (state, action) => {
      state._id = ""
      state.name = ""
      state.email = ""
      state.profile_pic = ""
      state.token = ""
      state.socketConnection = null
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions

export default userSlice.reducer
