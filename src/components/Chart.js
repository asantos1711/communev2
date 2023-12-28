import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap';
import BarChart from './BarChart';
import LineChart from './LineChart';
import {DASHBOARD_LOTE_ANIO, DASHBOARD_LOTE_MES_ANIO} from '../service/Routes'
import Get from '../service/Get';
import moment from 'moment'
import Skeleton from 'react-loading-skeleton';

export default function Chart(props){
    const [dateAnio, setDateAnio] = useState(new Date())
    const [isLoadingBar, setLoadingBar] = useState(true)
    const [itemsBar, setItemsBar] = useState([])

    const [dateLine, setDateLine] = useState(new Date())
    const [isLoadingLine, setLoadingLine] = useState(true)
    const [itemsLine, setItemsLine] = useState([])

    useEffect(()=>{
        setLoadingBar(true)
        Get({url:   `${DASHBOARD_LOTE_ANIO}/${moment(dateAnio).format('YYYY')}`, access_token: props.access_token})
        .then(response=>{
            //console.log(response)
            setItemsBar(response.data.data)
            setLoadingBar(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    },[dateAnio])

    useEffect(()=>{
        setLoadingLine(true)
        Get({url:   `${DASHBOARD_LOTE_MES_ANIO}/${moment(dateLine).format('M')}/${moment(dateLine).format('YYYY')}`, access_token: props.access_token})
        .then(response=>{
            //console.log(response)
            setItemsLine(response.data.data)
            setLoadingLine(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    },[dateLine])


    return(
        <Col>
            <Row>
                <Col xs lg="6">
                    {
                        isLoadingBar ? <Skeleton height={385} /> : 
                        <BarChart 
                            items={itemsBar}  
                            dateAnio={dateAnio}
                            setDateAnio={setDateAnio}
                        />
                    }                    
                </Col>
                <Col xs lg="6">
                    {
                        isLoadingLine ? <Skeleton height={385} /> :
                        <LineChart 
                            items={itemsLine}  
                            dateLine={dateLine}
                            setDateLine={setDateLine}
                        />
                    }                    
                </Col>
            </Row>            
        </Col>
    )
}