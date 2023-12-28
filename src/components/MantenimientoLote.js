import React, { useEffect, useContext, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Get from '../service/Get'
import { LOTE_FOR_MTTO, LOTE_FOR_MTTO_DEUDAS } from '../service/Routes'
import { authContext } from '../context/AuthContext'
import { Row, Col } from 'react-bootstrap'
import Lote from './Lote'
import CardSkeleton from '../loaders/CardSkeleton'
import LoteMttoList from './LoteMttoList'
import { toast } from 'react-toastify'

export default function MantenimientoLote(){
    const {id} = useParams()
    const {auth} = useContext(authContext)
    const [lote, setLote] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [mttos, setMttos] = useState([])
    const [isLoadMtto, setLoadMtto] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(()=>{
        setLoading(true)
        Get({url: `${LOTE_FOR_MTTO}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setLote(response.data.data)
            setMttos(response.data.data.mantenimientoList)
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            //console.log(error)
        })
    }, [id])

    const handleShowDeudas = e =>{
        let url = ""
        setChecked(e.target.checked)
        setLoadMtto(true)
        if(e.target.checked){
            url = `${LOTE_FOR_MTTO_DEUDAS}/${id}/1`
        }else{
            url = `${LOTE_FOR_MTTO_DEUDAS}/${id}/0`
        }
        Get({url: url, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setMttos(response.data.data)
            setLoadMtto(false)
        })
        .catch(error=>{
            setLoadMtto(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            //console.log(error)
        })

    }

    return(
        <div>
            <Row className="mb-5">
                <Col>
                    {
                        isLoading ? <CardSkeleton height={25} /> : <Lote lote={lote} />                    
                    }                    
                </Col>
            </Row>
            <Row className="mb-1">
                <Col className="text-right" >
                    {
                        !isLoading && lote.status!=="disponible" && <Link className="btn btn-outline-secondary btn-sm" to={`/mantenimiento/pagar/lote/${id}`}>Pagar Mantenimiento</Link>
                    }                    
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        isLoading || isLoadMtto ? <CardSkeleton height={400} /> 
                        : <LoteMttoList 
                            mantenimientos={mttos} 
                            handleShowDeudas={handleShowDeudas} 
                            checked={checked}
                            status={lote.status}
                          />
                    }
                </Col>
            </Row>
        </div>        
    )


}