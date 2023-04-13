import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from "./components/Sidebar/Sidebar";
import Signin from "./pages/signin/Signin";
import Signout from "./utils/Signout";



function App() {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Signin />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          {/* <Route path="/signup" element={<Signup />}></Route> */}
          <Route path="/signout" element={<Signout/>}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}


export default App;
