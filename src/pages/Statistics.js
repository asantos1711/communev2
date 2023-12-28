import React, { useContext, useState, useEffect } from 'react'
import { authContext } from '../context/AuthContext';
import { Col, Row } from 'react-bootstrap';
import Indicator from '../components/Indicator';
import Chart from '../components/Chart'
import Get from '../service/Get';
import { DASHBOARD_TOTALES } from '../service/Routes';
import IndicatorSkeleton from '../loaders/IndicatorSkeleton';
import BarCharComponent from '../components/BarCharComponent';
import PieCharComponentFP from '../components/PieCharComponentFP';
import PieChartComponentTP from '../components/PieChartComponentTP';
import PieCharComponentIndice from '../components/PieCharComponentIndice';

export default function Statistics(){
    const { auth } = useContext(authContext);
    const [totales, setTotales] = useState([])
    const [isLoadingTotales, setLoadingTotales] = useState(true)

    useEffect(()=>{
        let mounted = true;

        setLoadingTotales(true)
        Get({url: DASHBOARD_TOTALES, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            if(mounted) {
                setTotales(response.data.data)
                setLoadingTotales(false)
            }            
        })
        .catch(error=>{
            //console.log(error)
        })

        return () => mounted = false;
    },[])




    return (
        <Row>
            <Col>
            <Row>
                {
                    isLoadingTotales ? <IndicatorSkeleton /> : <Indicator totales={totales}/>
                }                
            </Row>
            <Row className="my-3">
                <Col xs="12" md="6">
                    <PieCharComponentIndice access_token={auth.data.access_token}/> 
                </Col>
                <Col xs="12" md="6">
                    <BarCharComponent access_token={auth.data.access_token}/>
                </Col>                
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <PieCharComponentFP access_token={auth.data.access_token}/>
                </Col>
                <Col xs="12" md="6">
                    <PieChartComponentTP access_token={auth.data.access_token} />
                </Col>
            </Row>
            {/* <Row className="mt-5 mb-5">
                <Chart access_token={auth.data.access_token} />
            </Row> */}
            </Col>
            
        </Row>
        
    )

}