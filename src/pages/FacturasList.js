import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table, Modal, Form, Row, Col, Alert } from 'react-bootstrap'
import TableSkeleton from '../loaders/TableSkeleton'
import Get from '../service/Get'
import { FACTURA_GET_BY_ID,FACTURA_GET_EMAIL_FACTURAR,FACTURA_ENVIAR_EMAIL, CANCELAR_FACTURA, FACTURA_ALL_PAGINABLE, TIPO_MOTIVO_CANCELACION_GET, TIPO_RELACION_FACTURA_GET, FACTURA_ALL } from '../service/Routes'
import { formatNumber } from '../utils/formatNumber'
import { FaDownload, FaEye, FaFileExcel, FaSearch } from 'react-icons/fa'
import { facturaPdf } from '../utils/facturaPdf'
import { loaderRequest } from '../loaders/LoaderRequest'
import { RiMailSendLine } from 'react-icons/ri'
import Post from '../service/Post'
import WaveLoading from 'react-loadingg/lib/WaveLoading'
import { toast } from 'react-toastify'
import cfdiLogo from '../img/cfdi.png';
import { formatStatusFactura } from '../utils/formatStatusFactura'
import cancelada from '../img/cancelada.png';
import moment from 'moment'
import { IsConsultor } from '../security/IsConsultor'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import { getLogoResidencial } from '../utils/getLogoResidencial'
import cfdiVersionv4 from '../img/cfdv4.png';
import cfdiVersion from '../img/cfdiversion.png';
import { getCreator } from '../utils/getCreator'
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

registerLocale("es", es)


export default function FacturasList({auth,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isSubmiting, setSubmiting] = useState(false)
    const [conceptops, setConceptos] = useState([])
    const [hasData, setHasData] = useState(false)
    const [show, setShow] = useState(false);
    const [idFactura, setIdFactura] = useState(null)
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)

    const [pageSize, setPageSize] = useState(20)
    const [pageNo, setPageNo] = useState(0)
    const [sortBy, setSortBy] = useState('createdAt')
    const [next, setNext] = useState(true)
    const [previous, setPrevious] = useState(false)
    const [cantidadElementos, setCantidadElementos] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [searchName, setSearchName] = useState('')
    const [isVersion4, setIsVersion4] = useState(false)

  const handleClose = () => setShow(false);

    useEffect(()=>{
        DataList()
    }, [pageNo])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${FACTURA_ALL_PAGINABLE}?page=${pageNo}&size=${pageSize}&sortBy=${sortBy}${searchName && `&name=${searchName}`}${startDate && `&dateIni=${moment(startDate).format("DD-MM-YYYY 01:00:00")}`}${endDate && `&dateFin=${moment(endDate).format("DD-MM-YYYY 23:59:59")}`}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data.facturaDTOList)
            setPrevious(response.data.previous)
            setNext(response.data.next)
            setCantidadElementos(response.data.total)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }

    const handlePrev = e =>{
        setPageNo(pageNo-1)
    }
    const handleNext= e =>{
        setPageNo(pageNo+1)
    }

    const downloadPDF = (id) =>{
        setSubmiting(true)
        ///get factura
        Get({url: `${FACTURA_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            setConceptos(response.data.data.facturaConceptosList)
            if(response.data.data.version==='4.0'){
                setIsVersion4(true)
            }
            setHasData(true)
            //download pdf
            facturaPdf(response.data.data)
            setSubmiting(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }

    const getFacturas = () => {
        setSubmiting(true);
        Get({url: `${FACTURA_ALL}?${searchName && `&name=${searchName}`}${startDate && `&dateIni=${moment(startDate).format("DD-MM-YYYY 01:00:00")}`}${endDate && `&dateFin=${moment(endDate).format("DD-MM-YYYY 23:59:59")}`}`, access_token: auth.data.access_token})
        .then(response=>{
            // console.log(response.data);
            downloadListToExcel(response.data);
            setSubmiting(false);
        })
        .catch(error=>{
            console.log(error);
            setSubmiting(false);
        });
    }

    const downloadListToExcel = (facturas) => {
        const creator = getCreator();
    
        var wb = XLSX.utils.book_new();
    
        wb.Props = {
            Title: "Facturas",
            Subject: "Facturas",
            Author: creator,
            CreatedDate: new Date(),
        };
    
        let objeto = [];
        let tempo = "";
        let str1 = ""
        let str2 = "";
        let str3 = "";
        let strName = "";
        let arr = "";
        if(facturas.length === 0) {
            tempo = {respuesta: "No hay facturas para mostrar"}; objeto.push(tempo);
            if(startDate === '') {
                str1 = moment().startOf('month').format("DD-MM-YYYY"); str2 = moment().format("DD-MM-YYYY");
            } else {
                str1 = moment(startDate).format("DD-MM-YYYY"); str2 = moment(endDate).format("DD-MM-YYYY");
            }
            strName = "Reporte de facturas del " + creator +  " del periodo " + str1 + " a " + str2;
            arr = [[strName]];
        }
        else {
            facturas.forEach(item => {
                var conceptos = "";
                item.conceptosList.map(i => {
                    conceptos = conceptos === "" ? conceptos = conceptos.concat(i) : conceptos = conceptos.concat(" || " + i);
                    return true;
                })
        
                var mC = item.tipoMotivoCancelacion ? item.tipoMotivoCancelacion.clave : ''
                let temp = {
                    FechaEmision: (item.fechaEmision),
                    Folio: (item.folio),
                    Referencia: (item.referenciaReceptor),
                    Conceptos: (conceptos),
                    RazonSocial: (item.nombreReceptor),
                    Monto: (item.total),
                    Estado: (item.status),
                    ClaveCancelacion: (mC),
                    FolioFiscal: (item.folioFiscal)
                }
                objeto.push(temp);
            })

            if (startDate !== '' && searchName !== '') {
                str1 = moment(startDate).format("DD-MM-YYYY"); str2 = moment(endDate).format("DD-MM-YYYY"); str3 = searchName;
                strName = "Reporte de facturas del " + creator + " de la referencia: " + str3 +  " dentro del periodo " + str1 + " a " + str2;
            } else if (startDate !== '') {
                str1 = moment(startDate).format("DD-MM-YYYY"); str2 = moment(endDate).format("DD-MM-YYYY");
                strName = "Reporte de facturas del " + creator +  " del periodo " + str1 + " a " + str2;
            } else if (searchName !== '') {
                str1 = searchName;
                strName = "Reporte de facturas del " + creator +  " de la referencia: " + str1;
            } else {
                str1 = moment().startOf('month').format("DD-MM-YYYY"); str2 = moment().format("DD-MM-YYYY");
                strName = "Reporte de facturas del " + creator +  " del periodo " + str1 + " a " + str2;
            }
            arr = [[strName]];
        }
        

        var ws = XLSX.utils.aoa_to_sheet(arr);
        wb.SheetNames.push("Lista de Facturas");
        wb.Sheets["Lista de Facturas"] = ws;
        XLSX.utils.sheet_add_json(ws, objeto, {origin: "A3"});
        
        
        // esta parte crea el archivo bajo los parametros y atributos que definimos arriba
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary', ignoreEC: true });
    
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;
        }
        let fecha = moment().format("DD-MM-YYYY_h_mm_ss");
    
        let filename = "Facturas de " + creator + " " + fecha + ".xlsx";
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
    }
    
    const showEmail = (id) =>{
        setSubmiting(true)
        setIdFactura(id)
        Get({url: `${FACTURA_GET_EMAIL_FACTURAR}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setEmailDefault(response.data)
            setShow(true)
            setSubmiting(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }
    const sendEmail = () =>{
        //console.log(idFactura)
        setSendingEmail(true)

        const d = {
            id: idFactura,
            correoElectronico: emailDefault,
            correoAdicional: emailPlus
        }

        Post({url: FACTURA_ENVIAR_EMAIL, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setSendingEmail(false)
            setEmailPlus("")
            setShow(false)
            toast.success("Se ha enviado el correo electrónico satisfactoriamente", {autoClose: 5000})
        })
        .catch(error=>{
            //console.log(error)
            setSendingEmail(false)
            setEmailPlus("")
            setShow(false)
            toast.error("No se ha podido enviar el correo electrónico. Intente más tarde", {autoClose: 5000})
        })

    }
    
    const commonStyle = {
        margin: 'auto',
        position: 'initial',
        left: 0,
        right: 0,
        top:10,
        bottom:10
    };

    const [showCancel, setShowCancel] = useState(false);
    const handleCloseCancel = () => setShowCancel(false);
    const [codigoAuto, setCodigoAuto] = useState('')
    const [idCancel, setIdCancel] = useState('')
    const [idMotivoCancelacion, setIdMotivoCancelacion] = useState('')
    const [idTipoRelacion, setIdTipoRelacion] = useState('')
    const [motivo, setMotivo] = useState('')
    const [errorCancel, setErrorCancel] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)
    const showIdCancel = (id) =>{
        setIdCancel(id)
        setShowCancel(true)
    }
    const cancelarPago = ()=>{
        if(codigoAuto==='' || motivo === '' || idTipoRelacion === '' || idMotivoCancelacion === ''){
            setErrorCancel(true)
        }else{
            setErrorCancel(false)
            setIsCanceling(true)
            const d = {
                id: idCancel,
                codeAutorizacion: codigoAuto,
                motivoCancelacion: motivo,
                idMotivoCancelacion: idMotivoCancelacion,
                idTipoRelacionFactura:  idTipoRelacion
            }
            //console.log(d)
            Post({url: CANCELAR_FACTURA, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                setIsCanceling(false)
                if(!response.data.success){
                    toast.info(response.data.message, {autoClose: 5000})
                }else{
                    toast.success("La factura ha sido cancelada", {autoClose: 5000})
                    setShowCancel(false)
                }
            })
            .catch(error=>{
                setIsCanceling(false)
                toast.error("Ocurrió un error. Contacte con el administrador", {autoClose: 5000})
            })
        }
    }

    const handleStartDate = date =>{
        //console.log(date)
        if(date===null || date===""){
            setStartDate('')
            setEndDate('')
        }else{
            setStartDate(date)
            if(date>endDate){
                setEndDate(date)
            }
        }
    }
    const handleEndDate = date =>{
        if(date===null || date===""){
            setEndDate(startDate)
        }else{
            if(startDate==='' || startDate===null){
                setStartDate(date)
            }
            setEndDate(date)
        }
    }

    const onClickBuscar = e =>{
        //console.log(startDate)
        //console.log(endDate)
        //console.log(searchName)
        setPageNo(0)
        DataList()
    }

    //get tipo motivo cancelacion y tipo de relacion de factura
    const [motivosCancelacion, setMotivosCancelacion] = useState([])
    const [relacionesFactura, setRelacionesFactura] = useState([])
    useEffect(()=>{
        //motivo cancelaciones
        Get({url: TIPO_MOTIVO_CANCELACION_GET, access_token: auth.data.access_token})
        .then(response=>{
            setMotivosCancelacion(response.data)
        })
        .catch(error=>{
            console.log(error)
        })

        //tipo relaciones factura
        Get({url: TIPO_RELACION_FACTURA_GET, access_token: auth.data.access_token})
        .then(response=>{
            setRelacionesFactura(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [auth.data.access_token])

    return(
        <div className="fact-font">
            {isSubmiting && loaderRequest()}
                {
                    isLoading
                    ? <TableSkeleton />
                    : <div className="react-bootstrap-table">
                    <p>Selecciona un periodo de fechas y/o una referencia, o folio de factura y pulsa sobre la lupa para buscar.</p>
                        <Row>
                            <Col xs="12" md="4">
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="3" className="pr-0">Desde</Form.Label>
                                        <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="dd-MM-yyyy"
                                                locale="es"
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                selected={startDate}
                                                onChange={date => handleStartDate(date)}
                                            />
                                        </Col>
                                    </Form.Group>
                            </Col>
                            <Col xs="12" md="4">
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="3" className="pr-0">Hasta</Form.Label>
                                        <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="dd-MM-yyyy"
                                                locale="es"
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}

                                                selected={endDate}
                                                onChange={date => handleEndDate(date)} 
                                            />
                                        </Col>
                                    </Form.Group>
                            </Col> 
                            <Col xs="12" md="3">
                                    <Form.Control 
                                        type="text" 
                                        value={searchName}
                                        onChange={e=>setSearchName(e.target.value)}
                                        placeholder="Buscar por folio o referencia"/>
                            </Col> 
                            <Col xs="12" md="1">
                                <Button variant="outline-primary" onClick={e=>onClickBuscar()}><FaSearch /></Button>{' '}
                            </Col>
                            
                            <Col xs="12" md="4">
                            <p>También puedes descargar las facturas por periodos.</p> 
                                <Button variant="outline-secondary" size="sm" onClick={e => getFacturas()}>Descargar XLSX<FaDownload /></Button>
                            </Col>
                        </Row>
                        <Row>
                            
                        </Row>
                        <Table hover striped className="tableVertical">
                            <thead>
                                <tr>
                                    <th width="10%">Fecha creada</th>
                                    <th width="5%">Folio</th>
                                    <th width="5%">Referencia</th>
                                    <th width="20%">Concepto</th>
                                    <th width="20%">Nombre</th>
                                    <th width="10%">Monto</th>
                                    <th width="5%">Estado</th>
                                    <th width="5%">M.Cancel</th>
                                    <th width="10%">Folio fiscal</th>
                                    <th width="10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    items.length > 0 ?
                                    items.map((item,i)=>(
                                        <tr key={i}>
                                            <td>{moment(item.fechaEmision).format("DD-MM-YYYY HH:mm")}</td>
                                            <td>{item.folio}</td>
                                            <td>{item.referenciaReceptor}</td>
                                            <td>
                                                {
                                                    item.conceptosList.map((concp, indxC)=>(
                                                        <span key={indxC}>{concp}</span>
                                                    ))
                                                }
                                            </td>
                                            <td>{item.nombreReceptor}</td>
                                            <td>{formatNumber(item.total)}</td>
                                            <td>{formatStatusFactura(item.status)}</td>
                                            <td>{item.tipoMotivoCancelacion ? item.tipoMotivoCancelacion.clave : ''}</td>
                                            <td>{item.folioFiscal}</td>
                                            <td>
                                                <div>
                                                    <Link to={`/factura/${item.id}`} className="btn btn-xs btn-outline-info"><FaEye /></Link>
                                                    <Button variant="dark" className="mr-1 btn-xs" size="sm" onClick={e=>downloadPDF(item.id)}><FaDownload /></Button>
                                                    <Button size="sm" variant="light" className="btn-xs" onClick={e=>showEmail(item.id)} ><RiMailSendLine /></Button>
                                                    {(!IsConsultor(auth.data.role) && item.status !== 'cancelada') && <Button variant="outline-danger" className="mr-1 btn-xs" onClick={e=>showIdCancel(item.id)}><FaFileExcel className="mt--3" /></Button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    :<tr><td colSpan="8" className="text-center">No existen valores a mostrar</td></tr>
                                }
                            </tbody>
                        </Table>
                        <div className="d-flex flex-row-reverse">
                                
                            <ul className="pagination">
                                <li className={`${!previous && "disabled"} paginate_button page-item previous cursor-pointer`} id="dataTable_previous">
                                    <span className="page-link" onClick={e=>handlePrev()}>Previous</span>
                                </li>
                                <li className={`${!next && "disabled"} paginate_button page-item next cursor-pointer`} id="dataTable_next">
                                    <span className="page-link"  onClick={e=>handleNext()}>Next</span>
                                </li>
                            </ul>
                            <span className="text-muted mr-5">Total de elementos {cantidadElementos}</span>
                        </div>
                    </div>
                }

            <Table size="sm" hover responsive id="tableFG" style={{display: 'none'}}>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Descripción</th>
                        <th className="text-center">P/U</th>
                        <th className="text-center">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        hasData &&
                        conceptops.map((item,i)=>(
                            <tr key={i}>
                                <td width="15%">{item.cantidad}</td>
                                <td width='15%'>{item.unidad}</td>
                                <td width="50%">{item.descripcion}</td>
                                <td width="10%" className="text-center">{formatNumber(item.valorUnitario)}</td>
                                <td width='10%' className="text-center">{formatNumber(item.importe)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${sendingEmail && 'h-100p'}`}>
                    {
                      sendingEmail ?
                        <div className="loadModal">
                        <h6 style={{color: '#7186ed'}}>Enviando correo electrónico</h6>
                        <WaveLoading style={commonStyle} color={"#6586FF"} />
                        </div>
                        :<div>
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
                                <Form.Control value={emailPlus} onChange={e=>setEmailPlus(e.target.value)}/>
                                </Col>
                            </Form.Group>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="outline-primary" onClick={sendEmail} disabled={sendingEmail}>Enviar factura</Button>
                </Modal.Footer>
            </Modal>
            <img src={cfdiLogo} alt="logoCFDI" id="cfdiLogo" style={{display: 'none'}}/>
            <img src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} alt="RioLogo" id="rioLogo" style={{display: 'none'}}/>
            <img src={isVersion4 ? cfdiVersionv4 : cfdiVersion} alt="cfdiVersion" id="cfdiVersion" style={{display: 'none'}}/>
            <img src={cancelada} alt="cfdiVersion" id="cancelada" style={{display: 'none'}}/>
            <Modal show={showCancel} onHide={handleCloseCancel}  backdrop="static" keyboard={false}>
                <Modal.Header closeButton={!isCanceling}>
                <Modal.Title>Cancelar factura</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isCanceling  && 'h-100p'}`}>
                    {
                        isCanceling 
                        ? <div className="loadModal t20p">
                            <h6 style={{color: '#7186ed'}}>Cancelando factura</h6>
                            <WaveLoading style={commonStyle} color={"#6586FF"} />
                            </div>
                        : <Row>
                            <Col>
                                {errorCancel &&  <Alert key='alert' variant="danger">Todos los campos son requeridos</Alert>}
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5">
                                        Código de autorización
                                    </Form.Label>
                                    <Col sm="7">
                                    <Form.Control value={codigoAuto} onChange={e=>setCodigoAuto(e.target.value)}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5">Motivo de cancelación</Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            as="select" 
                                            onChange={e=>setIdMotivoCancelacion(e.target.value)}
                                            value={idMotivoCancelacion}
                                        >
                                            <option value="">Seleccionar opción</option>
                                            {
                                                motivosCancelacion.map((item)=>(
                                                    <option key={item.id} value={item.id}>{`${item.clave} - ${item.descripcion}`}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5">Relación de factura</Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            as="select" 
                                            onChange={e=>setIdTipoRelacion(e.target.value)}
                                            value={idTipoRelacion}
                                        >
                                            <option value="">Seleccionar opción</option>
                                            {
                                                relacionesFactura.map((item)=>(
                                                    <option key={item.id} value={item.id}>{`${item.clave} - ${item.descripcion}`}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Nota</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={motivo} onChange={e=>setMotivo(e.target.value)}/>
                                </Form.Group>
                            </Col>
                        </Row>  
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={cancelarPago} disabled={isCanceling}>Cancelar factura</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}
