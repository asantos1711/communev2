import React, { useContext, useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import MultaForm from '../components/MultaForm'
import { useParams } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import Get from '../service/Get'
import { LOTE_FOR_SANCION, TIPO_MULTA_GET, USER_APP_GET_BY_LOTE } from '../service/Routes'
import CardSkeleton from '../loaders/CardSkeleton'
import ResidenteDetail from '../components/ResidenteDetail'
import GetAll from '../service/GetAll'

export default function GenerarMulta(){
    let { id } = useParams()
    const { auth } = useContext(authContext)
    const [lote, setLote]  = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [tiposMultas, setTiposMultas] = useState([])
    const [token, setToken] = useState(null)

    useEffect(()=>{
        const urls = [`${LOTE_FOR_SANCION}/${id}`, TIPO_MULTA_GET]
        GetAll({urls: urls, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response[0])
            setLote({direccion: response[0].data.data})
            setTiposMultas(response[1].data)
            setLoading(false)
        })
        .catch(error=>{
            // console.log("error")
            // console.log(error)
        })
    },[])

    //get lote para enviar notificacion a la cuenta del cliente si este tiene
    useEffect(()=>{
       Get({url: `${USER_APP_GET_BY_LOTE}/${id}`, access_token: auth.data.access_token})
       .then(response=>{
         //console.log(response)
         setToken(response.data.data.token)
       })
       .catch(error=>{
        setToken(null)
       }) 
    },[])


    return(
        <Row>
            <Col>
                <Row className="mb-4">
                    <Col>
                        {
                            isLoading ? <CardSkeleton height={50} /> : <ResidenteDetail lote={lote} directions={null} />
                        }                        
                    </Col>                    
                </Row>
                <Row className="mb-4">
                    <Col>
                        {
                            isLoading ? <CardSkeleton height={300} /> : 
                            <MultaForm access_token={auth.data.access_token} id={id} tiposMultas={tiposMultas} token={token}/>
                        }
                        
                    </Col>
                </Row>                
            </Col>
        </Row>
        
    )
}