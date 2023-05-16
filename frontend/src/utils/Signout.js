import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../store/production/AuthContext";
import { toast } from "react-toastify";

function Signout() {
    // console.log(localStorage.getItem('user'))
    // localStorage.clear();
    // window.location.href = '/';
    const context = useContext(AuthContext);

    const navigate = useNavigate();

    const logout = () => {
        context.logout();
        navigate("/")
    }

    useEffect(() => {
        logout();        
    },[logout])

    return(
        <div></div>
    )
    
}

export default Signout;
