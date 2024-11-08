import {configureStore} from '@reduxjs/toolkit'
import usersReducer from "./redux/userSlice.js"
import tasksReducer from "./redux/taskSlice.js"


const store = configureStore({
    reducer:{
        user: usersReducer,
        task: tasksReducer
    } 
})

export default store