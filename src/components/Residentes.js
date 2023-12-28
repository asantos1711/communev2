import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { IoIosPeople } from 'react-icons/io'
import { Link, useRouteMatch } from 'react-router-dom'
import { isTags } from '../security/isTags';

export default function Residentes({auth}){
    let { url } = useRouteMatch();
    return(
        <Card className="shadow btcl-green btw-2">            
            <Card.Body>
                <Card.Title><IoIosPeople /> Asociados</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    {!isTags(auth.data.role) && <li className="list-inline-item mb-2"><Link to={`${url}/habitantes/asociado`} className="btn btn-outline-secondary btn-sm">Asociados</Link></li>}
                    {!isTags(auth.data.role) && <li className="list-inline-item mb-2"><Link to={`${url}/habitantes/inquilino`} className="btn btn-outline-secondary btn-sm">Inquilinos</Link></li>}
                    {!isTags(auth.data.role) && <li className="list-inline-item mb-2"><Link to={`${url}/representantelegal`} className="btn btn-outline-secondary btn-sm">Representante Legal</Link></li>}
                    <li className="list-inline-item mb-2"><Link to={`${url}/vehiculos`} className="btn btn-outline-secondary btn-sm">Vehículos</Link></li>
                    <li className="list-inline-item mb-2"><Link to={`${url}/tarjeta-acceso`} className="btn btn-outline-secondary btn-sm">Tarjeta de acceso</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}