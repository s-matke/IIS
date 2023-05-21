import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from "../../../store/production/AuthContext";

export default function MachineSearch() {

    const [machines, setMachines] = useState([])
    const [filterData, setFilterData] = useState([])
    const[query, setQuery] = useState('')
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    useEffect(()=>{
        loadMachines(); 
    },[])

    const loadMachines = async() => {
        const result=await axios.get("http://localhost:8000/machine/", {
          headers: {
            'Authorization': 'Bearer ' + context.token
          }})
        setMachines(result.data);
        setFilterData(result.data);
    }

    const handleSearch=(event)=>
    {
        const getSearch=event.target.value;
        setQuery(machines);
    
        if(getSearch.length>0)
        {
            const searchData=filterData.filter((item)=>item.name.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                                    item.version.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                                    item.release_date.toLowerCase().includes(getSearch.toLowerCase().trim()) ||
                                                    item.price.toString().toLowerCase().includes(getSearch.toLowerCase().trim()));
            setMachines(searchData);
        }
        else
        {
            setMachines(filterData);
        }
        setQuery(getSearch);
    }

  const handleRowClick = async (data) => {
    const machine_id = data["id"]
    
    navigate('/machine/update/' + machine_id,
    {
      state: {
        data
      }
    })
  }
  
  return (
    <div className='container'>
        <div className='py-4' style={{'width':'75%','margin-left':'280px'}}>
          <input type="text" name="name" autoComplete='off' value={query} className="form-control" onChange={(e)=>handleSearch(e)} placeholder="Search..."/><br/>
          <table className="table table-hover border rounded p-4 mt-2 shadow table-striped" style={{'cursor': 'pointer'}}>
            <thead>
              <tr className='table-dark'>
                <th scope="col"></th>
                <th scope="col">NAME</th>
                <th scope="col">VERSION</th>
                <th scope="col">RELEASE</th>
                <th scope="col">PRICE</th>
                <th scope="col">HEALTH</th>
                <th scope="col">PRODUCED</th>
                <th scope="col">LAST DIAGNOSIS</th>
                <th scope="col">PURCHASE DATE</th>
              </tr>
            </thead>
            <tbody>
              {
                  machines.map((machine,index)=>(
                  <tr className='table-light' onClick={() => handleRowClick(machine)}>
                  <th scope="row" key={index}>{index+1}</th>
                  <td>{machine.name}</td>
                  <td>{machine.version}</td>
                  <td>{machine.release_date}</td>
                  <td>{machine.price}</td>
                  <td>{machine.health}</td>
                  <td>{machine.produced_amount}</td>
                  <td>{machine.last_diagnosis}</td>
                  <td>{machine.purchase_date}</td>
                  </tr>
                  ))
              }
            </tbody>
          </table>
          <p style={{'margin-left':'745px', 'margin-top':'20px'}}>Click on row to select the machine</p>
        </div>
    </div>
  )
}