import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { FaFileInvoiceDollar } from 'react-icons/fa'

export default function FacturaNomencladores(){
    let { url } = useRouteMatch()

    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><FaFileInvoiceDollar className="mb-1" /> Facturas</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item mb-2"><Link to={`${url}/metodo-pago-cfdi`} className="btn btn-outline-secondary btn-sm">Método pago CFDI </Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/forma-pago-cfdi`} className="btn btn-outline-secondary btn-sm">Forma pago CFDI </Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/uso-cfdi`} className="btn btn-outline-secondary btn-sm">Uso CFDI </Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/tipo-comprobante`} className="btn btn-outline-secondary btn-sm">Tipo comprobante </Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/tipo-documento`} className="btn btn-outline-secondary btn-sm">Tipo documento </Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/clave-unidad`} className="btn btn-outline-secondary btn-sm">Clave unidad</Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/clave-producto-servicio`} className="btn btn-outline-secondary btn-sm">Clave producto servicio</Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/motivo-cancelacion`} className="btn btn-outline-secondary btn-sm">Motivo de cancelación</Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/relacion-factura`} className="btn btn-outline-secondary btn-sm">Relación de factura</Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/regimen-fiscal`} className="btn btn-outline-secondary btn-sm">Régimen fiscal</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}