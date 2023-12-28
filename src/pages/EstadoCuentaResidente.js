import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import Get from '../service/Get'
import {RESIDENTE_FOR_ESTADO_CUENTA} from '../service/Routes'
import { Row, Col } from 'react-bootstrap'
import ResidenteDetail from '../components/ResidenteDetail'
import CardSkeleton from '../loaders/CardSkeleton'
import { ToastContainer } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import EstadoCuentaResidenteDetail from '../components/EstadoCuentaResidenteDetail'

export default function EstadoCuentaResidente(){
    let { id } = useParams()
    const { auth } = useContext(authContext)
    const[isLoading, setLoading] = useState(true)
    const [isSubmiting, setSubmiting] = useState(false)
    const [directions, setDirections] = useState([])
    const [directionDefault, setDirectionsDefault] = useState([])

    const [lote, setLote] = useState(null)
    const showModalMtto  = true
    
    useEffect(()=>{
        setLoading(true)
        Get({url: `${RESIDENTE_FOR_ESTADO_CUENTA}/${id}`, access_token: auth.data.access_token})
        .then(response=>{            
            //console.log(response)
            setLote(response.data.data)
            setDirections(response.data.data.direccion_child)
            setDirectionsDefault(response.data.data.direccion_child)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [id])

    
    return(
        <Row>
            {isSubmiting && loaderRequest()}
            <ToastContainer />
            <Col>
                <Row className="mb-4">
                    <Col>
                        {
                            isLoading ? <CardSkeleton height={200} /> : <ResidenteDetail id={id} auth={auth} lote={lote} directions={directions} showModalMtto={showModalMtto}/>
                        }
                    </Col>                    
                </Row>
                <Row>
                    <Col>
                        {
                            isLoading ? <CardSkeleton height={600} />
                            : <EstadoCuentaResidenteDetail
                                id={id} 
                                lote={lote}
                                access_token={auth.data.access_token}
                                directions={directions}
                                setDirections={setDirections}
                                directionDefault={directionDefault}
                              />
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}