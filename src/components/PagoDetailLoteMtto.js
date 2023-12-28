import React from 'react'
import { Card, Row, Col, Dropdown } from 'react-bootstrap'
import { formatNumber } from '../utils/formatNumber'
import { FaUserAlt, FaMapMarkedAlt, FaCalendarCheck } from 'react-icons/fa'
import { RiBuilding4Line, RiHandCoinLine } from 'react-icons/ri'
import { getIconTipoLote } from '../utils/getIconTipoLote'
import { getIconCatHab } from '../utils/getIconCatHab'
import { getIconSubCatHab } from '../utils/getIconSubCatHab'
import { getIconCatConst } from '../utils/getIconCatConst'
import { getIconSubCatConst } from '../utils/getIconSubCatConst'
import { getIconRecurrente } from '../utils/getIconRecurrente'
import moment from 'moment'

export default function PagoDetailLoteMtto(props){
    // console.log(props)
    return(
        <Card className="shadow">
            <Card.Title>
                <div className="d-flex align-items-center px-3 pt-3">
                    {getIconTipoLote(props.item.direccion.tipo_lote)}
                    {getIconCatHab(props.item.direccion.category_hab)}
                    {getIconSubCatHab(props.item.direccion.sub_category_hab)}
                    {getIconCatConst(props.item.direccion.category_const)}
                    {getIconSubCatConst(props.item.direccion.category_const)}
                    {getIconRecurrente(props.item.direccion.is_recurrente)}
                </div>                    
            </Card.Title>
            <Dropdown.Divider />
            <Card.Body>
                <Row>
                    <Col xs="12" lg="8">
                        <span className="text-secondary d-block"><FaUserAlt className="mb-1" /> {props.item.asociado}</span>
                        <span className="text-secondary d-block">
                            <RiBuilding4Line className="mb-1"/> <span className="mr-5">{props.item.referencia}</span>
                        </span>
                        <span className="text-secondary d-block"><FaMapMarkedAlt className="mb-1"/> {props.item.direccion.direccion}</span>
                        <span className="text-secondary d-block"><FaCalendarCheck className="mb-1" /> {moment(props.item.direccion.fecha_entrega).format('DD-MM-YYYY')}</span>
                        {/* <span className="text-secondary d-block"><RiHandCoinLine className="mb-1" />
                            {props.item.fondo == null?"$0.00": formatNumber(props.item.fondo.monto)}
                        </span> */}
                    </Col>
                    <Col xs="12" lg="4">
                        <span className={`${props.item.direccion.deuda > 0 ? 'text-danger' : 'text-secondary'}  d-block`}>Deuda: {formatNumber(props.item.direccion.deuda)}</span>
                        <span className={`${props.item.direccion.deuda_moratorio > 0 ? 'text-danger' : 'text-secondary'}  d-block`}>Intereses  moratorios: {formatNumber(props.item.direccion.deuda_moratorio)}</span>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )

}