import React from 'react';
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
import flight_img from "../../../assets/img/what.avif"

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

function WorkerCreate() {

    const navigate = useNavigate();
    const [user, setUser] = useState(
        {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            city: "",
            country: "",
            salary: ""
        }
    )

    const submitUser = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/worker/create/`, user, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access-token')
            }
        })
            .then(res => {
                if (res.status === 201) {
                    toast.success('Successfully created worker!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    // navigate("/")
                }
                console.log(res);
                console.log(res.status)
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 409) {
                    toast.error('Worker with given email already exists!', {
                        position: toast.POSITION.TOP_CENTER
                    })
                } else if (error.response.status === 400) {
                    toast.error('Email/password field can\'t be empty!', {
                        position: toast.POSITION.TOP_CENTER
                    })
                }
            })
    }

    const onInputChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const onPhoneChange = (e) => {
        setUser({...user, ["phone"]: e})
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
                                <h2 className="text-center m-5">Sign Up</h2>
                                <div className="mb-3">
                                    <div className="input-group">
                                            <MDBRow>
                                                <MDBCol md='6'>
                                                    <MDBInput 
                                                        label='Name' 
                                                        type='text' 
                                                        name='first_name' 
                                                        onChange={(e) => onInputChange(e)}
                                                        required/>
                                                </MDBCol>
                                                <MDBCol md='6'>
                                                    <MDBInput 
                                                        label='Surname' 
                                                        name='last_name' 
                                                        type='text' 
                                                        onChange={(e) => onInputChange(e)}
                                                        required/>
                                                </MDBCol>
                                            </MDBRow>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBCol md='6' lg='12'>
                                                <MDBInput 
                                                    label='Email' 
                                                    name="email" 
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
                                                    label='Password' 
                                                    name="password" 
                                                    type='password' 
                                                    onChange={(e) => onInputChange(e)}
                                                    required/>
                                                    
                                            </MDBCol>
                                    </div>
                                </div>
                                <div className="mb-4">
                                        <MDBCol md='6' lg='12'>
                                                <PhoneInput 
                                                    inputStyle={{width: "100%"}} 
                                                    country={"rs"} 
                                                    name="phone" 
                                                    placeholder='Phonenumber' 
                                                    onChange={(e) => onPhoneChange(e)}
                                                    required/>
                                        </MDBCol>
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBCol md='6' lg='12'>
                                                <MDBInput 
                                                    label='Address' 
                                                    name="address" 
                                                    type='text'
                                                    onChange={(e) => onInputChange(e)}
                                                    required/>
                                            </MDBCol>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBRow>
                                                <MDBCol md='6'>
                                                    <MDBInput 
                                                        label='City' 
                                                        type='text' 
                                                        name='city' 
                                                        onChange={(e) => onInputChange(e)}
                                                        required/>
                                                </MDBCol>
                                                <MDBCol md='6'>
                                                    <MDBInput 
                                                        label='Country' 
                                                        name='country' 
                                                        type='text' 
                                                        onChange={(e) => onInputChange(e)}
                                                        required/>
                                                </MDBCol>
                                            </MDBRow>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                            <MDBCol md='6' lg='12'>
                                                <MDBInput 
                                                    label='Salary' 
                                                    name="salary" 
                                                    type='text'
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
                                            >Register</MDBBtn>
                                    </MDBCol>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </MDBCol>
            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src={flight_img} fluid/>
            </MDBCol>
          </MDBRow>  
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default WorkerCreate;