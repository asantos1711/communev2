import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import {RESIDENTE_GET_By_ID,RESIDENTE_SAVE, TIPO_NUMERO_TELEFONO,TELEFONO_DELETE,EMAIL_DELETE, TARJETA_DELETE,TARJETA_CHANGE_ACTIVE, BANCO_GET} from '../service/Routes'
import * as Yup from 'yup';
import { Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button, Card, Dropdown, ListGroup, Modal, Table } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { Link, useHistory } from 'react-router-dom';
import ResidenteSkeleton from '../loaders/ResidenteSkeleton';
import { FaRegBuilding, FaMapMarkerAlt } from "react-icons/fa";
import {IMaskInput} from 'react-imask';
import SelectAjax from '../components/SelectAjax';
import { IoMdRemoveCircle } from 'react-icons/io';
import Delete from '../service/Delete';
import { FcOk } from "react-icons/fc";
import * as EmailValidator from 'email-validator';
import InputMask from "react-input-mask";
import {formatTipoTarjeta} from '../utils/formatTipoTarjeta'
import { BsPersonFill } from 'react-icons/bs';
import { labelLote } from '../constant/token';

export default function HabitantesValue({auth, isEditing, tipoHabitante}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const [lotes, setLotes] = useState([])
    const query = useQuery()
    let idEntity = query.get('id');
    let history = useHistory()
    const [telefonos, setTelefonos] = useState([])
    const [emails, setEmails] = useState([])
    const [showModalTelef, setShowModalTelef] = useState(false);
    const [showModalEmail, setShowModalEmail] = useState(false);
    const [isDeleting, setDeleting] = useState(false)
    const [tipoOptions, setTipoOptions] = useState([])
    const [tarjetas, setTarjetas] = useState([])
    const [showModalTarjeta, setShowModalTarjeta] = useState(false);

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        tipo: tipoHabitante
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${RESIDENTE_GET_By_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{       
                //console.log(response)  
                setLotes(response.data.data.direcciones)
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    tipo: tipoHabitante   
                }
                setTelefonos(response.data.data.telefonoList)
                setEmails(response.data.data.correoElectronicoList)
                setTarjetas(response.data.data.tarjetaList)
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }
        
        //cargar tipo de telefonos
        Get({url: TIPO_NUMERO_TELEFONO, access_token: auth.data.access_token})
        .then(response=>{
            setTipoOptions(response.data.map(item => { return {value: item.id, label: item.name}}))
        })

        //cargar Bancos
        Get({url: BANCO_GET, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response.data)
            setBancoOpt(response.data.map(item => { return {id: item.id, name: item.name}}))
        })


    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Campo Requerido'),
    });

    const [tipo, setTipo] = useState(null)
    const [numero, setNumero] = useState('')
    const [referencia, setReferencia] = useState('')
    const [isValidTipo, setValidTipo] = useState(true)
    const [isValidNumero, setValidNumero] = useState(true)

    const addTelefono = () =>{
        var valid = true
        if(tipo===null){
            setValidTipo(false)
            valid=false
        }
        if(numero.length!==10){
            setValidNumero(false)
            valid=false
        }
        if(valid){
            var obj = {
                id:"",
                tipoNumeroTelefono: {id: tipo.value, name:tipo.label},
                numero: numero,
                referencia: referencia
            }
            setTelefonos(telefonos.concat(obj))
            setShowModalTelef(false)
            setReferencia('')
            setNumero('')
            setTipo(null)
        }        

    }
    const handleCloseTelef = () => setShowModalTelef(false);
    const handleShowTelef = () => setShowModalTelef(true);

    const delTelef = idx =>{
        //console.log(idx)
        //checamos si tiene id
        const obj = telefonos.filter((item, i)=>{return i === idx})
        if(obj.length > 0 &&  obj[0].id!==null && obj[0].id!==""){
            //send peticion para eliminar el telefono
            setDeleting(true)
            Delete({url: `${TELEFONO_DELETE}/${obj[0].id}`, access_token: auth.data.access_token})
            .then(response=>{
                if(response.data.success){
                    setDeleting(false)
                    toast.success("Acción exitosa", {autoClose: 2000})
                    setTelefonos(telefonos.filter((item, i)=>{
                        return i!==idx
                    }))
                }else{
                    setDeleting(false)
                    toast.error("No podemos realizar esta acción por el momento. Intente más tarde", {autoClose: 5000})
                }
            })

        }else{
            setTelefonos(telefonos.filter((item, i)=>{
                return i!==idx
            }))
        }        
    }

    const [referenciaEmail, setReferenciaEmail] = useState('')
    const [email, setEmail] = useState('')
    const [isValidEmail, setValidEmail] = useState(true)
    const [facturar, setFacturar] = useState(false)

    const handleCloseEmail = () => setShowModalEmail(false);
    const handleShowEmail = () => setShowModalEmail(true);
    const handleShowTarjetas = () => setShowModalTarjeta(true);
    const handleCloseTarjeta = () => setShowModalTarjeta(false);
    
    

    const addEmail = () =>{
        if(!EmailValidator.validate(email)){
            setValidEmail(false)
        }else{
            setValidEmail(true)
            var obj = {
                id:"",
                correo: email,
                facturar: facturar,
                referencia: referenciaEmail
            }
            setEmails(emails.concat(obj))
            setShowModalEmail(false)
            setReferenciaEmail('')
            setEmail('')
            setFacturar(false)
        }
    }

    const deleteEmail = idx => {
        const obj = emails.filter((item, i)=>{return i === idx})
        if(obj.length > 0 &&  obj[0].id!==null && obj[0].id!==""){
            //send peticion para eliminar el telefono
            setDeleting(true)
            Delete({url: `${EMAIL_DELETE}/${obj[0].id}`, access_token: auth.data.access_token})
            .then(response=>{
                if(response.data.success){
                    setDeleting(false)
                    toast.success("Acción exitosa", {autoClose: 2000})
                    setEmails(emails.filter((item, i)=>{
                        return i!==idx
                    }))
                }else{
                    setDeleting(false)
                    toast.error("No podemos realizar esta acción por el momento. Intente más tarde", {autoClose: 5000})
                }
            })

        }else{
            setEmails(emails.filter((item, i)=>{
                return i!==idx
            }))
        }     
    }

    const [nombre, setNombre] = useState("")
    const [tarjeta, setTarjeta] = useState("")
    const [tipoTarjeta, setTipoTarjeta] = useState("")
    const [numeroTarjeta, setNumeroTarjeta] = useState("")
    const [fechaVencimiento, setFechaVencimiento] = useState("")
    const [cvv, setCVV] = useState("")
    const [banco, setBanco] = useState("")  
    const [bancoOpt, setBancoOpt] = useState([])
    const [active, setActive] = useState(true) 

    const addTarjeta = () =>{
        var obj = {
            id:"",
            nombre: nombre,
            tarjeta: tarjeta,
            tipo: tipoTarjeta,
            numero: numeroTarjeta,
            fechaVencimiento: fechaVencimiento,
            cvv: cvv,
            banco: {id: banco},
            active: active
        }
        //console.log(obj)
        setTarjetas(tarjetas.concat(obj))
        setShowModalTarjeta(false)
        setNombre("")
        setTarjeta("")
        setTipoTarjeta("")
        setNumeroTarjeta("")
        setFechaVencimiento("")
        setCVV("")
        setBanco("")        
    }

    const deleteTarejta = idx => {
        const obj = tarjetas.filter((item, i)=>{return i === idx})
        if(obj.length > 0 &&  obj[0].id!==null && obj[0].id!==""){
            //send peticion para eliminar el telefono
            setDeleting(true)
            Delete({url: `${TARJETA_DELETE}/${obj[0].id}`, access_token: auth.data.access_token})
            .then(response=>{
                if(response.data.success){
                    setDeleting(false)
                    toast.success("Acción exitosa", {autoClose: 2000})
                    setTarjetas(tarjetas.filter((item, i)=>{
                        return i!==idx
                    }))
                }else{
                    setDeleting(false)
                    toast.error("No podemos realizar esta acción por el momento. Intente más tarde", {autoClose: 5000})
                }
            })

        }else{
            setTarjetas(tarjetas.filter((item, i)=>{
                return i!==idx
            }))
        }     
    }

    const handleChangeActiveTarjeta = (checked, id) =>{
        //console.log(checked)
        //console.log(id)
        if(id!==""){
            setDeleting(true)
            //peticion a cambiar tarjet activa            
            const dt = checked
            Post({url: `${TARJETA_CHANGE_ACTIVE}/${id}`, data: dt,access_token: auth.data.access_token, header:true})
                .then(response=>{
                    //console.log(response.data.data.active)
                    setDeleting(false)
                    toast.success("Acción exitosa",{ autoClose: 2000 })
                    
                    
                    const index = tarjetas.findIndex(item=>item.id===id)

                    //console.log(index)
                    tarjetas[index].active = response.data.data.active
                    let arr = [...tarjetas];
                    setTarjetas(arr)
                })
                .catch(error=>{
                    setDeleting(false)
                    //console.log(error)
                    toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
                })  
        }
        
    }

    return (
        <div>
            {isDeleting && loaderRequest()}
            {
                isLoadEntity
                ? <ResidenteSkeleton />
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        values['telefonoList'] = telefonos
                        values['correoElectronicoList'] = emails
                        values['tarjetaList'] = tarjetas
                        
                        //console.log(values)
                        Post({url: RESIDENTE_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            setFieldValue("id", response.data.data.id)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push(`/operaciones/habitantes/${tipoHabitante}`)
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            //console.log(error)
                            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
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
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col xs lg="6">
                                <Row>
                                    <Col>
                                        <Card className="shadow mb-4">
                                            <Card.Body>
                                                <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} asociados`}</Card.Title>
                                                <Dropdown.Divider /> 
                                                <Row>
                                                    <Col xs lg="8">
                                                        <Form.Group>
                                                            <Form.Label>Nombre completo<span className="text-danger">*</span></Form.Label>
                                                            <Form.Control className={`${errors.name && 'error'}`}
                                                                type="text"
                                                                name="name" 
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name} 
                                                            />
                                                            {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                                        </Form.Group>
                                                    </Col>                                                  
                                                </Row>
                                            </Card.Body>
                                        </Card>                                        
                                    </Col>                                    
                                </Row>
                                <Row>
                                    <Col xs lg="6">
                                        <Card className="shadow mb-4">
                                            <Card.Body>
                                                <Card.Title><h6>Teléfono <Button variant="outline-primary" size='sm' onClick={handleShowTelef}>Nuevo</Button></h6>  </Card.Title>
                                                <Dropdown.Divider />
                                                <ul className="list-unstyled">
                                                    {
                                                        telefonos.map((item, i)=>{
                                                            return <li key={i}>{`${item.tipoNumeroTelefono.name}  ${item.numero}  ${item.referencia}`} 
                                                                        <IoMdRemoveCircle className="del-telef-list" onClick={e=>delTelef(i)}/>
                                                                    </li>
                                                        })
                                                    }
                                                </ul>
                                                <Modal show={showModalTelef} onHide={handleCloseTelef} size="lg">
                                                    <Modal.Header closeButton></Modal.Header>
                                                    <Modal.Body>
                                                        <Form.Row>
                                                            <Col>
                                                            <SelectAjax
                                                                defaultValue={tipo === null ? false : tipo}
                                                                url={TIPO_NUMERO_TELEFONO}
                                                                access_token={auth.data.access_token}
                                                                isMulti={false}
                                                                handleChange={(value) => {
                                                                    setTipo(value)
                                                                }} 
                                                                defaultOptions={tipoOptions}   
                                                                valid={isValidTipo}     
                                                                isClearable={false}                                                 
                                                            />
                                                            </Col>
                                                            <Col>
                                                            <IMaskInput
                                                                className={`${!isValidNumero && 'error'} form-control`}
                                                                mask='(000)-000-00-00'
                                                                lazy={false}
                                                                value={numero}
                                                                autofix={true}
                                                                unmask={true}
                                                                onAccept={
                                                                    (value, mask) => {
                                                                        setNumero(value)
                                                                    }
                                                                }
                                                                placeholderChar='_'
                                                            />
                                                            </Col>
                                                            <Col>
                                                                <Form.Control 
                                                                    placeholder="Referencia"
                                                                    value={referencia}
                                                                    onChange={e=>setReferencia(e.target.value)}
                                                                />
                                                            </Col>
                                                        </Form.Row> 
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                    <Button variant="primary" onClick={addTelefono}>
                                                        Aceptar
                                                    </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs lg="6">
                                        <Card className="shadow mb-4">
                                            <Card.Body>
                                                <Card.Title><h6>Correo electrónico <Button variant="outline-primary" size='sm' onClick={handleShowEmail}>Nuevo</Button></h6>  </Card.Title>
                                                <Dropdown.Divider />
                                                <ul className="list-unstyled">
                                                    {
                                                        emails.map((item, i)=>{
                                                            return <li key={i}>{`${item.correo}  ${item.referencia}`} {item.facturar && <FcOk />} 
                                                                        <IoMdRemoveCircle className="del-telef-list" onClick={e=>deleteEmail(i)}/>
                                                                    </li>
                                                        })
                                                    }
                                                </ul>
                                                <Modal show={showModalEmail} onHide={handleCloseEmail} size="lg">
                                                    <Modal.Header closeButton></Modal.Header>
                                                    <Modal.Body>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Control 
                                                                    className={`${!isValidEmail && 'error'} form-control`}
                                                                    placeholder="Email"
                                                                    value={email}
                                                                    onChange={e=>setEmail(e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Form.Control 
                                                                    placeholder="Referencia"
                                                                    value={referenciaEmail}
                                                                    onChange={e=>setReferenciaEmail(e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Form.Check type="checkbox" label="Enviar factura"
                                                                    checked={facturar}
                                                                    onChange={e=>setFacturar(e.target.checked)}
                                                                />
                                                            </Col>
                                                        </Form.Row> 
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                    <Button variant="primary" onClick={addEmail}>
                                                        Aceptar
                                                    </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row> 
                                {/* <Row>
                                    <Col>
                                        <Card className="shadow mb-4">
                                            <Card.Body>
                                                <Card.Title><h6>Tarjetas <Button variant="outline-primary" size='sm' onClick={handleShowTarjetas}>Nueva</Button></h6></Card.Title>                                                
                                                <Table size="sm">
                                                    <thead>
                                                        <tr>
                                                            <td>Nombre</td>
                                                            <td>Número</td>
                                                            <td>Tarjeta</td>
                                                            <td>Tipo</td>
                                                            <td>Activa</td>
                                                            <td></td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tarjetas.map((item, i)=>{
                                                                return <tr key={i}>
                                                                    <td>{item.nombre}</td>
                                                                    <td>{`**** ${item.id === "" ? item.numero.substring(15) : item.numero}`}</td>
                                                                    <td>{formatTipoTarjeta(item.tarjeta)}</td>
                                                                    <td>{formatTipoTarjeta(item.tipo)}</td>
                                                                    <td> <input type="checkbox" checked={item.active} onChange={e => handleChangeActiveTarjeta(e.target.checked, item.id)}/></td>
                                                                    <td><IoMdRemoveCircle className="del-telef-list" onClick={e=>deleteTarejta(i)}/></td>
                                                                </tr>
                                                            })
                                                        }                                                        
                                                    </tbody>
                                                </Table>
                                                <Modal show={showModalTarjeta} onHide={handleCloseTarjeta} size="lg">
                                                    <Modal.Header closeButton></Modal.Header>
                                                    <Modal.Body>
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
                                                                <InputMask 
                                                                    className="form-control"
                                                                    mask="9999-9999-9999-9999" 
                                                                    onChange={e=>setNumeroTarjeta(e.target.value)} 
                                                                    value={numeroTarjeta} />                                                                
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
                                                                <InputMask 
                                                                    className="form-control"
                                                                    mask="999" 
                                                                    onChange={e=>setCVV(e.target.value)} 
                                                                    value={cvv} />                                                                
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
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>                                */}
                            </Col>
                            <Col xs lg="6">
                                <Card className="shadow mb-4">
                                    <Card.Body>
                                        <Card.Title><h6>{labelLote}</h6></Card.Title>
                                        <Dropdown.Divider /> 
                                            <Row>
                                                <Col>
                                                    <ListGroup variant="flush" className={`text-secondary ${lotes.length >=4 && 'h-400'}`}>
                                                    {
                                                        lotes.map((item,i)=>(
                                                            <ListGroup.Item key={i}>
                                                                <div>
                                                                    <FaRegBuilding /> <span className="text-underline">{item.referencia}</span>
                                                                </div>
                                                                <div>
                                                                    <BsPersonFill /> {item.is_asociado ? "Asociado" : "Inquilino"}
                                                                </div>
                                                                <div>
                                                                    <FaMapMarkerAlt /> {item.direccion.replace('Lote:', `${labelLote}:`)}
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))
                                                    }  
                                                    </ListGroup>                                                    
                                                </Col>                                               
                                            </Row>
                                    </Card.Body>
                                </Card>
                            </Col>                                                       
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/operaciones/habitantes" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}