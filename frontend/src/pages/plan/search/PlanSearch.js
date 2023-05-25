import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AuthContext from '../../../store/production/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function PlanSearch() {
    const [plans, setPlans] = useState([])
    const [filterData, setFilterData] = useState([])
    const[query, setQuery] = useState('')
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    useEffect(()=>{
        if (context.role == "Plan Manager") {
            loadAllPlansForPlanner(); 
        } else {
            loadAllPlans();
        }
    },[])

    const loadAllPlansForPlanner = async() => {
        const result = await axios.get("http://localhost:8000/plan/planner/" + context.user.id, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })

        setPlans(result.data)
        setFilterData(result.data)
    }

    const loadAllPlans = async() => {
        const result = await axios.get("http://localhost:8000/plan", {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })

        setPlans(result.data)
        setFilterData(result.data)
    }

    const filterPlansByStatus = async(status) => {
        var url_opt = ""
        if (context.role == "Plan Manager") {
            url_opt = "http://localhost:8000/plan/" + context.user.id + "/" + status
        } else {
            url_opt = "http://localhost:8000/plan/" + status
        }
        const result = await axios.get(url_opt, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            setPlans(res.data)
            setFilterData(res.data)
        })
        .catch(error => {
            toast.error("Error: Couldn't fetch data!", {
                position: toast.POSITION.TOP_RIGHT
            })
        })

    }

    const handleSearch = (event)=>
    {
        const getSearch=event.target.value;
        // setQuery(plans);
    
        // if(getSearch.length>0)
        // {
        //     const searchData=filterData.filter((item)=>item.name.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
        //                                             item.supplier.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
        //                                             item.description.toLowerCase().includes(getSearch.toLowerCase().trim()) ||
        //                                             item.created.toString().toLowerCase().includes(getSearch.toLowerCase().trim()));
        //     setMaterials(searchData);
        // }
        // else
        // {
        //     setMaterials(filterData);
        // }
        // setQuery(getSearch);
    }

    const [show, setShow] = useState(false);
    const [cancelPlan, setCancelPlan] = useState();

    const handleClose = () => {
        setShow(false);
        setCancelPlan(null)
    }

    const handleRowPlanManager = async (data) => {
        if (data['status'] !== "PENDING") {
            toast.warning("Can't cancel plans that are approved or declined!", {
                position: toast.POSITION.TOP_RIGHT
            })
            return;
        }
        setCancelPlan(data)
        setShow(true)
    }

    const handleRowProductionManager = async (data) => {
        if (data['status'] === 'PENDING') {
            // navigate to createApprovalOrderPage
            console.log(data)
            navigate('/production/order/create/' + data['id'])
        }
        else {
            toast.warning("Can't create order for plans that are not pending!", {
                position: toast.POSITION.TOP_RIGHT
            })
            return;
        }
    }

    const handleRowClick = async (data) => {
        if (context.role == "Production Manager") {
            handleRowProductionManager(data)
        } else {
            handleRowPlanManager(data)
        }
    }

    const handleDelete = async () => {
        console.log(cancelPlan)

        axios.delete('http://localhost:8000/plan/' + cancelPlan.id, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            console.log(res)
            toast.success("Successfully cancelled the plan!", {
                position: toast.POSITION.TOP_RIGHT
            })
            setPlans((prevPlans) => prevPlans.filter((item) => item.id !== cancelPlan.id));
        })
        .catch(error => {
            toast.error('Something went wrong!', {
                position: toast.POSITION.TOP_RIGHT
            })
            console.log(error)
        })

        setShow(false)
    }
  
    return (
        <div className='container'>
            
            <Navbar bg="light" expand="lg">
                <Container>
                    {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => filterPlansByStatus("pending")}>Pending</Nav.Link>
                        <Nav.Link onClick={() => filterPlansByStatus('approved')}>Approved</Nav.Link>
                        <Nav.Link onClick={() => filterPlansByStatus('declined')} >Declined</Nav.Link>
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">
                            Another action
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">
                            Separated link
                        </NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        <div className='py-4' style={{'width':'75%','margin-left':'280px'}}>
          {/* <input type="text" name="name" autoComplete='off' value={query} className="form-control" onChange={(e)=>handleSearch(e)} placeholder="Search..."/><br/> */}
          <table className="table table-hover border rounded p-4 mt-2 shadow table-striped" style={{'cursor': 'pointer'}}>
            <thead>
              <tr className='table-dark'>
                <th scope="col"></th>
                <th scope="col">PRODUCT</th>
                <th scope="col">START</th>
                <th scope="col">END</th>
                <th scope="col">PRODUCABLE</th>
                <th scope="col">COST</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {
                  plans.map((plan,index)=>(
                  <tr className='table-light' onClick={() => handleRowClick(plan)}>
                  <th scope="row" key={index}>{index+1}</th>
                  <td>{plan.product_name}</td>
                  <td>{new Date(plan.start_date).toLocaleString()}</td>
                  <td>{new Date(plan.end_date).toLocaleString()}</td>
                  <td>{plan.producable_amount}</td>
                  <td>€{plan.production_cost}</td>
                  <td>{plan.status}</td>
                  </tr>
                  ))
              }
            </tbody>
          </table>
          <p style={{'margin-left':'745px', 'margin-top':'20px'}}>Click on row to select the plan</p>
        </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Plan</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Are you sure you want to cancel the selected plan?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Yes
                </Button>
                </Modal.Footer>
             </Modal>
        </div>
    );    
}

export default PlanSearch;