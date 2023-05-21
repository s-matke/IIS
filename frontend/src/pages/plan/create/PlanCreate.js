import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/production/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";


function PlanCreate() {
    const context = useContext(AuthContext);
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0];
    
    const [productOptions, setProductOptions] = useState([])
    const [selectedProduct, setSelectedProduct] = useState()
    const [plan, setPlan] = useState(
        {
            product: "",
            start_date: "",
            end_date: "", // TODO: remove, used only for DEV testing
            planner: context.user.id
        }
    )

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async() => {
        const result = await axios.get("http://localhost:8000/product", {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            const productList = res.data.map(product => ({
                label: product.name,
                value: product.id
            }));

            setProductOptions(productList);
        })
    }

    console.log(plan)

    const submitPlan = async(e) => {
        e.preventDefault();

        var flag = false;
        
        Object.keys(plan).forEach(function(key) {
            if (plan[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (plan.start_date > plan.end_date) {
            toast.warning("Start of production can't be after it should end!", {
                position: toast.POSITION.TOP_CENTER
            })
            flag = true;
        }

        if (flag) return;

        axios.post(`http://localhost:8000/plan/`, plan, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            toast.success('Successfully created plan!', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("/production/plan/search")
        })
        .catch(error => {
            toast.error('Something went wrong! Check dates', {
                position: toast.POSITION.TOP_CENTER
            })
        })
    }

    const onInputChange = (e) => {
        setPlan({...plan, [e.target.name]: e.target.value})
    }

    const onSelectChange = (e) => {
        const newSelectedProduct = {
            id: e.value,
            name: e.name
        }
        setSelectedProduct(newSelectedProduct)
        setPlan({...plan, ['product']: e.value})
    }

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Production Plan</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about plan</span></h5>
                    </div>
                    <form onSubmit={(e) => submitPlan(e)}>
                        <div className="mb-4">
                            <label htmlFor="product" className="form-label">
                                Product:
                            </label>
                            <div className="dropdown-container">
                                <Select
                                    required
                                    options={productOptions}
                                    name="product"
                                    placeholder="Choose product"
                                    onChange={(e) => onSelectChange(e)}
                                    isSearchable={true}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="eta" className="form-label">
                                Start of production:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"datetime-local"}
                                    // min={today}
                                    className="form-control"
                                    placeholder="Start date..."
                                    name="start_date"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="eta" className="form-label">
                                End of production:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"datetime-local"}
                                    // min={today}
                                    className="form-control"
                                    placeholder="End date..."
                                    name="end_date"
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

export default PlanCreate;
