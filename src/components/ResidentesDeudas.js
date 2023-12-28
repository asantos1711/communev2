import React from 'react'
import { Row, Col, Table, DropdownButton, Dropdown } from 'react-bootstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { setBagdeStatus } from '../utils/setBagdeStatus'

export default function ResidentesDeudas(props){
    return(
        <Row>
            <Col className="mh-400">
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Monto</th>                            
                            <th className="text-center">Estado pago</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.items.map((item,i)=>(
                                <tr key={i}>
                                    <td width="20%">{moment(item.created_at).format("DD-MMM-YYYY HH:mm")}</td>
                                    <td width="40%">{item.tipoMulta.name}</td>
                                    <td width="10%"><NumberFormat value={item.tipoMulta.monto} prefix="$" fixedDecimalScale={true} decimalScale={2} displayType="text" /></td>
                                    <td width="20%" className="text-center"><span className={`badge badge-pill ${setBagdeStatus(item.pagoStatus)}`}>{item.pagoStatus}</span></td>
                                    <td width="5%">                                        
                                        <DropdownButton id="dropdown-table" alignRight title={<BsThreeDots />} size="sm" variant="light">
                                            <Dropdown.Item as="button"><Link className="dropdown-link" to={`/pagar-sancion/${item.id}`}>Pagar</Link></Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={e=>props.handlePaymentFound(item.id,item.tipoMulta.monto, item.pagoStatus)}>Pagar con fondos</Dropdown.Item>
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