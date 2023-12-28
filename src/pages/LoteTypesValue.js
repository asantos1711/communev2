import React, { useState, useEffect, useRef } from 'react'
import { Card, Dropdown, Form, Row, Col, Button, Tabs, Tab, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import SelectAjax from '../components/SelectAjax'
import { LOTE_SAVE, LOTE_GET_BY_ID, RESIDENTE_GET_BY_TIPO } from '../service/Routes'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from 'yup';
import useQuery from '../hook/useQuery'
import { Formik } from 'formik'
import LoteSkeleton from '../loaders/LoteSkeleton'
import moment from 'moment';
import { loaderRequest } from '../loaders/LoaderRequest'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import Get from '../service/Get'
import Maps from '../components/Maps'
import { FaRegBuilding } from "react-icons/fa";
import ChildrenList from '../components/ChildrenList'
import { IsDirector } from '../security/IsDirector'
import QRCode from 'react-qr-code'
import ReactToPrint from 'react-to-print'
import { labelLote, labelManzana } from '../constant/token'

export default function LoteTypesValue({auth, isEditing,type_lote}){
    const [asociado, setAsociado] = useState({})
    const [isValidAsociado, setValidAsociado] = useState(true)
    const [residentes, setResidentes] = useState([])
    const [isLoadEntity, seIsLoadEntity] = useState(false)
    const [isMarkerShown, setIsMarkerShow] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [marker, setMarker] = useState(null)
    const [parentLote, setParentLote] = useState(null)
    const [childrenList, setChildrenList] = useState([])
    const [subStatusOpt, setSubStatusOpt] = useState([])
    const [hasFechaEntrega, setHasFechaEntrega] = useState(false)
    const [subCategoryHabOpt, setSubCategoryHabOpt] = useState([])
    let history = useHistory()

    const query = useQuery()
    let id = query.get('id');

    const [initialValues, setInitialValues] = useState({
        id: '',
        referencia: '',
        numeroViviendas: 1,
        calle: '',
        manzana: '',
        lote: '',
        etapa: '',
        superficie:'',
        tipo: type_lote,
        status: '',
        category: '',
        subestado: '',
        fechaEntrega: '',
        latitud: '',
        longitud: '',
        //plusPercentMtto: '',
        categoryHab: '',
        subCategoryHab: '',
        isRecurrente: false,
    })

    const  onMapClick = (event) => {
        setIsMarkerShow(false)
        setLatitude(event.latLng.lat())
        setLongitude(event.latLng.lng())
        setMarker(event.latLng);
    }

    useEffect(()=>{
        if(id){
            seIsLoadEntity(true)
            Get({url: `${LOTE_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                //console.log(response.data.data.metodoPago)
                //asociados                
                if(response.data.data.residenteLotes.length > 0){
                    //asociado
                    if(response.data.data.residenteLotes.filter(x=>(x.active && x.asociado)).length > 0){
                        setAsociado({
                            'label': response.data.data.residenteLotes.filter(x=>(x.active && x.asociado)).map(v=>v.residente)[0].name,
                            'value': response.data.data.residenteLotes.filter(x=>(x.active && x.asociado)).map(v=>v.residente)[0].id,
                            'id': response.data.data.residenteLotes.filter(x=>(x.active && x.asociado))[0].id
                        })
                    }
                    
                    //residentes
                    if(response.data.data.residenteLotes.filter(x=>(x.active && !x.asociado)).length > 0){
                        setResidentes(response.data.data.residenteLotes.filter(x=>(x.active && !x.asociado)).map((item)=>({
                            'label': item.residente.name,
                            'value': item.residente.id,
                            'id': item.id
                        })))
                    }                               
                }
                if(response.data.data.fechaEntrega !== null){
                    setHasFechaEntrega(true)
                }
                let entity ={
                    id: response.data.data.id,
                    referencia: response.data.data.referencia,
                    numeroViviendas:response.data.data.numeroViviendas,
                    calle: response.data.data.calle,
                    manzana: response.data.data.manzana,
                    lote: response.data.data.lote === null ? '' : response.data.data.lote,
                    etapa: response.data.data.etapa === null ? '' : response.data.data.etapa,
                    superficie:response.data.data.superficie === null ? '' : response.data.data.superficie,
                    tipo: type_lote,
                    status: response.data.data.status,
                    category: response.data.data.category === null ? "": response.data.data.category,
                    subestado: response.data.data.subestado === null ? "": response.data.data.subestado,
                    //plusPercentMtto: response.data.data.plusPercentMtto===null ? '' : response.data.data.plusPercentMtto,
                    fechaEntrega: response.data.data.fechaEntrega !== null ? new Date(moment.utc(response.data.data.fechaEntrega).format("YYYY/MM/DD")) : "", 
                    categoryHab: response.data.data.categoryHab ===null? '': response.data.data.categoryHab,
                    subCategoryHab: response.data.data.subCategoryHab ===null? '': response.data.data.subCategoryHab, 
                    isRecurrente: response.data.data.isRecurrente ? response.data.data.isRecurrente :  false
                }
                handleSubStatus(response.data.data.category)
                handleSubCatHab(response.data.data.categoryHab)
                setLatitude(response.data.data.latitud === null ? '' : response.data.data.latitud)
                setLongitude(response.data.data.longitud === null ? '' : response.data.data.longitud)

                if(response.data.data.latitud!==null && response.data.data.latitud!==""){
                    setIsMarkerShow(true)
                }                
                setInitialValues(entity)
                seIsLoadEntity(false)

                setParentLote(response.data.data.parentLote)
                setChildrenList(response.data.data.childrenLotes)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })

        }
    }, [])

    const handleSubStatus = value  =>{
        let opt = []
        switch(value){
            case "construcción":
                opt = [
                        {value: "obra_en_proceso", text: "Obra en proceso"},
                        {value: "obra_abandonada", text: "Obra abandonada"},
                        {value: "obra_suspendida", text: "Obra suspendida"},
                        {value: "proyecto_aprobado", text: "Proyecto aprobado"}                        
                    ]
                setSubStatusOpt(opt)
                break
            default:
                setSubStatusOpt([])
        }
    }
    const handleSubCatHab = value  =>{
        let opt = []
        switch(value){           
            case "habitado":
                opt = [
                    {value: "propietario", text: "Propietario"},
                    {value: "alquilada", text: "Alquilada"},
                    {value: "airbnb", text: "AirBNB"}
                ]
                setSubCategoryHabOpt(opt)
                break
            default:
                setSubCategoryHabOpt([])
        }
    }

    const shemaValidate = Yup.object().shape({
        referencia: Yup.string()
          .required('Referencia es requerido'),
        status: Yup.string()
          .required('Estado es Requerido'),
        calle: Yup.string()
          .required('Calle es requerido'),
        manzana: Yup.string()
          .required(`${labelManzana} es requerido`),
        superficie: Yup.number()
          .required('Superficie es requerido')
          .positive("El campo no puede ser negativo")  
          .min(1, 'El campo no puede ser menor a 1'),
        // plusPercentMtto: Yup.number()          
        //   .positive("El %  de mantenimiento no puede ser negativo")  
        //   .min(1, 'El % de mantenimiento debe estar entre 1-100')
        //   .max(100, 'El % de mantenimiento debe estar entre 1-100')
        //   .notRequired(),
        numeroViviendas: Yup.number().when("tipo",{
            is: 'condominal',
            then: Yup.number()
                .min(1, "No. viviendas al menos tiene que ser 1")
                .required("No. viviendas es requerido"),
            otherwise: Yup.number().notRequired(),        
        }),
        subestado: Yup.string().when("category",{
            is: 'construcción',
            then: Yup.string().required("Subestado es requerido"),
            otherwise: Yup.string().notRequired(),        
        }),
        subCategoryHab: Yup.string().when("categoryHab",{
            is: 'habitado',
            then: Yup.string().required("Subcategoría hab es requerido"),
            otherwise: Yup.string().notRequired(),        
        }),
        fechaEntrega: Yup.string().when("status",{
            is: 'entregado',
            then: Yup.string().required("Fecha de entrega es requerido"),
            otherwise: Yup.string().notRequired().nullable(),        
        })
    });

    const componentRef = useRef();

    return (
        <div>
            {
                isLoadEntity
                ? <LoteSkeleton />
                :
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, {setSubmitting, setFieldValue,setFieldError} ) => { 
                        //formamos asociados con residentes
                        let resLotes = []
                        if(residentes!=null){
                            residentes.forEach(item=>{
                                resLotes.push({id: item.id, resident: {"id": item.value}, asociado: false})
                            })
                        } 
                        if(Object.keys(asociado).length > 0){
                            resLotes.push({id: asociado.id, resident: {"id":asociado.value}, asociado: true})
                        }                        
                        const data = {
                            id: values.id,
                            referencia:values.referencia,
                            numeroViviendas: values.numeroViviendas,
                            calle:values.calle,
                            manzana:values.manzana,
                            lote:values.lote,
                            etapa:values.etapa,
                            superficie:values.superficie,
                            tipo: type_lote,
                            status:values.status,
                            category: values.category ===""? null: values.category,
                            subestado: values.subestado ===""? null: values.subestado,
                            //plusPercentMtto: values.plusPercentMtto,
                            fechaEntrega: values.fechaEntrega !== "" &&  values.fechaEntrega !==null ? moment(values.fechaEntrega).format("YYYY-MM-DD") : "",
                            latitud:latitude,
                            longitud:longitude,                                                        
                            residenteLoteList: resLotes,
                            categoryHab: values.categoryHab ===""? null: values.categoryHab,
                            subCategoryHab: values.subCategoryHab ===""? null: values.subCategoryHab, 
                            isRecurrente: values.isRecurrente
                        }                   
                        //console.log(data)                        
                        var validForm = true                         
                        if(((type_lote === "condominal" || type_lote==="comercial" || type_lote === "habitacional") &&
                            Object.keys(asociado).length ===0 && values.status==='entregado')){
                            validForm=false
                            setValidAsociado(false)
                            setSubmitting(false)
                        }
                        if(validForm){
                             Post({url: LOTE_SAVE, data: data, access_token: auth.data.access_token, header: true})
                            .then(response=>{
                                //console.log(response)
                                if(!response.data.success){
                                    toast.warning(response.data.message, { autoClose: 10000 })
                                    setSubmitting(false)                                    
                                }else{
                                    setSubmitting(false)
                                    toast.success("Acción exitosa",{ autoClose: 2000 })
                                    history.push(`/operaciones/lote/${type_lote}`)
                                }
                                
                            })
                            .catch(error=>{
                                setSubmitting(false)
                                //console.log(error)
                                toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador",{ autoClose: 3000 })
                            })
                        }                        
                        
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
                        setFieldValue,
                        setFieldError,
                    }) => (
                        <Form className="form" onSubmit={handleSubmit}>
                            {isSubmitting && loaderRequest()}
                            <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                            <Row>
                                <Col>
                                    <Card className="shadow mb-4">
                                        <Card.Body>
                                            <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} Lote ${type_lote.charAt(0).toUpperCase()}${type_lote.slice(1)}`}</Card.Title>
                                            <Dropdown.Divider />
                                            {
                                                (Object.values(errors).length > 0 || !isValidAsociado) &&
                                                <Alert variant="danger">
                                                    {Object.values(errors).map((msg, idx) => (
                                                        <div key={idx}>
                                                            {msg}
                                                        <br />
                                                        </div>
                                                    ))}  
                                                    {
                                                        !isValidAsociado &&
                                                        <div>Asociado es requerido</div>
                                                    }                                                  
                                                </Alert>                                               
                                            }
                                                
                                            <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                                                <Tab eventKey="general" title="General">
                                                    <Row className="mt-5">
                                                        <Col xs lg="6">
                                                            <Row>
                                                                <Col xs lg="6">
                                                                    <Form.Group>
                                                                        <Form.Label>Referencia <span className="text-danger">*</span></Form.Label>
                                                                        {
                                                                            values.id===""
                                                                            ? <Form.Control type="text" name="referencia" className={`${errors.referencia && 'error'}`}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.referencia} 
                                                                            />  
                                                                            : <div>
                                                                                <div className="form-control"  readOnly>{values.referencia}</div>
                                                                              </div>
                                                                        }                                                                                  
                                                                        {errors.referencia && <Form.Control.Feedback type="invalid" >{errors.referencia}</Form.Control.Feedback>}
                                                                    </Form.Group>
                                                                </Col>
                                                                {
                                                                    type_lote==='condominal' &&
                                                                    <Col xs lg="3">
                                                                        <Form.Group>
                                                                            <Form.Label>No. viviendas</Form.Label>
                                                                            {
                                                                                (values.id==="" || IsDirector(auth.data.role))
                                                                                ? <Form.Control type="number" className={`${errors.numeroViviendas && 'error'}`}
                                                                                        name="numeroViviendas" 
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        value={values.numeroViviendas}
                                                                                   /> 
                                                                                : <div className="form-control"  readOnly>{values.numeroViviendas}</div>
                                                                            }
                                                                                   
                                                                            {errors.numeroViviendas && <Form.Control.Feedback type="invalid" >{errors.numeroViviendas}</Form.Control.Feedback>}                             
                                                                        </Form.Group>
                                                                    </Col>
                                                                }
                                                                <Col xs lg="3">
                                                                    <Form.Group>
                                                                        <Form.Label>Superficie <small>(m²)</small> <span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control type="number" name="superficie"  className={`${errors.superficie && 'error'}`}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.superficie} 
                                                                        />          
                                                                        {errors.superficie && <Form.Control.Feedback type="invalid" >{errors.superficie}</Form.Control.Feedback>}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col xs lg="3">
                                                                    <Form.Group>
                                                                        <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control as="select" className={`${errors.status && 'error'}`}
                                                                            name="status"  
                                                                            onBlur={handleBlur}
                                                                            onChange={e=>{
                                                                                setFieldValue("status", e.target.value)
                                                                                if(e.target.value==="entregado"){
                                                                                    setFieldValue('fechaEntrega', new Date())
                                                                                }                                                                                
                                                                            }}
                                                                            value={values.status}
                                                                        >
                                                                            {id==null && <option value="">Seleccionar</option>}
                                                                            {(values.status==='disponible' || id===null) && <option value="disponible">Disponible</option>}                                                                    
                                                                            { id!==null && <option value="entregado">Entregado</option>}                                                                                                                                                                                                                 
                                                                        </Form.Control>  
                                                                        {errors.status && <Form.Control.Feedback type="invalid" >{errors.status}</Form.Control.Feedback>}                                     
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col xs lg="3">
                                                                    <Form.Group>
                                                                        <Form.Label>Fecha entrega</Form.Label>
                                                                        <DatePicker className="form-control"
                                                                            showPopperArrow={false}
                                                                            selected={values.fechaEntrega}
                                                                            autoComplete="off"
                                                                            readOnly={hasFechaEntrega}
                                                                            dateFormat="dd-MM-yyyy"
                                                                            onChange={date => {
                                                                                setFieldValue('fechaEntrega', date)
                                                                                if(values.status === 'entregado' && date===null){
                                                                                    setFieldValue('fechaEntrega', new Date())
                                                                                }                                                                                
                                                                            }}
                                                                        />                        
                                                                    </Form.Group>
                                                                </Col>                                                              
                                                            </Row>
                                                        </Col>
                                                        <Col xs lg={{ span: 4, offset: 2 }}>
                                                            <Row>
                                                                <Col xs lg="6">
                                                                    <Form.Group>
                                                                        <Form.Label>Categoría Const.</Form.Label>
                                                                        <Form.Control as="select"
                                                                            name="category"  
                                                                            onBlur={handleBlur}
                                                                            onChange={e=>{
                                                                                handleSubStatus(e.target.value)
                                                                                setFieldValue("category", e.target.value)                                                                                                                                                               
                                                                            }}
                                                                            value={values.category}
                                                                        >
                                                                            <option value="">Seleccionar</option>
                                                                            <option value="construcción">Construcción</option>
                                                                            <option value="baldio">Baldío</option>
                                                                                                                                                                                                                                                                                               
                                                                        </Form.Control> 
                                                                    </Form.Group>
                                                                </Col> 
                                                                <Col xs lg="6">
                                                                    <Form.Group>
                                                                        <Form.Label>Subcategoría Const.</Form.Label>
                                                                        <Form.Control as="select" className={`${errors.subestado && 'error'}`}
                                                                            name="subestado"  
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values.subestado}
                                                                        >
                                                                            <option value="">Seleccionar</option>
                                                                            {
                                                                                subStatusOpt.map((item, idx)=>(
                                                                                    <option key={idx} value={item.value}>{item.text}</option>
                                                                                ))
                                                                            }                                                                                                                                                                                                                       
                                                                        </Form.Control>  
                                                                        {errors.subestado && <Form.Control.Feedback type="invalid" >{errors.subestado}</Form.Control.Feedback>}                                     
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col xs lg="6">
                                                                    <Form.Group>
                                                                        <Form.Label>Categoría Hab.</Form.Label>
                                                                        <Form.Control as="select"
                                                                            name="categoryHab"  
                                                                            onBlur={handleBlur}
                                                                            onChange={e=>{
                                                                                handleSubCatHab(e.target.value)
                                                                                setFieldValue("categoryHab", e.target.value)                                                                                                                                                               
                                                                            }}
                                                                            value={values.categoryHab}
                                                                        >
                                                                            <option value="">Seleccionar</option>
                                                                            <option value="habitado">Habitado</option>
                                                                            <option value="deshabitado">Deshabitado</option>
                                                                                                                                                                                                                                                                                               
                                                                        </Form.Control> 
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col xs lg="6">
                                                                    <Form.Group>
                                                                        <Form.Label>Subcategoría Hab.</Form.Label>
                                                                        <Form.Control as="select" className={`${errors.subCategoryHab && 'error'}`}
                                                                            name="subCategoryHab"  
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values.subCategoryHab}
                                                                        >
                                                                            <option value="">Seleccionar</option>
                                                                            {
                                                                                subCategoryHabOpt.map((item, idx)=>(
                                                                                    <option key={idx} value={item.value}>{item.text}</option>
                                                                                ))
                                                                            }                                                                                                                                                                                                                       
                                                                        </Form.Control>  
                                                                        {errors.subCategoryHab && <Form.Control.Feedback type="invalid" >{errors.subCategoryHab}</Form.Control.Feedback>}                                     
                                                                    </Form.Group>
                                                                </Col>   
                                                            </Row> 
                                                        </Col>                                                        
                                                    </Row>
                                                </Tab>
                                                <Tab eventKey="habitantes" title="Habitantes">
                                                    <Row className="mt-5">
                                                        
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>Asociado <span className="text-danger">*</span></Form.Label>
                                                                <SelectAjax
                                                                    defaultValue={Object.keys(asociado).length === 0 ? false : asociado}
                                                                    url={`${RESIDENTE_GET_BY_TIPO}/asociado`}
                                                                    access_token={auth.data.access_token}
                                                                    isMulti={false}
                                                                    handleChange={(value) => {
                                                                        setAsociado(value)
                                                                        setValidAsociado(true)
                                                                    }} 
                                                                    defaultOptions={asociado}   
                                                                    valid={isValidAsociado}     
                                                                    isClearable={false}                                                 
                                                                />      
                                                            {!isValidAsociado && <Form.Control.Feedback type="invalid" >Campo requerido</Form.Control.Feedback>}                   
                                                            </Form.Group>
                                                        </Col>                                                        
                                                                                                                
                                                        {
                                                            type_lote!=='condominal' &&
                                                            <Col xs lg="6">
                                                                <Form.Group>
                                                                    <Form.Label>Inquilinos</Form.Label>
                                                                    <SelectAjax
                                                                        defaultValue={residentes !==null && residentes.length === 0 ? false : residentes}
                                                                        url={`${RESIDENTE_GET_BY_TIPO}/inquilino`}
                                                                        access_token={auth.data.access_token}
                                                                        isMulti={true}
                                                                        handleChange={setResidentes} 
                                                                        defaultOptions={residentes}   
                                                                        valid={true}     
                                                                        isClearable={true}                                                 
                                                                    />                       
                                                                </Form.Group>
                                                            </Col>
                                                        }  
                                                    </Row>
                                                </Tab>
                                                
                                                <Tab eventKey="direccion" title="Dirección">
                                                    <Row className="mt-5">
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>Calle <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control type="text" name="calle" className={`${errors.calle && 'error'}`}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.calle} 
                                                                />                   
                                                                {errors.calle && <Form.Control.Feedback type="invalid" >{errors.calle}</Form.Control.Feedback>}       
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>{labelManzana} <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control type="text" name="manzana" className={`${errors.manzana && 'error'}`}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.manzana} 
                                                                />                     
                                                                {errors.manzana && <Form.Control.Feedback type="invalid" >{errors.manzana}</Form.Control.Feedback>}        
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>{labelLote}</Form.Label>
                                                                <Form.Control type="text" name="lote"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.lote} 
                                                                />                         
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>Etapa</Form.Label>
                                                                <Form.Control type="text" name="etapa"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.etapa} 
                                                                />                         
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>Latitud</Form.Label>
                                                                <Form.Control type="text" name="latitud" disabled
                                                                    value={latitude}
                                                                />                         
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs lg="3">
                                                            <Form.Group>
                                                                <Form.Label>Longitud </Form.Label>
                                                                <Form.Control type="text" name="longitud" disabled
                                                                    value={longitude}
                                                                />                         
                                                            </Form.Group>
                                                        </Col> 
                                                        <Col>
                                                            <Maps
                                                                lat={latitude}
                                                                lng={longitude}
                                                                isMarkerShown={isMarkerShown}
                                                                onClick={onMapClick}
                                                                onMarkerClick={marker}
                                                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6jPmbF7m0sMTbGzqQg8ypu_TRmyzrJOg&v=3.exp&libraries=geometry,drawing,places"
                                                                loadingElement={<div style={{ height: `100%` }} />}
                                                                containerElement={<div style={{ height: `400px` }} />}
                                                                mapElement={<div style={{ height: `100%` }} />}
                                                            />
                                                        </Col> 
                                                    </Row>
                                                </Tab>
                                                
                                                {                                                    
                                                    ((!isLoadEntity && id!==null && type_lote==='condominal') 
                                                    || (!isLoadEntity && id!==null && type_lote==='habitacional' && parentLote!=null)) &&
                                                    <Tab eventKey="children" title={`${type_lote==='condominal'? 'Viviendas': 'Condominio'}`}>
                                                        <Row className="mt-5">
                                                            {
                                                                
                                                                parentLote==null
                                                                ?
                                                                <ChildrenList 
                                                                    access_token={auth.data.access_token} 
                                                                    childrenList={childrenList} 
                                                                    type_lote={type_lote} 
                                                                    idParent={id}
                                                                    numeroViviendas={values.numeroViviendas}
                                                                />                                                            
                                                                :
                                                                <Col xs lg="3">
                                                                    <label>Lote condominal</label><br />
                                                                    <FaRegBuilding /> {parentLote.referencia}
                                                                </Col>
                                                            }

                                                        </Row>
                                                    </Tab>
                                                }
                                                {
                                                    ((type_lote==="comercial" || type_lote==="condominal") 
                                                    || (type_lote === "habitacional" && parentLote===null)) &&
                                                    <Tab eventKey="recurrentes" title="Cargos recurrentes">
                                                        <Row className="mt-5">
                                                            <Col xs lg="2">
                                                                <Form.Group>
                                                                    <Form.Label className="opacity-0">Activo</Form.Label>
                                                                    <Form.Check 
                                                                        type="switch"
                                                                        id="isRecurrente"
                                                                        label="Cargos recurrentes"
                                                                        name="isRecurrente"
                                                                        checked={values.isRecurrente}
                                                                        onChange={() => setFieldValue('isRecurrente', !values.isRecurrente)}
                                                                    />                                                            
                                                                </Form.Group>
                                                            </Col>                                                               
                                                        </Row>
                                                    </Tab>
                                                }

                                            {id!==null && <Tab eventKey="generarqr" title="QR">
                                                <Row className='mt-5'>
                                                    <Col xs lg={{span: "6", offset: 3}}>
                                                        <div className='text-center px-4 my-4' ref={componentRef}>
                                                            <div>
                                                                <QRCode value={JSON.stringify({id: btoa(id), residencial: process.env.REACT_APP_RESIDENCIAL})} />
                                                            </div>
                                                        </div>                                                        
                                                    </Col>
                                                    <Col xs lg={{span: "6", offset:'3'}}>
                                                        <div className='text-center mt-2'>
                                                            <ReactToPrint
                                                                trigger={() => <Button variant='outline-secondary' size='sm'>Imprimir</Button>}
                                                                content={() => componentRef.current}
                                                                bodyClass="qr"
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Tab>}
                                                
                                            </Tabs>  
                                            <Row className="mt-4">
                                                <Col>
                                                    <Button variant="primary" type="submit">Aceptar</Button>{' '}
                                                    <Link to={`/operaciones/lote/${type_lote}`} className="btn btn-secondary">Cancelar</Link>
                                                </Col>
                                            </Row>                                             
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row> 
                                                     
                        </Form>
                    )}
                </Formik>
            }
        </div>           
    )
}