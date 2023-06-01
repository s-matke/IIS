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


function ProductionSearch() {

    const [productionOrder, setProductionOrder] = useState([])
    const [filterData, setFilterData] = useState([])
    const[query, setQuery] = useState('')
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    useEffect(()=>{
        loadAllOrders()
    },[])

    const loadAllOrders = async() => {
        const result = await axios.get("http://localhost:8000/production/order/", {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })

        setProductionOrder(result.data)
        setFilterData(result.data)
    }

    const filterProductionOrderByState = async(state) => {

        var url_opt = "http://localhost:8000/production/order/" + state;
        
        await axios.get(url_opt, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            setProductionOrder(res.data)
            setFilterData(res.data)
        })
        .catch(error => {
            toast.error("Error: Couldn't fetch data!", {
                position: toast.POSITION.TOP_RIGHT
            })
        })

    }

    const [show, setShow] = useState(false);
    const [cancelProductionOrder, setCancelProductionOrder] = useState();

    const handleClose = () => {
        setShow(false);
        setCancelProductionOrder(null)
    }

    const handleRow = async (data) => {
        // if (data['status'] !== "PENDING") {
        //     toast.warning("Can't cancel production orders that are approved or declined!", {
        //         position: toast.POSITION.TOP_RIGHT
        //     })
        //     return;
        // }
        setCancelProductionOrder(data)
        setShow(true)
    }

    const handleRowClick = async (data) => {
        console.log(data)
        if (data['state'] !== 'CANCELLED' && data['state'] !== 'FINISHED') {
            setCancelProductionOrder(data)
            setShow(true)
        } else {
            toast.warning("Can't cancel finished or already cancelled orders!", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleCancel = async () => {
        console.log(cancelProductionOrder)
        
        axios.put(`http://localhost:8000/production/cancel/` + cancelProductionOrder.id, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            toast.success('Successfully cancelled the order!', {
                position: toast.POSITION.TOP_RIGHT
            })
            loadAllOrders()
        })
        .catch(error => {
            toast.error('Something went wrong!', {
                position: toast.POSITION.TOP_RIGHT
            })
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
                        <Nav.Link onClick={() => filterProductionOrderByState("PENDING")}>Pending</Nav.Link>
                        <Nav.Link onClick={() => filterProductionOrderByState('ACTIVE')}>Active</Nav.Link>
                        <Nav.Link onClick={() => filterProductionOrderByState('FINISHED')} >Finished</Nav.Link>
                        <Nav.Link onClick={() => filterProductionOrderByState('CANCELLED')} >Cancelled</Nav.Link>
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
                <th scope="col">COST</th>
                <th scope="col">MACHINE</th>
                <th scope="col">PRIORITY</th>
                <th scope="col">STATE</th>
              </tr>
            </thead>
            <tbody>
              {
                  productionOrder.map((order,index)=>(
                  <tr className='table-light' onClick={() => handleRowClick(order)}>
                  <th scope="row" key={index}>{index+1}</th>
                  <td>{order.plan.product_name}</td>
                  <td>{new Date(order.plan.start_date).toLocaleString()}</td>
                  <td>{new Date(order.plan.end_date).toLocaleString()}</td>
                  <td>€{order.plan.production_cost}</td>
                  <td>{order.machine == null ? '-' : order.machine.name }</td>
                  <td>{order.priority}</td>
                  <td>{order.state}</td>
                  {/* <td>{plan.status}</td> */}
                  </tr>
                  ))
              }
            </tbody>
          </table>
          <p style={{'margin-left':'745px', 'margin-top':'20px'}}>Click on row to select the production order</p>
        </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Production Order</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Are you sure you want to cancel the selected order?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={handleCancel}>
                    Yes
                </Button>
                </Modal.Footer>
             </Modal>
        </div>
    );    
}

export default ProductionSearch;