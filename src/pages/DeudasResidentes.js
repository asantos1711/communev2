import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Get from '../service/Get'
import {RESIDENTE_FOR_DEUDAS } from '../service/Routes'
import { authContext } from '../context/AuthContext'
import { Row, Col } from 'react-bootstrap'
import CardSkeleton from '../loaders/CardSkeleton'
import ResidenteDetail from '../components/ResidenteDetail'
import { ToastContainer } from 'react-toastify'
import 'jspdf-autotable'
import { loaderRequest } from '../loaders/LoaderRequest'
import DeudasResidentesDetail from '../components/DeudasResidentesDetail'

/**
 * Esta funcion sirve para construir la tarjeta desplegada en la parte superior de la vista de detalle, 
 * al momento de pulsar sobre alguna de las opciones mostradas en la lista de resultados, (estado de cuenta, mantenimientos, deudas, etc).
 * @returns 
 */
export default function DeudasResidentes() {
    const {id} = useParams()
    const {auth} = useContext(authContext)
    const[isLoading, setLoading] = useState(true)
    const [isSubmiting, setSubmiting] = useState(false)
    const [directions, setDirections] = useState([])
    const [directionDefault, setDirectionsDefault] = useState([])
    const [lote, setLote] = useState(null)
    const showModalMtto  = true

    useEffect(()=> {
        setLoading(true)
        Get({url: `${RESIDENTE_FOR_DEUDAS}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setLote(response.data.data)
            setDirections(response.data.data.direccion_child)
            setDirectionsDefault(response.data.data.direccion_child)
            setLoading(false)
            
        })
        .catch(error=> {
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
                            isLoading ? <CardSkeleton height={200}/> :
                            <ResidenteDetail id={id} auth={auth} lote={lote} directions={directions} showModalMtto={showModalMtto} />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            isLoading ? <CardSkeleton height={600}/>
                            :
                            <DeudasResidentesDetail
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
