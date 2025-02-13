import {createSlice} from "@reduxjs/toolkit"


const registerSlice = createSlice({
    name: 'registeractive',
    initialState:{
        isActivelogin:false,
        isActivecategori:false,
        isActivejobseeker:false,
        isActivejobprovider:false,
        isActivechatbot:false,
        isActiveforgotpassword:false,

    },
    reducers:{
        loginActive:(state,action)=>{
                state.isActivelogin = action.payload
        },
        categoriActive:(state,action)=>{
                state.isActivecategori = action.payload
        },
        
        jobseekerActive:(state,action)=>{
                state.isActivejobseeker = action.payload
        },
        jobproviderActive:(state,action)=>{
                state.isActivejobprovider = action.payload
        },
        chatbotActive:(state,action)=>{
                state.isActivechatbot = action.payload
        },
        forgotpasswordActive:(state,action)=>{
                state.isActiveforgotpassword = action.payload
        },
    }
})


export const {loginActive,categoriActive,jobseekerActive,jobproviderActive,chatbotActive,forgotpasswordActive} = registerSlice.actions

export default registerSlice.reducer