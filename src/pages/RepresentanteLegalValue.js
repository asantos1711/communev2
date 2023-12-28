import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useQuery from "../hook/useQuery";
import Get from "../service/Get";
import {EMAIL_DELETE, LOTE_FOR_VEHICLES, REPRESENTANTE_LEGAL_GET_BY_ID, REPRESENTANTE_LEGAL_SAVE, TELEFONO_DELETE, TIPO_NUMERO_TELEFONO} from '../service/Routes'
import * as Yup from 'yup';
import Delete from "../service/Delete";
import { toast } from "react-toastify";
import * as EmailValidator from 'email-validator';
import { loaderRequest } from "../loaders/LoaderRequest";
import ResidenteSkeleton from "../loaders/ResidenteSkeleton";
import { Formik } from "formik";
import Post from "../service/Post";
import { Card, Dropdown, Form,Row,Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoMdRemoveCircle } from "react-icons/io";
import SelectAjax from "../components/SelectAjax";
import { IMaskInput } from "react-imask";

export default function RepresentanteLegalValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const [lote, setLote] = useState(null)
    const query = useQuery()
    let idEntity = query.get('id');
    let history = useHistory()
    const [telefonos, setTelefonos] = useState([])
    const [emails, setEmails] = useState([])
    const [showModalTelef, setShowModalTelef] = useState(false);
    const [showModalEmail, setShowModalEmail] = useState(false);
    const [isDeleting, setDeleting] = useState(false)
    const [tipoOptions, setTipoOptions] = useState([])
    const [loteListDef, setLoteListDef] = useState([])

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        tipoPoder: '',
        loteList: []
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${REPRESENTANTE_LEGAL_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{       
                console.log(response)
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    tipoPoder: response.data.data.tipoPoder,
                    loteList: response.data.data.loteList
                }
                setLoteListDef(response.data.data.lote_residente.map(el=>({value: el.id, label: el.name})))
                setTelefonos(response.data.data.telefonoList)
                setEmails(response.data.data.correoElectronicoList)
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

    }, [idEntity, auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Campo Requerido'),
        loteList: Yup.array().min(1,'Campo Requerido'),
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
        const obj = telefonos.filter((item, i)=>{return i === idx})
        if(obj.length > 0 &&  obj[0].id!==null && obj[0].id!==""){
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

    const handleCloseEmail = () => setShowModalEmail(false);
    const handleShowEmail = () => setShowModalEmail(true);

    const addEmail = () =>{
        if(!EmailValidator.validate(email)){
            setValidEmail(false)
        }else{
            setValidEmail(true)
            var obj = {
                id:"",
                correo: email,
                facturar: false,
                referencia: referenciaEmail
            }
            setEmails(emails.concat(obj))
            setShowModalEmail(false)
            setReferenciaEmail('')
            setEmail('')
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

    return(
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
                        let data = Object.assign({}, values)  
                        data['telefonoList'] = telefonos
                        data['correoElectronicoList'] = emails
                        data['loteList'] = values.loteList.map(el=>({id: el.id}))
                        
                        console.log(data)
                        Post({url: REPRESENTANTE_LEGAL_SAVE, data: data,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push(`/operaciones/representantelegal`)
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
                    <Form className="my-4 form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col xs="12" lg="12">
                                <Row>
                                    <Col>
                                        <Card className="shadow mb-4">
                                            <Card.Body>
                                                <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} representante legal`}</Card.Title>
                                                <Dropdown.Divider /> 
                                                <Row>
                                                    <Col xs lg="4">
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
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Tipo de poder</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="tipoPoder" 
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.tipoPoder} 
                                                            />                          
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs="12" lg="12">
                                                        <Form.Group>
                                                            <Form.Label>Lote<span className="text-danger">*</span></Form.Label>
                                                            <SelectAjax
                                                                defaultValue={loteListDef}
                                                                url={LOTE_FOR_VEHICLES}
                                                                access_token={auth.data.access_token}
                                                                isMulti={true}
                                                                handleChange={(value) => {
                                                                    if(value){
                                                                        setFieldValue('loteList', value.map(el=>({id: el.value})))
                                                                    }else{
                                                                        setFieldValue('loteList',[])
                                                                    }
                                                                    
                                                                }}  
                                                                valid={errors.loteList === 'Campo Requerido' ? false:true}     
                                                                isClearable={false}                                                 
                                                            />
                                                            {errors.loteList && <Form.Control.Feedback type="invalid" >{errors.loteList}</Form.Control.Feedback>}                            
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
                                                            return <li key={i}>{`${item.correo}  ${item.referencia}`}
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
                            </Col>                                                      
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/operaciones/representantelegal" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}