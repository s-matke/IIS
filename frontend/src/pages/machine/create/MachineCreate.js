import axios from "axios";
import { toInteger } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from "../../../store/production/AuthContext";

function MachineCreate() {

    const navigate = useNavigate()
    const context = useContext(AuthContext);
    
    const [machine, setMachine] = useState(
        {
            name: "",
            version: "",
            release_date: ""
        }
    )
  
    const submitMachine = async (e) => {
        e.preventDefault();

        var flag = false;
        Object.keys(machine).forEach(function(key) {
            if (machine[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (flag) return;

        axios.post(`http://localhost:8000/machine/`, machine, {
            headers: {
              'Authorization': 'Bearer ' + context.token
            }})
            .then(res => {
                toast.success('Successfully added new machine!', {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/machine/search");
            })
            .catch(error => {
                toast.error('Something went wrong!', {
                    position: toast.POSITION.TOP_CENTER
                })
                console.log(error);
            })
    }

    console.log(machine)

    const onInputChange = (e) => {
        setMachine({...machine, [e.target.name]: e.target.value});
    }

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Add Machine</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about machine</span></h5>
                    </div>
                    <form onSubmit={(e) => submitMachine(e)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Name:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    maxLength={50}
                                    className="form-control"
                                    placeholder="Name..."
                                    name="name"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Version:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    maxLength={20}
                                    className="form-control"
                                    placeholder="Version..."
                                    name="version"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">
                                Price:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Price..."
                                    name="price"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">€</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Release date:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"date"}
                                    className="form-control"
                                    placeholder="Release date..."
                                    name="release_date"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-outline-primary" 
                                style={{'width':'150px', 'height':'50px', 'margin-left':'39%', 'margin-top':'15px'}}>
                        Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default MachineCreate;