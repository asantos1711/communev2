import React, { useState } from 'react'
import { Card, Row, Col, Alert, Button, Table } from 'react-bootstrap'
import { FaDownload } from 'react-icons/fa'
import { loaderRequest } from '../loaders/LoaderRequest';
import moment from 'moment';
import Post from '../service/Post';
import { FACTURA_NOTA } from '../service/Routes';
import { formatNumber } from '../utils/formatNumber';
import { notaPDF } from '../utils/notaPDF';
import { getLogoResidencial } from '../utils/getLogoResidencial';

export default function FacturaNoGenerada({cobros, mensajeProveedor, access_token}){
    //console.log(cobros)
    //console.log(access_token)
    //console.log(mensajeProveedor)


    const [isLoading, setLoading] = useState(false)
    const [items, setItems] = useState([])

    const downloadNotaPDF = () =>{
        //console.log('entro')
        //console.log(cobros)
        setLoading(true)
        const d = {
            dataLists: cobros
        }
        Post({url: FACTURA_NOTA, data: d, access_token: access_token, header: true})
        .then(response=>{
            //console.log(response)
            setItems(response.data.data)
            notaPDF(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
        })
        
    }

    return(
        <div>
            {isLoading && loaderRequest()}
            <Card className="shadow">                
                <Card.Body>                
                    <Row className="justify-content-md-center mb-4">
                        <Col xs="12" lg={7}>
                            <Alert variant="danger" className="text-center">No se ha podido generar la factura con éxito. 
                            Intente más tarde por favor</Alert>
                        </Col>
                    </Row>
                    {
                        mensajeProveedor &&
                        <Row className="justify-content-md-center mb-4">
                            <Col xs="12" lg={7}>
                                <Alert variant="info">
                                    <strong className='d-block'>Mensaje del proveedor</strong>
                                    {mensajeProveedor}
                                </Alert>
                            </Col>
                        </Row>
                    }
                    <Row className="justify-content-md-center">
                        <Button variant="secondary" className="mr-2" onClick={downloadNotaPDF}><FaDownload /> Descargar nota</Button>{' '}
                    </Row>                    
                </Card.Body>
            </Card>
            <Table size="sm" hover responsive id="tableFNG" style={{display: 'none'}}>
                <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th className="text-center">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item,i)=>(
                            <tr key={i}>
                                <td width="15%">{item.id}</td>
                                <td width="15%">{moment(item.fecha).format("DD-MM-YYYY")}</td>
                                <td width="60%">{item.concepto}</td>
                                <td width='10%' className="text-center">{formatNumber(item.monto)}</td>
                            </tr>
                        ))                        
                    }                   
                </tbody>                
            </Table>
            <img src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} alt="RioLogo" id="rioLogo" style={{display: 'none'}}/>    
        </div>
    )
}