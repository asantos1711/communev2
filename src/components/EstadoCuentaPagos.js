import React from 'react'
import { Card, Dropdown, Row, Col, Table, DropdownButton } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'

export default function EstadoCuentaPagos(props){
    return(
        <Row>
            <Col className="mh-400">
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th className="text-right">Importe</th>
                            <th></th>
                            <th>Descripción</th>                            
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.items.length === 0
                            ?<tr><td className="list-empty" colSpan="5">No existen pagos</td></tr> 
                            : props.items.map((item,i)=>(
                                <tr key={i}>
                                    <td className="text-right" width="10%"><NumberFormat value={item.pagado} prefix="$" thousandSeparator={true} fixedDecimalScale={true} decimalScale={2} displayType="text" /></td>
                                    <td className="text-center" width="20%"><span className="badge badge-pill badge-light">{item.pagoStatus}</span></td>
                                    <td></td>
                                    <td width="20%">{moment(item.created_at).format("DD-MMM-YYYY HH:mm")}</td>
                                    <td width="5%">                                        
                                    <DropdownButton id="dropdown-table" alignRight title={<BsThreeDots />} size="sm" variant="light">
                                    <Dropdown.Item as="button"><Link className="dropdown-link" to="">Ver datos del pago</Link></Dropdown.Item>
                                    </DropdownButton>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}