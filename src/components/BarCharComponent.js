import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import CardSkeleton from '../loaders/CardSkeleton';
import Get from '../service/Get';
import { DASHBOARD_CARTERA_VENCIDA } from '../service/Routes';
  

export default function BarCharComponent({access_token}){
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(()=>{
      let mounted = true;
      Get({url: DASHBOARD_CARTERA_VENCIDA, access_token: access_token})
      .then(response=>{
        //console.log(response)
        if(mounted) {
          setData(response.data.data)
          setLoading(false)
        }
      })
      .catch(error=>{
        setLoading(false)
        toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
        //console.log(error)
      })
      return () => mounted = false;
    },[])

      return (
        loading ? <CardSkeleton height={390}/> :
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>Cartera vencida</Card.Title>
                <Dropdown.Divider />
                <Row className="mt-3">
                <Col>                    
                    <BarChart
                        width={600}
                        height={300}
                        data={data}
                        margin={{
                          top: 5, right: 30, left: 20, bottom: 5,
                        }}
                        barSize={20}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis type="number" domain={[0,  700]}/> 
                          <Tooltip />       
                          <Bar dataKey="cantidad" fill="#007bff" />
                        </BarChart>
                    </Col>
            </Row>
            </Card.Body>            
        </Card>
                  
      );
}