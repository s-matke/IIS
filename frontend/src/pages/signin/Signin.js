import React, { useContext } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { 
  MDBBtn, 
  MDBContainer, 
  MDBRow, 
  MDBCol, 
  MDBCard, 
  MDBCardBody, 
  MDBCardImage, 
  MDBInput, 
} 
from 'mdb-react-ui-kit';
import manufacture_img from "../../assets/img/what.avif"

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import jwt from 'jwt-decode';
import AuthContext from '../../store/production/AuthContext';


function Signin() {

    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(
        {
            username: "",
            password: ""
        }
    )

    const authMeFunc = () => {
        axios.get(`http://localhost:8000/auth/me/`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access-token')                          }
                    })
                        .then(res => {
                            if (res.status === 200) {
                                console.log("USER:")
                                console.log(res.data)
                                localStorage.setItem('user', JSON.stringify(res.data))
                                localStorage.setItem('role', res.data['groups'])
                                navigate("/home")
                                navigate(0)
                            }
                            else {
                                console.log("Something went wrong")
                                alert("Wrong")
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            toast.error('Something went wrong!', {
                                position: toast.POSITION.TOP_CENTER
                            })
                        })
    }

    const submitUser = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/signin/`, user)
            .then(res => {
                if (res.status === 200) {
                    toast.success('Logged in!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    const tokenDecoded = jwt(res.data['access'])
                    // localStorage.setItem('access-token', res.data['access'])
                    // localStorage.setItem('refresh-token', res.data['refresh'])
                    // localStorage.setItem('expires', tokenDecoded.exp)
                    // localStorage.setItem('userId', tokenDecoded.user_id)
                    // localStorage.setItem('role', JSON.stringify(tokenDecoded.groups))

                    console.log(res.data)
                    context.login(res.data);
                    
                    navigate("/product/search")                                        
                    // navigate("/")
                    // navigate(0)
                    // authMeFunc()                    
                }
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 404 || error.response.status === 401) {
                    toast.error('Wrong email/password!', {
                        position: toast.POSITION.TOP_CENTER
                    })
                } else {
                    toast.error('Something went wrong. Please try again later!', {
                        position: toast.POSITION.TOP_CENTER
                    })
                }
            })
    }

    const onInputChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    return (
    <MDBContainer fluid>

      <MDBCard className='text-black' style={{borderRadius: '25px'}}>
        <MDBCardBody>
        <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-2 d-flex flex-column align-items-center'>
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-md-5 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                            <Form onSubmit={(e) => submitUser(e)}>
                                <h2 className="text-center m-5">Sign In</h2>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBCol md='6' lg='12'>
                                                <MDBInput 
                                                    label='Your email' 
                                                    name="username" 
                                                    type='email'
                                                    onChange={(e) => onInputChange(e)}
                                                    required/>
                                            </MDBCol>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBCol md='6' lg='12'>
                                                <MDBInput 
                                                    label='Your password' 
                                                    name="password" 
                                                    type='password' 
                                                    onChange={(e) => onInputChange(e)}
                                                    required/>
                                                    
                                            </MDBCol>
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <MDBCol md='6' lg='12'>
                                        <MDBBtn 
                                            className='mb-1' 
                                            size='lg' 
                                            style={{width: "50%", marginLeft: "25%"}} 
                                            >Sign in</MDBBtn>
                                    </MDBCol>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </MDBCol>
            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src={manufacture_img} fluid/>
            </MDBCol>
          </MDBRow>  
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Signin;