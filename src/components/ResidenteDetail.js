import React, { useState } from 'react'
import { Card, Dropdown, Row, Col, Modal, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdAccountBalanceWallet } from "react-icons/md";
import { RiAlarmWarningLine, RiBuilding4Line } from 'react-icons/ri';
import { FaUserAlt, FaMapMarkedAlt, FaCalendarCheck, FaFunnelDollar } from 'react-icons/fa';
import { getIconTipoLote } from '../utils/getIconTipoLote';
import DireccionChild from './DireccionChild';
import { formatNumber } from '../utils/formatNumber';
import { getIconCatHab } from '../utils/getIconCatHab';
import { getIconSubCatHab } from '../utils/getIconSubCatHab';
import { getIconCatConst } from '../utils/getIconCatConst';
import { getIconSubCatConst } from '../utils/getIconSubCatConst';
import { getIconRecurrente } from '../utils/getIconRecurrente';
import moment from 'moment'
import ModalPagarMantenimiento from './ModalPagarMantenimiento';
import ModalCorreoCampanas from './ModalCorreoCampanas';
import Get from '../service/Get';
import { LOTE_GET_BY_ID, REPRESENTANTE_LEGAL_GET_BY_LOTE } from '../service/Routes';
import { BsBuilding } from 'react-icons/bs';


export default function ResidenteDetail(props){
    //console.log(props.showModalMtto)  

    const [textRef, setTextRef] = useState('')    
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const [items, setItems] = useState([])
    const getRepresentate = () =>{
        //console.log(props.lote.direccion.id_lote)
        setShow(true)

        Get({url: `${REPRESENTANTE_LEGAL_GET_BY_LOTE}/${props.lote.direccion.id_lote}`, access_token: props.auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data.data)
        })
        .catch(error=>{
            alert("error de servidor")
            console.log(error)
        })
    }

    const onShowLoteFusionPadre = e =>{
        Get({url: `${LOTE_GET_BY_ID}/${props.lote.direccion.id_lote}`, access_token: props.auth.data.access_token})
        .then(response=>{
            let texto = `Fusionado con el lote: ${response.data.data.fusionLote.referencia}`
            setTextRef(texto)
        })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
        <Card className="shadow">
            <Card.Body>
                <Card.Title>
                    {
                        (props.lote.direccion.status !=="fusionado" && props.lote.direccion.status !=="inactivo") ?
                        <div className="d-flex justify-content-between bd-highlight align-items-center">
                            <div>
                                {getIconTipoLote(props.lote.direccion.tipo_lote)}
                                {getIconCatHab(props.lote.direccion.category_hab)}
                                {getIconSubCatHab(props.lote.direccion.sub_category_hab)}
                                {getIconCatConst(props.lote.direccion.category_const)}
                                {getIconSubCatConst(props.lote.direccion.category_const)}
                                {getIconRecurrente(props.lote.direccion.is_recurrente)}
                            </div>
                            <div>
                                <ul className="list-inline mb-0">
                                    {(props.showModalMtto && props.lote.direccion.deuda_mantenimiento===0 && props.lote.direccion.paga_mtto) && <ModalPagarMantenimiento auth={props.auth} id={props.id}/>}
                                    {/* {props.showModalMtto && <ModalAgregarFondos auth={props.auth} id={props.id}/>} */}
                                    {props.showModalMtto && <ModalCorreoCampanas auth={props.auth} id={props.lote.direccion.id_lote}/>}                            
                                    {props.lote.direccion.paga_mtto && <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/mantenimiento/pagar/lote/${props.lote.direccion.id_lote}`}><FaFunnelDollar className="icon-m1" /> <small>Pagar mantenimiento</small></Link>}
                                    <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/estado-cuenta/${props.lote.direccion.id_lote}`}><MdAccountBalanceWallet className="icon-m1" /> <small>Estado de cuenta</small></Link>
                                    <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/deudas/${props.lote.direccion.id_lote}`}><RiAlarmWarningLine className="icon-m1"/> <small>Deudas</small></Link>
                                </ul>
                            </div>
                        </div> :
                        props.lote.direccion.status ==="fusionado" &&
                        <div className="text-right">
                            <span className="mr-2">{textRef}</span>
                            <Button variant="outline-secondary" onClick={onShowLoteFusionPadre}><BsBuilding /></Button>  
                        </div>                        
                    }
                                     
                </Card.Title>
                <Dropdown.Divider />                  
                <Row>
                    <Col>
                        <Row>
                            <Col xs="12" lg="8">
                                <span className="text-secondary d-block"><FaUserAlt className={`mb-1 ${props.lote.direccion.has_representante && 'text-info cursor-pointer'}`} onClick={props.lote.direccion.has_representante ? getRepresentate : ()=>{}}/> {props.lote.direccion.name}</span>
                                <span className="text-secondary d-block">
                                    <RiBuilding4Line className="mb-1"/> <span className="mr-5">{props.lote.direccion.referencia}</span>                                
                                </span>
                                <span className="text-secondary d-block"><FaMapMarkedAlt className="mb-1"/> {props.lote.direccion.direccion}</span>
                                <span className="text-secondary d-block"><FaCalendarCheck className="mb-1" /> {moment(props.lote.direccion.fecha_entrega).format('DD-MM-YYYY')}</span>
                            </Col>
                            {(props.lote.direccion.status !=="fusionado" && props.lote.direccion.status !=="inactivo") && <Col xs="12" lg="4">
                                <span className={`${props.lote.direccion.deuda_moratorio > 0 ? 'text-danger' : 'text-secondary'}  d-block`}>Deuda moratoria: {formatNumber(props.lote.direccion.deuda_moratorio)}</span>
                                <span className={`${props.lote.direccion.deuda > 0 ? 'text-danger' : 'text-secondary'}  d-block`}>Deuda total: {formatNumber(props.lote.direccion.deuda)}</span>                                
                            </Col>}
                        </Row>
                        
                        {props.directions!=null && <DireccionChild direcciones={props.directions} />}
                        {/* {props.fondo!=null && 
                            <span className="text-secondary d-block"><RiHandCoinLine className="mb-1" />{formatNumber(props.fondo)}
                        </span>} */}
                    </Col>
                                        
                </Row>
            </Card.Body>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Representate legal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive hover size="sm" className="tableVertical">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Poder</th>
                                <th>Teléfonos</th>
                                <th>Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map((item, i)=>(
                                    <tr key={i}>
                                        <td width="40%">{item.name}</td>
                                        <td width="30%">{item.tipoPoder}</td>
                                        <td width="15%">
                                            <ul className="list-unstyled">
                                                {
                                                    item.telefonoList.map((tel,i)=>(
                                                        <li key={i}>
                                                            <span className="badge badge-info">{`${tel.tipoNumeroTelefono?.name}-${tel.numero}`}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>                                            
                                        </td>
                                        <td width="15%">
                                            <ul className="list-unstyled">
                                                {
                                                    item.correoElectronicoList.map((tel,i)=>(
                                                        <li key={i}>
                                                            <span className="badge badge-info">{tel.correo}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>                                            
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Aceptar
                </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}