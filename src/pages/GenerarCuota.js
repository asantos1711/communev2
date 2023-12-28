import React, { useContext, useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useParams } from "react-router-dom"
import CuotaForm from "../components/CuotaForm"
import ResidenteDetail from "../components/ResidenteDetail"
import { authContext } from "../context/AuthContext"
import CardSkeleton from "../loaders/CardSkeleton"
import GetAll from "../service/GetAll"
import { LOTE_FOR_SANCION, TIPO_CUOTA_GET_ACTIVE } from "../service/Routes"

function GenerarCuota(){
    let { id } = useParams()
    const { auth } = useContext(authContext)
    const [lote, setLote]  = useState({})
    const [isLoading, setLoading] = useState(true)
    const [tiposCuotas, setTiposCuotas] = useState([])

    useEffect(()=>{
        const urls = [`${LOTE_FOR_SANCION}/${id}`, TIPO_CUOTA_GET_ACTIVE]
        GetAll({urls: urls, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setLote({direccion: response[0].data.data})
            setTiposCuotas(response[1].data)
            setLoading(false)
        })
        .catch(error=>{
            // console.log("error")
            // console.log(error)
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
                            <CuotaForm access_token={auth.data.access_token} id={id} tiposCuotas={tiposCuotas}/>
                        }
                        
                    </Col>
                </Row>                
            </Col>
        </Row>
        
    )
}

export default GenerarCuota