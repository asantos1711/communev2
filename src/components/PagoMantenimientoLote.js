import React, { useContext, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import Get from '../service/Get'
import { PAGO_MTTO } from '../service/Routes'
import { Row, Col } from 'react-bootstrap'
import CardSkeleton from '../loaders/CardSkeleton'
import MttoDetail from './MttoDetail'
import PagoList from './PagoList'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { toast, ToastContainer } from 'react-toastify'

export default function PagoMantenimientoLote(){
    const {id} = useParams()
    const {auth} = useContext(authContext)
    const [isLoading, setLoading] = useState(true)
    const [mtto, setMtto] = useState(null)
    let history = useHistory()

    useEffect(()=>{
        setLoading(true)
        Get({url: `${PAGO_MTTO}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setMtto(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            // console.log(error)
        })
    }, [id])

    return(
        <div>
            <ToastContainer />
            <Row className="mb-1">
                <Col className="text-right">
                    {
                        isLoading ? "" : <span className="badge badge-pill badge-dark go-back" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>                  
                    } 
                </Col>
            </Row>
            <Row className="mb-5">
                <Col>
                    {
                        isLoading ? <CardSkeleton height={25} /> : <MttoDetail mtto={mtto} />                    
                    }                    
                </Col>
            </Row>            
            <Row>
                <Col>
                    {
                        isLoading ? <CardSkeleton height={230} /> : <PagoList items={mtto.cobroMantenimientoList} />                    
                    } 
                </Col>
            </Row>
        </div> 
    )
}