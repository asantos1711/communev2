import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import useQuery from "../hook/useQuery"
import { BANCO_GET, CAJA_GET_BY_ID, CAJA_SAVE } from "../service/Routes"
import Get from "../service/Get"
import * as Yup from 'yup';
import { Field, Formik } from "formik"
import Post from "../service/Post";
import { toast } from "react-toastify"
import { Form, Row, Col, Button } from "react-bootstrap"
import { loaderRequest } from "../loaders/LoaderRequest"

export default function TipoCajaValue({auth, url, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [bancoOpt, setBancoOpt] = useState([])

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        noCuenta: '',
        noConvenio: '',
        noCLABE: '',
        banco: '',
        active: true,
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${CAJA_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name, 
                    noCuenta: response.data.data.noCuenta,
                    noConvenio: response.data.data.noConvenio,
                    noCLABE: response.data.data.noCLABE,
                    banco: response.data.data.banco.id,
                    active: response.data.data.active,              
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }
        
        //bancos get all
        Get({url: BANCO_GET, access_token: auth.data.access_token})
        .then(response=>{
            setBancoOpt(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .required('Campo Requerido'),
        noCuenta: Yup.string()
            .required('Campo Requerido'),
        noConvenio: Yup.string()
            .required('Campo Requerido'),
        noCLABE: Yup.string()
            .required('Campo Requerido'),
        banco: Yup.string()
            .required('Campo Requerido'),
    });

    return (
        <div>
            {
                isLoadEntity
                ? "loading"
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => { 
                        const d = Object.assign({}, values)
                        d['banco']={id: values.banco}
                            
                        console.log(d)
                        Post({url: CAJA_SAVE, data: d,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(response.data.success){
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push(url)
                            }else{
                                toast.warning(response.data.message,{ autoClose: 8000 })
                            }                            
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
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.name && 'error'}`}
                                        name="name"
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label className="opacity-0">Nombre <span className="text-danger">*</span></Form.Label>
                                    <div className="form-check">
                                        <Field 
                                            type="checkbox"
                                            name="active"
                                            className="form-check-input"
                                        />
                                        <label className="form-check-label">Activo</label>
                                    </div>                                    
                                    {errors.active && <Form.Control.Feedback type="invalid" >{errors.active}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>No. Cuenta <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.noCuenta && 'error'}`}
                                        name="noCuenta"
                                    />
                                    {errors.noCuenta && <Form.Control.Feedback type="invalid" >{errors.noCuenta}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>No. Convenio <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.noConvenio && 'error'}`}
                                        name="noConvenio"
                                    />
                                    {errors.noConvenio && <Form.Control.Feedback type="invalid" >{errors.noConvenio}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>No. CLABE <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.noCLABE && 'error'}`}
                                        name="noCLABE"
                                    />
                                    {errors.noCLABE && <Form.Control.Feedback type="invalid" >{errors.noCLABE}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>Banco <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.banco && 'error'}`}
                                        name="banco"
                                        as="select"
                                    >
                                        <option value="">Seleccionar</option>
                                        {
                                            bancoOpt.map((item,i)=>(
                                                <option key={i} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Field>
                                    {errors.banco && <Form.Control.Feedback type="invalid" >{errors.banco}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>     
                        </Row>                    
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/caja" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}