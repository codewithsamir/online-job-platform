import {configureStore} from '@reduxjs/toolkit'
import registerSlice from "./registerSlice"

const store = configureStore({
    reducer:{
        "registeractive":registerSlice,
    }
})

export default store;