import axios from "axios";
import { toInteger } from "lodash";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from "../../../store/production/AuthContext";

function ProductionCreate() {

    const params = useParams()
    const planId = params.id;
    const context = useContext(AuthContext);

    const navigate = useNavigate()

    const [machines, setMachines] = useState([])
    const [production, setProduction] = useState(
        {
            plan: planId,
            priority: "",
            manager: context.user.id,            
        }
    )

    const [plan, setPlan] = useState(
        {
            product: "",
            start_date: "",
            end_date: "", // TODO: remove, used only for DEV testing
            planner: context.user.id,
            production_cost: "",
            product_name: "",
            producable_amount: ""
        }
    )
  
    useEffect(()=>{
        loadPlan();
    },[])

    const loadPlan = async() =>{
        const result=await axios.get("http://localhost:8000/plan/" + planId, {
            headers: {
              'Authorization': 'Bearer ' + context.token
            }})
            .then(res => {
                setPlan(res.data)
                console.log("plan:", res.data)
            })
            .catch(error => {
                toast.error("Couldn't retrieve the plan! Try again later.", {
                    position: toast.POSITION.TOP_CENTER
                })
                console.log(error);
        })
    }

    const submitProductionOrder = async (e) => {
        e.preventDefault();

        var flag = false;
        Object.keys(production).forEach(function(key) {
            if (production[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (flag) return;

        axios.post(`http://localhost:8000/production/order/`, production, {
            headers: {
              'Authorization': 'Bearer ' + context.token
            }})
            .then(res => {
                toast.success('Successfully created production order!', {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(res);
                console.log(res.data);
                navigate("/production/plan/search");
            })
            .catch(error => {
                if (error.response.status === 406) {
                    toast.error("Not enough materials required for production.", {
                        position: toast.POSITION.TOP_CENTER
                    })
                } else {

                    toast.error('Something went wrong!', {
                        position: toast.POSITION.TOP_CENTER
                    })
                }
                console.log(error);
            })
    }

    const onInputChange = (e) => {
        setProduction({...production, [e.target.name]: e.target.value});
    }

    const declinePlan = async (e) => {
        e.preventDefault();

        console.log("DECLINE")

        // axios.delete(`http://localhost:8000/product/` + productId, {
        //     headers: {
        //       'Authorization': 'Bearer ' + context.token
        //     }})
        //     .then(res => {
        //         toast.success('Successfully deleted product!', {
        //             position: toast.POSITION.TOP_CENTER
        //         });
        //         navigate("/product/search");
        //     })
        //     .catch(error => {
        //         toast.error('Something went wrong!', {
        //             position: toast.POSITION.TOP_CENTER
        //         })
        //         console.log(error);
        //     })
    }

    console.log(production)

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Create Production Order</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about plan</span></h5>
                    </div>
                    <form onSubmit={(e) => submitProductionOrder(e)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Product:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    maxLength={50}
                                    className="form-control"
                                    placeholder="Name..."
                                    name="name"
                                    value={plan.product_name}
                                    // onChange={(e) => onInputChange(e)}
                                    required
                                    disabled
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">
                                Amount to produce:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    className="form-control"
                                    placeholder="Amount..."
                                    value={plan.producable_amount}
                                    name="producable_amount"
                                    required
                                    disabled
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">
                                Cost:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Cost..."
                                    value={plan.production_cost}
                                    name="cost"
                                    required
                                    disabled
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">€</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="min_max_amount" className="form-label">
                                Start-End Date:
                            </label>
                            <div class="input-group">
                                <input
                                    type={"text"}
                                    className="form-control"
                                    min="0"
                                    value={new Date(plan.start_date).toLocaleString()}
                                    placeholder="Start date..."
                                    name="start_date"
                                    required
                                    disabled
                                    />
                                <span class="input-group-addon"> - </span>
                                <input
                                    type={"text"}
                                    className="form-control"
                                    placeholder="End date..."
                                    value={new Date(plan.end_date).toLocaleString()}
                                    name="end_date"
                                    required
                                    disabled
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Priority:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min = "0"
                                    max = "100"
                                    className="form-control"
                                    placeholder="Priority..."
                                    name="priority"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        {/* <button type="submit" className="btn btn-outline-primary" 
                                style={{'width':'150px', 'height':'50px', 'margin-left':'39%', 'margin-top':'15px'}}>
                        Approve
                        </button> */}
                        <div class="overlay-right d-flex justify-content-center">
                         {/* style={{'width':'150px', 'height':'50px', 'margin-left':'39%', 'margin-top':'15px'}}> */}
                            <button type="submit" className="btn btn-outline-primary p-3 m-2">
                                    
                            Approve
                            </button>
                            <button type="button" onClick={declinePlan} className="btn btn-outline-danger p-3 m-2" 
                                    >
                            Decline
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default ProductionCreate;