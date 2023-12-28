import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { FcDataConfiguration } from 'react-icons/fc'

export default function DatosConfigurables(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><FcDataConfiguration className="mb-1" /> Datos configurabes</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/emisor`} className="btn btn-outline-secondary btn-sm mb-2">Emisor de factura</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/control-factura`} className="btn btn-outline-secondary btn-sm mb-2">Control de factura</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/correo-campanas`} className="btn btn-outline-secondary btn-sm mb-2">Correo campañas</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/receptor-datos-fiscales`} className="btn btn-outline-secondary btn-sm mb-2">Receptor a facturar</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/configuracionresidencial`} className="btn btn-outline-secondary btn-sm mb-2">Configuración Residencial</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}