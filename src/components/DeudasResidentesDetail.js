import React, { useEffect, useState } from 'react'
import { Card, Dropdown, Row, Col, Form, Button, Jumbotron, Container, Table, OverlayTrigger, Popover, Modal, DropdownButton } from 'react-bootstrap'
import moment from 'moment'
import { RiMailSendLine } from 'react-icons/ri'
import { formatNumber } from '../utils/formatNumber'
import Post from '../service/Post'
import { RESIDENTE_EMAIL, RESIDENTE_FOR_DEUDAS_DETAIL, RESIDENTE_FOR_DEUDAS } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import { FaDownload, FaCalendarCheck, FaMapMarkerAlt } from 'react-icons/fa'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from 'react-toastify'
import { getUrlPago } from '../utils/getUrlPago'
import { Link } from 'react-router-dom'
import WaveLoading from 'react-loadingg/lib/WaveLoading'
import Get from '../service/Get'
import { BsThreeDots } from 'react-icons/bs'
import { setBagdeStatus } from '../utils/setBagdeStatus'

/**
 * Esta funcion permite generar la vista de deudas, en donde se ven la lista de las deudas (vigentes o incompletas) que posee el lote, y tambien
 * maneja las solicitudes de descarga y envio por correo, en formato pdf, de dicha lista.
 * @param {*} props Trae los detalles generados en DeudasResidentes: id, [objeto] lote, access_token [del usuario actual], 
 * directions, [variable de estado] setDirections y directionDefault.
 * @returns devuelve la vista de deudas, el modal para enviar por correo (al solicitarse).
 * 
 */
export default function DeudasResidentesDetail(props) {
    const [items, setItems] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [variante, setVariante] = useState(0)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [show, setShow] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false)
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        handleDeudas()
    }, [])

    const handleDeudas = e => {
        const data = {
            id: variante === 0 ? props.lote.direccion.id_lote : variante,
            variante: variante,
            email: false
        }
        setLoading(true);

        Post({ url: RESIDENTE_FOR_DEUDAS_DETAIL, data: data, access_token: props.access_token, header: true })
            .then(response => {
                // console.log(response)
                setItems(response.data.data)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador", { autoClose: 8000 })
                setLoading(false)
            })

    }

    const handleVariant = (item, i) => {
        setActiveIndex(i)
        setVariante(item)

        if (item === 0) {
            props.setDirections(props.directionDefault)
        } else {
            let aux = props.directionDefault
            props.setDirections(aux.filter(a => a.id_lote === item))
        }
    }

    const drawCell = data => {
        //console.log(row)
        // console.log(data)
        // if (data.section === 'body' && data.column.index === 5) {
        //     data.doc.setTextColor('red')
        // }
    }

    const options2 = { style: 'currency', currency: 'USD' };
    const numberFormat2 = new Intl.NumberFormat('en-US', options2);
    const downloadPDF = e => {
        setHidden(true);
        // console.log("Estas en downloadPDF");
        var Deudor = 0;
        var lote_idchild = 0;
        var doc = new jsPDF('p', 'pt', 'a4', { putOnlyUsedFonts: true });
        doc.setFontSize(14);
        doc.text(`Deudas del lote`, 40, 50)
        if(variante === 0) {
            doc.text(`Asociado: ${props.lote.direccion.name}`, 40, 70)
            doc.setFontSize(10);
            doc.text(`Referencia: ${props.lote.direccion.referencia}`, 40, 90)
            doc.setFontSize(10);
            doc.text(`Direccion: ${props.lote.direccion.direccion}`, 40, 110)
            doc.setFontSize(10);
            doc.text(`Tipo de lote: ${props.lote.direccion.tipo_lote}`, 40, 130)
            doc.setFontSize(10);
        } else if (props.lote.direccion_child != null) {
            const res = props.lote.direccion_child.filter(item => item.id_lote === variante)
            doc.text(`Asociado: ${res[0].name}`,40, 70)
            doc.setFontSize(10);
            doc.text(`Referencia: ${res[0].referencia}`, 40, 90)
            doc.setFontSize(10);
            doc.text(`Direccion: ${res[0].direccion}`, 40, 110)
            doc.setFontSize(10);
            doc.text(`Tipo de lote: ${res[0].tipo_lote}`, 40, 130)
            doc.setFontSize(10);
        }
        
        doc.text(`Fecha de consulta: ${moment().format("DD-MM-YYYY h:mm:ss a")}`, 40, 150)
        doc.setFontSize(10);
        const headers = [["Descripcion", "Saldo"]]

        const data = items.map(elt => [
            elt.descripcion,
            numberFormat2.format(elt.saldo)
        ]);

        doc.autoTable({
            theme: 'striped',
            head: headers,
            body: data,
            willDrawCell: drawCell,
            startY: 170
        });
        var deuda = 0;
        if(variante === 0) {
            deuda = props.lote.direccion.deuda;
        } else {
            const res = items.filter(item => item.lote_id === variante)
            for(let i = 0; i < res.length; i++) {
                deuda += res[i].saldo;
            }
        }
        
        doc.autoTable({
            theme: 'plain',
            body: [
                [
                    { content: 'Monto de deuda total', colSpan: 3, styles: { halign: 'left' } },
                    { content: `${numberFormat2.format(deuda)}`, styles: { halign: 'center', cellWidth: 70, textColor: [220, 53, 69] } },
                ],
            ],
            startY: doc.autoTable.previous.finalY + 5,
        });
        doc.save(`Deudas_Referencia_${props.lote.direccion.referencia}_${moment().format("DD-MM-YYYY__h_mm_ss_a")}.pdf`)
        setHidden(false)
    }

    const handleClose = () => setShow(false);
    const commonStyle = {
        margin: 'auto',
        position: 'initial',
        left: 0,
        right: 0,
        top: 10,
        bottom: 10
    };

    const showEmail = () => {
        Get({ url: `${RESIDENTE_EMAIL}/${props.id}`, access_token: props.access_token })
            .then(response => {
                console.log(response);
                setEmailDefault(response.data)
                setShow(true)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const sendEmail = () => {
        setSendingEmail(true)
        const data = {
            id: variante === 0 ? props.lote.direccion.id_lote : variante,
            variante: variante,
            email: true,
            correoElectronico: emailDefault,
            correoAdicional: emailPlus
        }
        Post({ url: RESIDENTE_FOR_DEUDAS_DETAIL, data: data, access_token: props.access_token, header: true })
            .then(response => {
                console.log(response);
                setSendingEmail(false)
                setEmailPlus("")
                setShow(false)
                toast.success("Se ha enviado el correo electrónico satisfactoriamente", { autoClose: 5000 })
            })
            .catch(error => {
                console.log(error);
                setSendingEmail(false)
                setEmailPlus("")
                setShow(false)
                toast.error("No se ha podido enviar el correo electrónico. Intente más tarde", { autoClose: 5000 })
            })
    }

    return (
        <Card className='shadow'>
            {isLoading && loaderRequest()}
            <Card.Body>
                <Card.Title>Deudas</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline">
                    <li className="list-inline-item"><Button variant={activeIndex === -1 ? "primary" : "outline-primary"} size="sm" onClick={e => handleVariant(0, -1)}>Todos</Button></li>
                    {
                        props.lote.direccion_child != null &&
                        props.lote.direccion_child.map((item, i) => (
                            <li className="list-inline-item" key={i}>
                                <OverlayTrigger
                                    trigger={['hover', 'focus']}
                                    key='top'
                                    placement='top'
                                    overlay={
                                        <Popover id={`popover-positioned-top`}>
                                            <Popover.Content>
                                                <div><FaCalendarCheck className="mb-1" />{' '}
                                                    {item.fecha_entrega === null ? "No entregado" : moment(item.fecha_entrega).format('DD-MM-YYYY')}</div>
                                                <div><FaMapMarkerAlt className="mb-1" /> {item.direccion}</div>
                                            </Popover.Content>
                                        </Popover>
                                    }
                                >
                                    <Button variant={activeIndex === i ? "primary" : "outline-primary"}
                                        size="sm" onClick={e => handleVariant(item.id_lote, i)}
                                    >{item.referencia}</Button>
                                </OverlayTrigger>
                            </li>
                        ))
                    }
                </ul>
                <Dropdown.Divider />
                <Row>
                    <Col xs="12" lg="12">
                        <div className="d-flex justify-content-between align-items-center">
                            <ul className="list-inline">
                                <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={e => showEmail()}><RiMailSendLine /></Button></li>
                                <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={e => downloadPDF()}><FaDownload /></Button></li>
                                <Button variant="outline-primary" onClick={handleDeudas}>Ver</Button>
                            </ul>
                        </div>
                    </Col>
                </Row>
                <Dropdown.Divider />

                {

                    items.length === 0 ? <Row><Col><Jumbotron fluid className="text-center"><Container>No tiene deudas</Container></Jumbotron></Col></Row> :
                        <Row>
                            <Col className="h-600">
                                <Table size="sm" hover className="v-middle">
                                    <thead>
                                        <tr>
                                            <th>Descripción</th>
                                            <th className="text-center">Saldo</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map((item, i) => (
                                                <tr key={i}>
                                                    <td width="50%">{item.descripcion}</td>

                                                    <td width="10%" className="text-center">{formatNumber(item.saldo)}</td>
                                                    <td width="5%">
                                                        <DropdownButton variant="light" alignRight id="dropdown-table" title={<BsThreeDots />} size="sm">
                                                            <Dropdown.Item as="button"><Link className="dropdown-link" to={getUrlPago(item.tipo, item.identificador, item.lote_id)}>Pagar deuda</Link></Dropdown.Item>
                                                            {
                                                                item.tipo === 'sancion' &&
                                                                <>
                                                                    <Dropdown.Item as="button"><Link className="dropdown-link" to={`/condonar/deuda/${item.identificador}`}>Condonar deuda</Link></Dropdown.Item>
                                                                    <Dropdown.Item as="button"><Link className="dropdown-link" to={`/cancelar/deuda/${item.identificador}`}>Cancelar deuda</Link></Dropdown.Item>
                                                                </>
                                                            }
                                                            {
                                                                item.tipo === 'cuota' &&
                                                                <>
                                                                    <Dropdown.Item as="button"><Link className="dropdown-link" to={`/condonar/cuota/${item.identificador}`}>Condonar deuda</Link></Dropdown.Item>
                                                                    <Dropdown.Item as="button"><Link className="dropdown-link" to={`/cancelar/cuota/${item.identificador}`}>Cancelar deuda</Link></Dropdown.Item>
                                                                </>
                                                            }
                                                        </DropdownButton>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs="12" lg="12">
                                <Table size="sm" responsive id="tableTotalEC">
                                    <thead>
                                        <tr>
                                            <th colSpan="4">Monto de deuda total</th>
                                            <th width='10%' className="text-center">
                                                {
                                                    <span className='text-danger'>{formatNumber(props.lote.direccion.deuda)}</span>
                                                }
                                            </th>
                                            <th width="5%"></th>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                        </Row>
                }

            </Card.Body>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enviar por correo electrónico</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${sendingEmail && 'h-100p'}`}>
                    {
                        sendingEmail ?
                            <div className="loadModal">
                                <h6 style={{ color: '#7186ed' }}>Enviando correo electrónico</h6>
                                <WaveLoading style={commonStyle} color={"#6586FF"} />
                            </div>
                            : <div>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">
                                        Correo electrónico
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control plaintext readOnly defaultValue={emailDefault === "" ? 'No existe' : emailDefault} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">
                                        Adicional
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control value={emailPlus} onChange={e => setEmailPlus(e.target.value)} />
                                    </Col>
                                </Form.Group>
                            </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={sendEmail} disabled={sendingEmail}>Enviar</Button>
                </Modal.Footer>
            </Modal>

        </Card>
    )
}
