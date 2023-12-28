import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdAccountBalanceWallet } from 'react-icons/md'
import { RiAlarmWarningLine } from 'react-icons/ri'
import DireccionResidente from './DireccionChild'
import { FaUserAlt } from 'react-icons/fa'

export default function ResidenteTop(props){
    //console.log(props)
    return(
        <Card className="shadow">
            <Card.Title>
                <div className="d-flex flex-row-reverse bd-highlight align-items-center px-3 pt-3">                    
                    <ul className="list-inline mb-0">
                        <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/estado-cuenta/${props.residente.id}`}><MdAccountBalanceWallet className="icon-m1" /> <small>Estado de cuenta</small></Link>
                        <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/deudas/${props.residente.id}`}><RiAlarmWarningLine className="icon-m1"/> <small>Deudas</small></Link>
                    </ul>
                </div>                    
            </Card.Title>
            <Card.Body>
                <Row>
                    <Col>
                        <span className="text-secondary d-block"><FaUserAlt className="mb-1" /> {props.residente.name}</span>
                        <DireccionResidente direcciones={props.residente.direcciones}/>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}