import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom';
import Get from '../service/Get';
import { DATOS_FISCALES_GET_BY_ID, DATOS_FISCALES_SAVE, METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET, USO_CFDI_GET, LOTE_FOR_VEHICLES, TIPO_DOCUMENTO_GET, CLAVE_UNIDAD_CFDI_GET, CLAVE_PRODUCCION_SERVICIO_CFDI_GET, METODO_PAGO_GET, BANCO_GET, REGIMEN_FISCAL_GET, DATOS_FISCALES_UPLOADCONSTANCIA } from '../service/Routes';
import * as Yup from 'yup';
import { Row, Col, Button, Form, Card, Dropdown, Modal, Alert } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';
import SelectAjax from '../components/SelectAjax';
import Skeleton from 'react-loading-skeleton';
import GetAll from '../service/GetAll';
import InputMask from "react-input-mask";
import { FaExternalLinkSquareAlt } from 'react-icons/fa';
import { BsUpload, BsEye } from "react-icons/bs";
import { app } from '../firebaseConfig';

export default function DatosFiscalesValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    let history = useHistory()
    const [lote, setLote] = useState(null)
    const [metodoCFDIOpt, setMetodoCFDIOpt] = useState([])
    const [formaCFDIOpt, setFormCFDIOpt] = useState([])
    const [usoCFDIOpt, setUsoCFDIOpt] = useState([])
    const [tipoDocumentoOpt, setTipoDocumentoOpt] = useState([])
    const [claveUnidadOpt, setClaveUnidadOpt] = useState([])
    const [claveProdSOpt, setClaveProdSOpt] = useState([])
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [showModalTarjeta, setShowModalTarjeta] = useState(false);
    const [errorNoTarj, setErrorNoTarj] = useState(false)
    const [errorCVV, setErrorCVV] = useState(false)
    const [regimenFiscalOpt, setRegimenFiscalOpt] = useState([])
    const [isUploadFile, setIsUploadFile] = useState(false)

    const cardNumber = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3,4}$/;
    const cardCVV = /^[0-9]{3,4}$/;

    const [initialValues, setInitialValues] = useState({
        id: '', 
        razonSocial: '',
        rfc: '',
        poblacion: '',
        cuenta: '',
        domicilio: '',
        numeroExterior: '',
        colonia: '',
        ciudad: '',
        municipio: '',
        estado: '',
        pais: '',
        codigoPostal: '',
        email: '',
        loteTransient: '',
        metodoPagoCFDI: '',
        formaPagoCFDI: '',
        usoCFDI: '',
        tipoDocumento: '',
        claveUnidadCFDI: '',
        claveProductoServicio : '',
        metodoPago: '',
        regimenFiscal: '',
        urlFileConstancia: '',
        nameFileConstancia: ''
    })

    const [tarjetas, setTarjetas] = useState(null)
    const [nombre, setNombre] = useState("")
    const [tarjeta, setTarjeta] = useState("")
    const [tipoTarjeta, setTipoTarjeta] = useState("")
    const [numeroTarjeta, setNumeroTarjeta] = useState("")
    const [fechaVencimiento, setFechaVencimiento] = useState("")
    const [cvv, setCVV] = useState("")
    const [banco, setBanco] = useState("")  
    const [bancoOpt, setBancoOpt] = useState([])
    const handleCloseTarjeta = () => setShowModalTarjeta(false);
    const [tarjError, setTarjError] = useState(false)
    const [idTarjeta, setIdTarjeta] = useState('')
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('Seleccionar archivo')
    const [errorFile, setErrorFile] = useState(false)

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${DATOS_FISCALES_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{       
                console.log(response)                  
                let entity ={
                    id: response.data.data.id,
                    razonSocial: response.data.data.razonSocial,
                    rfc: response.data.data.rfc,
                    poblacion: response.data.data.poblacion,
                    cuenta: response.data.data.cuenta,
                    domicilio: response.data.data.domicilio,
                    numeroExterior: response.data.data.numeroExterior,
                    colonia: response.data.data.colonia,
                    ciudad: response.data.data.ciudad,
                    municipio: response.data.data.municipio,
                    estado: response.data.data.estado,
                    pais: response.data.data.pais,
                    codigoPostal: response.data.data.codigoPostal,
                    //email: response.data.data.email,
                    loteTransient: {id: response.data.data.lote_residente.id},   
                    metodoPagoCFDI: response.data.data.metodoPagoCFDI.id,
                    formaPagoCFDI: response.data.data.formaPagoCFDI.id,
                    usoCFDI: response.data.data.usoCFDI.id,
                    tipoDocumento: response.data.data.tipoDocumento.id,
                    claveUnidadCFDI: response.data.data.claveUnidadCFDI.id,
                    claveProductoServicio: response.data.data.claveProductoServicio.id,
                    metodoPago: response.data.data.metodoPago ? response.data.data.metodoPago.id: '',
                    regimenFiscal: response.data.data.regimenFiscal ? response.data.data.regimenFiscal.id: '',
                    urlFileConstancia: response.data.data.urlFileConstancia,
                    nameFileConstancia: response.data.data.nameFileConstancia
                }
                setLote({label: response.data.data.lote_residente.name, value: response.data.data.lote_residente.id})
                if(response.data.data.nameFileConstancia){
                    setFileName(response.data.data.nameFileConstancia)
                }
                setInitialValues(entity)
                if(response.data.data.tarjeta){
                    //console.log(response.data.data.tarjeta)
                    setIdTarjeta(response.data.data.tarjeta.id)
                    setNombre(response.data.data.tarjeta.nombre ?? "")
                    setTarjeta(response.data.data.tarjeta.tarjeta ?? "")
                    setTipoTarjeta(response.data.data.tarjeta.tipo ?? "")
                    setNumeroTarjeta(response.data.data.tarjeta.numero ?? "")
                    setFechaVencimiento(response.data.data.tarjeta.fechaVencimiento ?? "")
                    setCVV(response.data.data.tarjeta.cvv)
                    setBanco(response.data.data.tarjeta.banco ? response.data.data.tarjeta.banco.id: '')
                    setTarjetas({
                        numero: `${response.data.data.tarjeta.numero ?? ""}`,
                        banco: response.data.data.tarjeta.banco ?{id: response.data.data.tarjeta.banco.id}: null,
                        id:response.data.data.tarjeta.id ?? "",
                        nombre: response.data.data.tarjeta.nombre ?? "",
                        tarjeta: response.data.data.tarjeta.tarjeta ?? "",
                        tipo: response.data.data.tarjeta.tipo ?? "",
                        fechaVencimiento: response.data.data.tarjeta.fechaVencimiento ?? "",
                        cvv: response.data.data.tarjeta.cvv ?? "",
                        active: true
                    })
                }
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }
    }, [idEntity ,auth.data.access_token])

    useEffect(()=>{
        //cargar todos los nomencladores
        const urls = [METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET,
            USO_CFDI_GET, TIPO_DOCUMENTO_GET, CLAVE_UNIDAD_CFDI_GET, 
            CLAVE_PRODUCCION_SERVICIO_CFDI_GET, METODO_PAGO_GET,BANCO_GET, REGIMEN_FISCAL_GET]
        GetAll({urls:urls, access_token: auth.data.access_token})
        .then(response=>{
            setMetodoCFDIOpt(response[0].data)
            setFormCFDIOpt(response[1].data)
            setUsoCFDIOpt(response[2].data)
            setTipoDocumentoOpt(response[3].data)
            setClaveUnidadOpt(response[4].data)
            setClaveProdSOpt(response[5].data)
            setMetodoPagoOpt(response[6].data)
            setBancoOpt(response[7].data.map(item => { return {id: item.id, name: item.name}}))
            setRegimenFiscalOpt(response[8].data)
        })        
    },[])

    const shemaValidate = Yup.object().shape({
        razonSocial: Yup.string()
            .required('Campo Requerido'),
        rfc: Yup.string()
            .required('Campo Requerido'),
        loteTransient: Yup.string()
            .required('Campo Requerido'),
        metodoPagoCFDI: Yup.string()
            .required('Campo Requerido'),
        formaPagoCFDI: Yup.string()
            .required('Campo Requerido'),
        usoCFDI: Yup.string()
            .required('Campo Requerido'),
        tipoDocumento: Yup.string()
            .required('Campo Requerido'),
        claveUnidadCFDI: Yup.string()
            .required('Campo Requerido'),
        claveProductoServicio: Yup.string()
            .required('Campo Requerido'),
        cuenta: Yup.string()
            .required('Campo Requerido'),
        domicilio: Yup.string()
            .required('Campo Requerido'),
        numeroExterior: Yup.string()
            .required('Campo Requerido'),
        codigoPostal: Yup.string()
            .required('Campo Requerido'),
        colonia: Yup.string()
            .required('Campo Requerido'),
        ciudad: Yup.string()
            .required('Campo Requerido'),
        municipio: Yup.string()
            .required('Campo Requerido'),
        estado: Yup.string()
            .required('Campo Requerido'),
        pais: Yup.string()
            .required('Campo Requerido'),
        metodoPago: Yup.string()
            .required('Campo Requerido'),
        regimenFiscal: Yup.string()
            .required('Campo Requerido'),
    });


    const addTarjeta = () =>{
        var obj = {
            id:idTarjeta,
            nombre: nombre,
            tarjeta: tarjeta,
            tipo: tipoTarjeta,
            numero: numeroTarjeta,
            fechaVencimiento: fechaVencimiento,
            cvv: cvv,
            banco: {id: banco},
            active: true
        }        
        //console.log(obj)
        if(obj.nombre==='' || obj.tarjeta === '' || obj.tipo==='' || obj.numero==='' || obj.banco.id==='' ){
            //console.log('error')
            setErrorNoTarj(false)
            setErrorCVV(false)
            setTarjError(true)
            setTarjetas(null)
        }else if(!cardNumber.test(obj.numero)){
            setErrorNoTarj(true)
        }else if(!cardCVV.test(obj.cvv) && obj.cvv!==''){
            setErrorCVV(true)
        }else{
            setErrorCVV(false)
            setErrorNoTarj(false)
            setTarjError(false)
            setTarjetas(obj)
            setShowModalTarjeta(false) 
        }            
    }

    const handleUploadFile = (e) =>{
        const file = e.target.files[0];
        if(file.type === 'application/pdf'){
            setErrorFile(false)
            setFile(file)
            setFileName(file.name)
        }else{
            setErrorFile(true)
            setFile(null)
            setFileName("Seleccionar archivo")
        }
    }

    const uploadFile = async () =>{
        if(file!==null){
            setIsUploadFile(true)
            //subimos el archivo a firebase y luego lo salvamos 
            const storageRef = app.storage().ref();
            //checamos si ya hay uno para eliminarlo
            if(initialValues.nameFileConstancia){
                const constanciaRef = storageRef.child(`documents/${process.env.REACT_APP_RESIDENCIAL}/${initialValues.nameFileConstancia}`);
                constanciaRef.delete();
            }           
            
            let fileName = `${file.name}-${new Date().getTime()}`
            const fileRef = storageRef.child(`documents/${process.env.REACT_APP_RESIDENCIAL}/` +fileName);
            await fileRef.put(file);
            let fileUrl = await fileRef.getDownloadURL();
            if(fileUrl){
                let data = {
                    id:initialValues.id,
                    urlFileConstancia: fileUrl,
                    nameFileConstancia: fileName
                }
                Post({url: DATOS_FISCALES_UPLOADCONSTANCIA, data: data,access_token: auth.data.access_token, header:true})
                .then(response=>{
                    if(response.data.success){                        
                        toast.success("Archivo subido correctamente",{ autoClose: 2000 })
                        setInitialValues(prev=>({
                            ...prev,
                            urlFileConstancia: response.data.data.urlFileConstancia,
                            nameFileConstancia: response.data.data.nameFileConstancia,
                        }))
                    }else{
                        toast.info(response.data.message,{ autoClose: 10000 })
                    }
                    setIsUploadFile(false)
                    
                })
                .catch(error=>{
                    //console.log(error)
                    setIsUploadFile(false)
                    toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador",{ autoClose: 3000 })
                }) 
            }
        }else{
            console.log('file null')
        }
    }

    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton height={300}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    enableReinitialize
                    onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => {   
                        let data = Object.assign({}, values)
                        data['metodoPagoCFDI'] = {id: values.metodoPagoCFDI}
                        data['formaPagoCFDI'] = {id: values.formaPagoCFDI}
                        data['usoCFDI'] = {id: values.usoCFDI}
                        data['tipoDocumento'] = {id: values.tipoDocumento}
                        data['claveUnidadCFDI'] = {id: values.claveUnidadCFDI}
                        data['claveProductoServicio'] = {id: values.claveProductoServicio}
                        data['razonSocial'] = values.razonSocial.trim()
                        data['metodoPago'] = {id: values.metodoPago}
                        data['regimenFiscal'] = {id: values.regimenFiscal}
                        data.tarjeta = tarjetas

                        //console.log(data)

                        Post({url: DATOS_FISCALES_SAVE, data: data,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            if(response.data.success){
                                setSubmitting(false)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/operaciones/datos-fiscales")
                            }else{
                                setSubmitting(false)
                                toast.info(response.data.message,{ autoClose: 10000 })
                            }
                            
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            //console.log(error)
                            toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador",{ autoClose: 3000 })
                        })                        
                    }}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => (
                    <Form className="mt-4 form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        {isUploadFile && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col>
                                <Card className="shadow mb-4">
                                    <Card.Body>
                                        <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} dato fiscal`}</Card.Title>
                                        <Dropdown.Divider /> 
                                        <Row>
                                            <Col xs lg="7">
                                                <Row>
                                                <Col xs lg="6">
                                                    <Form.Group>
                                                        <Form.Label>Razón social<span className="text-danger">*</span></Form.Label>
                                                        <Field 
                                                            className={`${errors.razonSocial && 'error'} form-control`}
                                                            type="text"
                                                            name="razonSocial"
                                                        />
                                                        {errors.razonSocial && <Form.Control.Feedback type="invalid" >{errors.razonSocial}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="3">
                                                    <Form.Group>
                                                        <Form.Label>RFC<span className="text-danger">*</span></Form.Label>
                                                        <Field 
                                                            className={`${errors.rfc && 'error'} form-control`}
                                                            type="text"
                                                            name="rfc"
                                                        />
                                                        {errors.rfc && <Form.Control.Feedback type="invalid" >{errors.rfc}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="3">
                                                    <Form.Group>
                                                        <Form.Label>Cuenta</Form.Label>
                                                        <Field 
                                                            className={`${errors.cuenta && 'error'} form-control`}
                                                            type="text"
                                                            name="cuenta"
                                                        />               
                                                        {errors.cuenta && <Form.Control.Feedback type="invalid" >{errors.cuenta}</Form.Control.Feedback>}        
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Método de pago CFDI</Form.Label>
                                                        <Field 
                                                            className={`${errors.metodoPagoCFDI && 'error'} form-control`}
                                                            as="select"
                                                            name="metodoPagoCFDI"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                metodoCFDIOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field>  
                                                        {errors.metodoPagoCFDI && <Form.Control.Feedback type="invalid" >{errors.metodoPagoCFDI}</Form.Control.Feedback>}                     
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Forma de pago CFDI</Form.Label>
                                                        <Field 
                                                            className={`${errors.formaPagoCFDI && 'error'} form-control`}
                                                            as="select"
                                                            name="formaPagoCFDI"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                formaCFDIOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field>  
                                                        {errors.formaPagoCFDI && <Form.Control.Feedback type="invalid" >{errors.formaPagoCFDI}</Form.Control.Feedback>}                                          
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Uso CFDI</Form.Label>
                                                        <Field 
                                                            className={`${errors.usoCFDI && 'error'} form-control`}
                                                            as="select"
                                                            name="usoCFDI"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                usoCFDIOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field>     
                                                        {errors.usoCFDI && <Form.Control.Feedback type="invalid" >{errors.usoCFDI}</Form.Control.Feedback>}                   
                                                    </Form.Group>
                                                </Col> 
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Tipo documento</Form.Label>
                                                        <Field 
                                                            className={`${errors.tipoDocumento && 'error'} form-control`}
                                                            as="select"
                                                            name="tipoDocumento"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                tipoDocumentoOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field> 
                                                        {errors.tipoDocumento && <Form.Control.Feedback type="invalid" >{errors.tipoDocumento}</Form.Control.Feedback>}                       
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Clave unidad CFDI</Form.Label>
                                                        <Field 
                                                            className={`${errors.claveUnidadCFDI && 'error'} form-control`}
                                                            as="select"
                                                            name="claveUnidadCFDI"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                claveUnidadOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field> 
                                                        {errors.claveUnidadCFDI && <Form.Control.Feedback type="invalid" >{errors.claveUnidadCFDI}</Form.Control.Feedback>}                      
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Clave producto servicio CFDI</Form.Label>
                                                        <Field 
                                                            className={`${errors.claveProductoServicio && 'error'} form-control`}
                                                            as="select"
                                                            name="claveProductoServicio"
                                                        >
                                                            <option>Seleccionar opción</option>
                                                            {
                                                                claveProdSOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field>    
                                                        {errors.claveProductoServicio && <Form.Control.Feedback type="invalid" >{errors.claveProductoServicio}</Form.Control.Feedback>}                   
                                                    </Form.Group>
                                                </Col>                                                 
                                                <Col xs lg="8">
                                                    <Form.Group>
                                                        <Form.Label>Lote<span className="text-danger">*</span></Form.Label>
                                                        <SelectAjax
                                                            defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                                            url={LOTE_FOR_VEHICLES}
                                                            access_token={auth.data.access_token}
                                                            isMulti={false}
                                                            handleChange={(value) => {
                                                                setLote(value)
                                                                setFieldValue('loteTransient', {id: value.value})
                                                            }} 
                                                            defaultOptions={lote}   
                                                            valid={errors.lote === 'Campo Requerido' ? false:true}     
                                                            isClearable={false}                                                 
                                                        />
                                                        {errors.loteTransient && <Form.Control.Feedback type="invalid" >{errors.loteTransient}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs lg="4">
                                                    <Form.Group>
                                                        <Form.Label>Régimen fiscal</Form.Label>
                                                        <Field 
                                                            className={`${errors.regimenFiscal && 'error'} form-control`}
                                                            as="select"
                                                            name="regimenFiscal"
                                                        >
                                                            <option  value="">Seleccionar opción</option>
                                                            {
                                                                regimenFiscalOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{`${item.clave} - ${item.name}`}</option>
                                                                ))
                                                            }
                                                        </Field>    
                                                        {errors.regimenFiscal && <Form.Control.Feedback type="invalid" >{errors.regimenFiscal}</Form.Control.Feedback>}                   
                                                    </Form.Group>
                                                </Col> 
                                                <Col xs lg="6">
                                                    <Form.Group>
                                                        <Form.Label>Método pago<span className="text-danger">*</span></Form.Label>
                                                        <Field 
                                                            className={`${errors.metodoPago && 'error'} form-control`}
                                                            as="select"
                                                            name="metodoPago"
                                                        >
                                                            <option value="">Seleccionar opción</option>
                                                            {
                                                                metodoPagoOpt.map((item,i)=>(
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </Field>                                                        
                                                        {errors.metodoPago && <Form.Control.Feedback type="invalid" >{errors.metodoPago}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>  
                                                <Col xs lg="6">
                                                    <Form.Group>
                                                        <Form.Label>Tarjeta{' '} 
                                                            <span className="cursor-pointer text-info" onClick={e=>setShowModalTarjeta(true)}><FaExternalLinkSquareAlt /></span>
                                                        </Form.Label>
                                                        <div className="form-control">
                                                            {tarjetas && `**** ${tarjetas.numero.substring(15)}`}
                                                        </div>                                            
                                                    </Form.Group>
                                                </Col>        
                                            </Row>
                                            </Col>
                                            <Col xs lg="5">
                                                <Row>
                                                    <Col xs lg={{span: 10, offset: 2}}>
                                                        <Form.Group>
                                                            <Form.Label>Domicilio</Form.Label>
                                                            <Field 
                                                                className={`${errors.domicilio && 'error'} form-control`}
                                                                type="text"
                                                                name="domicilio"
                                                            />       
                                                            {errors.domicilio && <Form.Control.Feedback type="invalid" >{errors.domicilio}</Form.Control.Feedback>}                
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg={{span: 4, offset: 2}}>
                                                        <Form.Group>
                                                            <Form.Label>Número exterior</Form.Label>
                                                            <Field 
                                                                className={`${errors.numeroExterior && 'error'} form-control`}
                                                                type="text"
                                                                name="numeroExterior"
                                                            />       
                                                            {errors.numeroExterior && <Form.Control.Feedback type="invalid" >{errors.numeroExterior}</Form.Control.Feedback>}                 
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="2">
                                                        <Form.Group>
                                                            <Form.Label>CP</Form.Label>
                                                            <Field 
                                                                className={`${errors.codigoPostal && 'error'} form-control`}
                                                                type="text"
                                                                name="codigoPostal"
                                                            />         
                                                            {errors.codigoPostal && <Form.Control.Feedback type="invalid" >{errors.codigoPostal}</Form.Control.Feedback>}              
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Colonia</Form.Label>
                                                            <Field 
                                                                className={`${errors.colonia && 'error'} form-control`}
                                                                type="text"
                                                                name="colonia"
                                                            />      
                                                            {errors.colonia && <Form.Control.Feedback type="invalid" >{errors.colonia}</Form.Control.Feedback>}                  
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg={{span: 5, offset: 2}}>
                                                        <Form.Group>
                                                            <Form.Label>Ciudad</Form.Label>
                                                            <Field 
                                                                className={`${errors.ciudad && 'error'} form-control`}
                                                                type="text"
                                                                name="ciudad"
                                                            />           
                                                            {errors.ciudad && <Form.Control.Feedback type="invalid" >{errors.ciudad}</Form.Control.Feedback>}            
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="5">
                                                        <Form.Group>
                                                            <Form.Label>Municipio</Form.Label>
                                                            <Field 
                                                                className={`${errors.municipio && 'error'} form-control`}
                                                                type="text"
                                                                name="municipio"
                                                            />               
                                                            {errors.municipio && <Form.Control.Feedback type="invalid" >{errors.municipio}</Form.Control.Feedback>}          
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg={{span: 5, offset: 2}}>
                                                        <Form.Group>
                                                            <Form.Label>Estado</Form.Label>
                                                            <Field 
                                                                className={`${errors.estado && 'error'} form-control`}
                                                                type="text"
                                                                name="estado"
                                                            />      
                                                            {errors.estado && <Form.Control.Feedback type="invalid" >{errors.estado}</Form.Control.Feedback>}                 
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="5">
                                                        <Form.Group>
                                                            <Form.Label>País</Form.Label>
                                                            <Field 
                                                                className={`${errors.pais && 'error'} form-control`}
                                                                type="text"
                                                                name="pais"
                                                            />       
                                                            {errors.pais && <Form.Control.Feedback type="invalid" >{errors.pais}</Form.Control.Feedback>}                
                                                        </Form.Group>
                                                    </Col>
                                                    {idEntity && <Col xs={12} lg={{span: 10, offset: 2}}>
                                                        <Form.Group>
                                                            <Form.Label>Subir constancia fiscal</Form.Label>  
                                                            <div className="input-group">
                                                                <div className="custom-file">
                                                                    <input type="file" className="custom-file-input" id="inputFile" aria-describedby="inputFileAddon04"                                                                        
                                                                        onChange={e=>handleUploadFile(e)}
                                                                        accept="application/pdf"
                                                                    />
                                                                    <label className="custom-file-label" htmlFor="inputFile">{fileName}</label>
                                                                </div>
                                                                {values.urlFileConstancia && <div className="input-group-append">
                                                                    <a href={values.urlFileConstancia} className="btn btn-outline-info" target='_blank' rel="noopener noreferrer"><BsEye /></a>
                                                                </div>}
                                                                <div className="input-group-append">
                                                                    <button className="btn btn-outline-secondary" type="button" id="inputFileAddon04"
                                                                    onClick={uploadFile}><BsUpload /></button>
                                                                </div>
                                                            </div>                                                          
                                                        </Form.Group>  
                                                        {errorFile && <Form.Control.Feedback type="invalid">Archivo inválido. Solo archivo en formato PDF permitido</Form.Control.Feedback>}                                                      
                                                    </Col>}
                                                </Row>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col>
                                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                                <Link to="/operaciones/datos-fiscales" className="btn btn-secondary">Cancelar</Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>                                        
                            </Col>                                    
                        </Row> 
                        <Modal show={showModalTarjeta} onHide={handleCloseTarjeta} size="lg">
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>
                                {tarjError && 
                                    <Alert variant="danger">Todos los campos son requeridos</Alert>
                                }
                                {
                                    errorNoTarj &&
                                    <Alert variant="danger">Error en el número de tarjeta formato inválido</Alert>
                                }
                                {
                                    errorCVV &&
                                    <Alert variant="danger">Error en el CVV de tarjeta formato inválido</Alert>
                                }
                                <Row className="mb-2">
                                    <Col xs="12" lg="12">
                                        <Form.Label>Nombre completo</Form.Label>
                                        <Form.Control 
                                            value={nombre}
                                            onChange={e=>setNombre(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col xs="6" lg="4">
                                        <Form.Label>Número de tarjeta</Form.Label>
                                        <Form.Control 
                                            onChange={e=>{
                                                setNumeroTarjeta(e.target.value)                                               
                                            }} 
                                            value={numeroTarjeta}
                                            placeholder="####-####-####-####"
                                        />
                                    </Col>
                                    <Col xs="6" lg="2">
                                        <Form.Label>F.V</Form.Label>
                                        <InputMask 
                                            className="form-control"
                                            mask="99/99" 
                                            onChange={e=>setFechaVencimiento(e.target.value)} 
                                            value={fechaVencimiento} />                                                                
                                    </Col>
                                    <Col xs="6" lg="2">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control 
                                            onChange={e=>{
                                                setCVV(e.target.value)                                               
                                            }} 
                                            value={cvv}
                                            placeholder="###"
                                        />                                                               
                                    </Col> 
                                    <Col xs="6" lg="4">
                                        <Form.Label>Banco</Form.Label>
                                        <Form.Control 
                                            value={banco}
                                            onChange={e=>setBanco(e.target.value)}
                                            as="select"
                                        >
                                            <option value="">Selecciona opción</option>
                                            {
                                                bancoOpt.map((item,i)=>(
                                                    <option key={i} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </Form.Control>                                                            
                                    </Col>                                                            
                                </Row>
                                <Row>
                                    <Col xs="6" lg="6">
                                        <Form.Label>Tarjeta</Form.Label>
                                        <Form.Control 
                                            value={tarjeta}
                                            onChange={e=>setTarjeta(e.target.value)}
                                            as="select"
                                        >
                                            <option value="">Selecciona opción</option>
                                            <option value="visa_mastercard">Visa/Mastercard</option>
                                            <option value="american_express">American Express </option>
                                        </Form.Control>
                                    </Col>
                                    <Col xs="6" lg="6">
                                        <Form.Label>Tipo de tarjeta</Form.Label>
                                        <Form.Control 
                                            value={tipoTarjeta}
                                            onChange={e=>setTipoTarjeta(e.target.value)}
                                            as="select"
                                        >
                                            <option value="">Selecciona opción</option>
                                            <option value="credito">Crédito</option>
                                            <option value="debito">Débito</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={addTarjeta}>
                                Aceptar
                            </Button>
                            </Modal.Footer>
                        </Modal>                      
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}