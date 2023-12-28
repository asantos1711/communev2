import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, FormControl, InputGroup, Row, Table } from 'react-bootstrap';
import { authContext } from '../context/AuthContext';
import TableSkeleton from '../loaders/TableSkeleton';
import moment from 'moment';
import { formatNumber } from '../utils/formatNumber';
import Get from '../service/Get';
import { FACTURAS_CANCELADAS, UPDATE_FOLIO_REFERENCIAR } from '../service/Routes';
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import { FaDownload, FaEdit, FaCheck } from 'react-icons/fa';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';
registerLocale("es", es)

export default function FacturaCancelada() {
    const { auth } = useContext(authContext);
    const [isLoading, setIsLoading] = useState(true);
    const [mes, setMes] = useState(moment().format("MM"));
    const [year, setYear] = useState(moment().format("YYYY"));
    const [facturas, setFacturas] = useState([]);
    const [fecha, setFecha] = useState(new Date());
    const [showIndexInput, setShowIndexInput] = useState(-1);
    const [isSubmiting, setIsSubmiting] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        Get({url: `${FACTURAS_CANCELADAS}/${mes}/${year}`, access_token: auth.data.access_token})
        .then(response=>{
            setFacturas(response.data)
            setIsLoading(false);
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [auth.data.access_token, mes, year])

    const handleFecha = date =>{
        if(date===null){
            setFecha(new Date())
            setMes(moment(new Date()).format("MM"))
            setYear(moment(new Date()).format("YYYY"))
        }else{
            setFecha(date)
            setMes(moment(date).format("MM"))
            setYear(moment(date).format("YYYY"))
        }
    }
    
    
    const downloadPDF = () =>{
        var doc = new jsPDF('l', 'pt', 'a4', {putOnlyUsedFonts: true});
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);
        doc.setFontSize(14);
        doc.text(`Facturas canceladas ${moment(fecha).format("MMMM")}-${moment(fecha).format("YYYY")}`, 40, 50);
        const headers = [["Fecha cancelada", "Folio", "Referencia", "Motivo cancelación", "Folio fiscal a relacionar", "Folio fiscal", "Monto"]];

        const data = facturas.map(elt => [
            elt.fechaCancelada,
            elt.folio,
            elt.referenciaReceptor,
            elt.motivoCancelacion,
            elt.folioFiscalRelacionar,
            elt.folioFiscal,
            numberFormat2.format(elt.total)
        ]);

        doc.autoTable({
            theme: 'striped',
            head: headers,
            body: data,
            startY: 75,
        });

        doc.save(`facturas_canceladas_${moment(fecha).format("MM")}_${moment(fecha).format("YYYY")}.pdf`)
    }

    const onHadleChange = (value, index) =>{
        let facturaA = [...facturas]
        facturaA[index].folioFiscalRelacionar = value
        setFacturas(facturaA)
    }

    const saveFolio = (index) =>{
        setIsSubmiting(true)
        let factura = facturas[index]
        let dt = {
            id: factura.id,
            name: factura.folioFiscalRelacionar
        }
        Post({url: UPDATE_FOLIO_REFERENCIAR, data: dt, access_token: auth.data.access_token, header: true})
        .then(response=>{
            setIsSubmiting(false)
            toast.success("Acción exitosa")
            setShowIndexInput(-1)
        })
        .catch(error=>{
            setIsSubmiting(false)
            toast.error("No se puede ejecutar la acción. Intente más tarde por favor")
        })        
    }

    return(
        <Card className="shadow">
            {isSubmiting && loaderRequest()}
            <ToastContainer />
            <Card.Body>
                <Card.Title>{`Facturas canceladas`}  </Card.Title>
                <Dropdown.Divider />  
                <Row className="mb-4">
                    <Col xs lg="3">
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="3">Filtrar</Form.Label>
                            <Col sm="9">
                                <DatePicker className="form-control"
                                    dateFormat="MMMM/yyyy"
                                    locale="es"
                                    selected={fecha}
                                    onChange={date => handleFecha(date)}
                                    showMonthYearPicker
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Dropdown.Divider/>

                {
                    isLoading ? <TableSkeleton />
                    :
                    <div>
                        <Row>
                            <Col xs="12" lg="12">
                                <Button variant="dark" className="mr-1 btn-xs" size="sm" onClick={e=>downloadPDF()}>Descargar PDF<FaDownload /></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="12" className={`fact-font mt-4 ${facturas.length > 15 && 'h-600'}`} >
                                <div className='react-bootstrap-table'>
                                    <Table hover striped responsive className='tableVertical'>
                                        <thead>
                                            <tr>
                                                <th width="10%">Fecha cancelada</th>
                                                <th width="5%">Folio</th>
                                                <th width="10%">Referencia</th>
                                                <th width="30%">Motivo cancelación</th>
                                                <th width="20%">Folio fiscal a relacionar</th>
                                                <th width="15%">Folio fiscal</th>
                                                <th width="10%" className="text-center">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                facturas.length === 0 ? <tr><td colSpan="7" className="text-center bg-light">No existen información a mostrar</td></tr> :
                                                facturas.map((item,i)=>(
                                                    <tr key={i}>
                                                        <td>{moment(item.fechaCancelada).format("DD-MM-YYYY")}</td>
                                                        <td>{item.folio}</td>
                                                        <td>{item.referenciaReceptor}</td>
                                                        <td>{item.motivoCancelacion}</td>
                                                        <td>
                                                            <div className={`${showIndexInput !== i ? 'd-flex' : ''} align-items-center justify-content-between`}>
                                                                <div>
                                                                    {
                                                                        i === showIndexInput ?
                                                                        <InputGroup>
                                                                            <FormControl
                                                                                size='sm'
                                                                                value={item.folioFiscalRelacionar ?? ''}
                                                                                onChange={e=>onHadleChange(e.target.value, i)}
                                                                            />
                                                                            <Button variant="outline-secondary" id="button-addon2" size='sm'>
                                                                                <FaCheck onClick={e=>saveFolio(i)}/>
                                                                            </Button>
                                                                        </InputGroup> :
                                                                        item.folioFiscalRelacionar
                                                                    }
                                                                </div>
                                                                {showIndexInput !== i && <div><FaEdit onClick={e=>setShowIndexInput(i)}/></div>}
                                                            </div>
                                                        </td>
                                                        <td>{item.folioFiscal}</td>
                                                        <td className="text-center">{formatNumber(item.total)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </Card.Body>
        </Card>     
    );
}
