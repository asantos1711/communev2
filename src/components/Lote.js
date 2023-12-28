import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { FaUserAlt, FaMapMarkedAlt, FaCalendarCheck } from 'react-icons/fa'
import { RiBuilding4Line } from 'react-icons/ri'
import { getIconTipoLote } from '../utils/getIconTipoLote'
import {calcDeudaOfMtto} from '../utils/calcDeudaOfMtto'
import { getIconCatHab } from '../utils/getIconCatHab'
import { getIconSubCatHab } from '../utils/getIconSubCatHab'
import { getIconCatConst } from '../utils/getIconCatConst'
import { getIconSubCatConst } from '../utils/getIconSubCatConst'
import { getIconRecurrente } from '../utils/getIconRecurrente'
import { formatNumber } from '../utils/formatNumber'
import moment from 'moment'

export default function Lote(props){
    //console.log(props)
    return(
        <Card className="shadow">
            <Card.Body>
                <Row>
                    <Col xs="12" lg="8">
                        <span className="text-secondary d-block"><FaUserAlt className="mb-1" /> {props.lote.asociado ? props.lote.asociado: "Sin asociado"}</span>
                        <span className="text-secondary d-block">
                            <RiBuilding4Line className="mb-1"/> <span className="mr-5">{props.lote.referencia}</span>
                        </span>
                        <span className="text-secondary d-block"><FaMapMarkedAlt className="mb-1"/> {props.lote.direccion}</span>
                        <span className="text-secondary d-block"><FaCalendarCheck className="mb-1" /> {moment(props.lote.fecha_entrega).format('DD-MM-YYYY')}</span>
                    </Col>
                    <Col xs="12" lg="4">
                    <span className={`${props.lote.deuda_moratoria > 0 ? 'text-danger' : 'text-secondary'}  d-block`}>Deuda  moratoria: {formatNumber(props.lote.deuda_moratoria)}</span>
                        <span className={`${calcDeudaOfMtto(props.lote.mantenimientoList) > 0 ? 'text-danger' : 'text-secondary'} d-block`}>Deuda total: {formatNumber(calcDeudaOfMtto(props.lote.mantenimientoList))}</span>                        
                    </Col>
                    <Col xs="12" lg="12">
                        {getIconTipoLote(props.lote.tipo_lote)}
                        {getIconCatHab(props.lote.category_hab)}
                        {getIconSubCatHab(props.lote.sub_category_hab)}
                        {getIconCatConst(props.lote.category_const)}
                        {getIconSubCatConst(props.lote.category_const)}
                        {getIconRecurrente(props.lote.is_recurrente)}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}