import React from "react";
import Signup from "./Components/Auth/Signup"
import Login from "./Components/Auth/Login"
import TaskManager from "./Components/Auth/TaskManager";
import NavBar from "./Components/Auth/NavBar";
import { Route,Routes, Navigate } from "react-router-dom";

const App = () => {
  return (
   <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element= {<Signup/>}/>
        <Route path="/login" element= {<Login/>}/>
        <Route path="/tasks" element={<TaskManager/>}/>
      </Routes>
   </div>
  )
}

export default App