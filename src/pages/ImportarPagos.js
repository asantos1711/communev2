import React, { useState, useContext, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Card, Dropdown, Row, Col, Table, Button, Form } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { MANTENIMIENTO_IMPORTAR_PAGOS, MTTO_COBRAR_PAGOS_RECURRENTES, FACTURA_GET_BY_ID,FACTURA_NOTA, CAJA_GET_ACTIVE } from '../service/Routes'
import PostFile from '../service/PostFile'
import { loaderRequest } from '../loaders/LoaderRequest'
import { formatNumber } from '../utils/formatNumber'
import Post from '../service/Post'
import Get from '../service/Get'
import { facturaPdf } from '../utils/facturaPdf'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment';
import cfdiLogo from '../img/cfdi.png';
import cfdiVersionv4 from '../img/cfdv4.png';
import cfdiVersion from '../img/cfdiversion.png';
import { notaPDF } from '../utils/notaPDF'
import { getLogoResidencial } from '../utils/getLogoResidencial'

export default function ImportarPagos(){
    const { auth } = useContext(authContext)
    const [items, setItems] = useState([])
    const [file, setFile] = useState('')
    const [isUploading, setUploading] = useState(false)
    const [itemsResult, setItemsResult] = useState([])
    const [hasResult, setHasResult] = useState(false)
    const [errorFile, setErrorFile] = useState(false)
    const [conceptos, setConceptos] = useState([])
    const [conceptosNF, setConceptosNF] = useState([])
    const [cajaOpt, setCajaOpt] = useState([])
    const [caja, setCaja] = useState('')
    const [errorCaja, setErrorCaja] = useState(false)
    const [isVersion4, setIsVersion4] = useState(false)

    useEffect(() => {
        Get({url: CAJA_GET_ACTIVE, access_token: auth.data.access_token})
        .then(response=>{
            setCajaOpt(response.data)
            if(response.data.length > 0){
                setCaja(response.data[0].id)
            }
        })
        .catch(error=>{
            //error
        })
    }, [])
    

    const importarXLS = () =>{
        if(file===''){
            setErrorFile(true)
        }else{
            let extension = ".xlsx"
            let fileInput = file[0]
            if(fileInput.name.substring(fileInput.name.length - extension.length).toLowerCase() === extension.toLowerCase()){
                setErrorFile(false)
                const formData = new FormData()
                formData.append("file", file[0])
        
                setUploading(true)
                PostFile({url: MANTENIMIENTO_IMPORTAR_PAGOS, data: formData, access_token: auth.data.access_token})
                .then(response=>{
                    //console.log(response)
                    if(response.data.success){
                        // console.log(response)
                        setItems(response.data.data)
                    }
                    
                    setUploading(false)
                })
                .catch(error=>{
                    // console.log(error)
                    setUploading(false)
                })
            }else{
                setErrorFile(true)
            }
        }
        
    }

    const onClickAplicarPagos = e =>{
        if(caja===""){
            setErrorCaja(true)
        }else{
            setErrorCaja(false)
            setUploading(true)
            let arr = items.filter(item=>item.id!==null)
            let mttoImportadoResponseList = []
            arr.forEach(item=>{
                mttoImportadoResponseList.push(
                    {
                        id: item.id,
                        referencia: item.referencia,
                        montoDepositado: item.montoDepositado,
                        periodoMtto: item.periodoMtto,
                        montoPagar: item.montoPagar,
                        montoPagarDcto: item.montoPagarDcto,
                        deudaMoratoria: item.deudaMoratoria,
                        nota: item.nota,
                        fechaPago: item.fechaPago,
                        observacion: item.observacion
                    })
            })
            //console.log(mttoImportadoResponseList)
            if(arr.length > 0){
                const d = {
                    caja: {id: caja},
                    mttoImportadoResponseList: mttoImportadoResponseList
                }
                console.log(d)

                Post({url: MTTO_COBRAR_PAGOS_RECURRENTES, data: d, access_token: auth.data.access_token, header: true})
                .then(response=>{
                    //console.log(response)
                    setItemsResult(response.data.data)
                    setHasResult(true)
                    setUploading(false)
                })
                .catch(error=>{
                    //console.log(error)
                    toast.error("Ocurrió un error. Contacte al administrador", {autoClose: 5000})
                    setUploading(false)
                })
            }else{
                toast.info("No hay pagos a ejecutar", {autoClose: 5000})
                setUploading(false)
            }
        }        
    }

    const downloadPDF = (id) =>{
        setUploading(true)
        ///get factura
        Get({url: `${FACTURA_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            if(response.data.data.version==='4.0'){
                setIsVersion4(true)
            }
            setConceptos(response.data.data.facturaConceptosList)
            //console.log(response)
            facturaPdf(response.data.data)
            setUploading(false)
        })
        .catch(error=>{
            // console.log(error)
        })
    }    

    const downloadNotaPDF = (id,tipo) =>{
        //console.log('entro')
        //console.log(cobros)
        setUploading(true)
        let cobros = [{
            id: id, 
            name: tipo
        }]
        
        const d = {
            dataLists: cobros
        }
        Post({url: FACTURA_NOTA, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setConceptosNF(response.data.data)
            notaPDF(response.data.data)
            setUploading(false)
        })
        .catch(error=>{
            //console.log(error)
        })
        
    }

    return(
        <div>
            {isUploading && loaderRequest()}
            <ToastContainer />
            {
                !hasResult ?
                <Card className="shadow">
                    <Card.Body>
                        <Card.Title>Importar pagos</Card.Title>
                        <Dropdown.Divider />  
                        <Row className="mb-3">
                            <Col xs="6" lg="4">
                                <Form.Group as={Row}>                                
                                    <Col sm={8}>
                                        <Form.File.Input onChange={e=>setFile(e.target.files)}/>
                                        {errorFile && <span className="text-danger">Seleccione un archivo válido</span>}
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col xs="6" lg="6">
                                <Button variant="outline-primary" onClick={importarXLS}>Importar XLS</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={`${items.length>15 && 'h-600'}`}>
                            <Table striped hover className="font-size-08rem tableVertical">
                                    <thead>
                                        <tr>
                                            <th width="3%" className="text-center">No</th>
                                            <th style={{width: '9%'}}>Referencia</th>
                                            <th style={{width: '8%', textAlign: 'center'}}>Depositado</th>
                                            <th width="8%">Fecha pago</th>
                                            <th style={{width: '12%', textAlign: 'center'}}>Período a pagar</th>
                                            <th style={{width: '7%', textAlign: 'center'}}>Monto</th>
                                            <th style={{width: '12%', textAlign: 'center'}}>Monto pagar</th>
                                            <th style={{width: '10%', textAlign: 'center'}}>Interes moratorio</th>
                                            <th style={{width: '7%', textAlign: 'center'}}>Total</th>
                                            <th width="15%">Observación</th>
                                            <th width='12%'></th>
                                        </tr>
                                    </thead>
                                    {
                                        items.length === 0 
                                        ? <tbody><tr><td colSpan="11" className="text-center">No existe información a mostrar</td></tr></tbody>
                                        : <tbody>
                                            {
                                                items.map((item,i)=>(
                                                    <tr key={i} className={!item.id ? 'bg-danger text-white': ''}>
                                                        <td className="text-center">{i+1}</td>
                                                        <td>{item.referencia}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber( item.montoDepositado)}</td>
                                                        <td>{item.fechaPago && moment(item.fechaPago).format("DD-MM-YYYY")}</td>
                                                        <td style={{textAlign: 'center'}}>{item.periodoMtto}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(item.montoPagar)}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(item.montoPagarDcto)}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(item.deudaMoratoria)}</td>
                                                        <td style={{textAlign: 'center'}}><strong>{formatNumber(item.deudaMoratoria+item.montoPagarDcto)}</strong></td>
                                                        <td>{item.observacion}</td>
                                                        <td>{item.nota}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                    }                                
                                    
                                </Table>
                            </Col>
                        </Row>
                        {
                            items.length > 0 && 
                            <Row className="mt-3">
                                <Col xs="12" md="12">
                                    <span className="text-secondary">{`Cantidad de registros a importar: ${items.length}`}</span>
                                </Col>
                                <Col xs="12" md="6">
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="2" className="pr-0">Caja</Form.Label>
                                    <Col sm="10" className="pl-0">
                                        <Form.Control 
                                            value={caja}
                                            onChange={e=>{setCaja(e.target.value)}}
                                            as="select"
                                            className={`${errorCaja ? 'error' : ''}`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {   
                                                cajaOpt.map((item,i)=>(
                                                    <option value={item.id} key={i}>{item.name}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                                </Col>
                                <Col xs="12" md="12">
                                    <Button variant="primary" onClick={onClickAplicarPagos}>Aplicar pagos</Button>
                                </Col>
                            </Row>
                        }
                    </Card.Body>
                </Card>  
            : <Card className="shadow">
                <Card.Body>
                    <Card.Title>Pagos procesados</Card.Title>
                    <Dropdown.Divider />
                    <Row>
                        <Col className={`${itemsResult.length>15 && 'h-600'}`}>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th style={{width: '20%'}}>Referencia</th>
                                        <th style={{width: '25%'}}>Período pagado</th>
                                        <th style={{width: '15%', textAlign: 'center'}}>Pagado</th>
                                        <th style={{textAlign: 'center'}}></th>
                                    </tr>                                    
                                </thead>
                                <tbody>
                                    {
                                        itemsResult.map((item,i)=>(
                                            <tr key={i}>
                                                <td>{item.referencia}</td>
                                                <td>{item.periodo}</td>
                                                <td style={{textAlign: 'center'}}>{formatNumber(item.monto)}</td>
                                                <td style={{textAlign: 'center'}}>
                                                    {
                                                        item.idFactura 
                                                        ? <Button variant="dark" className="mr-1 btn-xs" size="sm" onClick={e=>downloadPDF(item.idFactura)}><FaDownload /></Button>
                                                        : <Button variant="light" className="mr-1 btn-xs" size="sm" onClick={e=>downloadNotaPDF(item.id, item.tipo)}>Nota a facturar</Button>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <img src={cfdiLogo} alt="logoCFDI" id="cfdiLogo" style={{display: 'none'}}/>
                    <img src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} alt="RioLogo" id="rioLogo" style={{display: 'none'}}/>
                    <img src={isVersion4 ? cfdiVersionv4 : cfdiVersion} alt="cfdiVersion" id="cfdiVersion" style={{display: 'none'}}/>
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
                                conceptos.map((item,i)=>(
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
                    <Table size="sm" hover responsive id="tableFNG" style={{display: 'none'}}>
                        <thead>
                            <tr>
                                <th>Identificador</th>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th className="text-center">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                conceptosNF.map((item,i)=>(
                                    <tr key={i}>
                                        <td width="15%">{item.id}</td>
                                        <td width="15%">{moment(item.fecha).format("DD-MM-YYYY")}</td>
                                        <td width="60%">{item.concepto}</td>
                                        <td width='10%' className="text-center">{formatNumber(item.monto)}</td>
                                    </tr>
                                ))                        
                            }                   
                        </tbody>                
                    </Table>
                </Card.Body>
              </Card>  
            }
        </div>
    )
}