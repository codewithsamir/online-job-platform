"use client"
import store from "@/Ruduxtoolkit/store"
import {Provider} from "react-redux"



const Storewrap = ({children}: Readonly<{
    children: React.ReactNode;
  }>) => {

  return (
    <Provider store ={store}>
           
    {children}
    </Provider>
  )
}

export default Storewrap