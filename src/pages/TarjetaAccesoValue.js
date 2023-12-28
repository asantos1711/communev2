import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import { useHistory, Link } from 'react-router-dom';
import Get from '../service/Get';
import { TARJETA_ACCESO_GET_BY_ID, TARJETA_ACCESO_SAVE, TARJETA_ACCESO_AUTOCOMPLETE_RESIDENTE } from '../service/Routes';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import SelectAjax from '../components/SelectAjax';
import DatePicker from "react-datepicker";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from 'react-loading-skeleton';
import TarjetaAccesoSkeleton from '../loaders/TarjetaAccesoSkeleton';

export default function TarjetaAccesoValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    let history = useHistory()
    const [residente, setResidente] = useState(null)
    const [isValidResidente, setValidResidente] = useState(true)
    const [initialValues, setInitialValues] = useState({
        id: '', 
        numero: '',
        fechaBaja: '',
        status: 'activo',
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${TARJETA_ACCESO_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{       
                //console.log(response)  
                let entity ={
                    id: response.data.data.id,
                    numero: response.data.data.numero,
                    fechaBaja: response.data.data.fechaBaja !== null ? new Date(moment.utc(response.data.data.fechaBaja).format("YYYY/MM/DD")) : "",
                    status: response.data.data.status,                  
                }
                setInitialValues(entity)
                //residente
                setResidente({
                    'label': response.data.data.dataTransient.name,
                    'value': response.data.data.dataTransient.id,
                })
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        numero: Yup.string()
          .required('Campo Requerido'),
        status: Yup.string()
          .required('Campo Requerido')
    });

    return(
        <div>
            {
                isLoadEntity ? <TarjetaAccesoSkeleton /> :
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {  
                        var validForm = true
                        if(residente===null || Object.keys(residente).length ===0 ){
                            validForm=false
                            setValidResidente(false)
                            setSubmitting(false)
                        }       
                             
                        if(validForm){
                            const d ={
                                id: values.id,
                                numero: values.numero,
                                status: values.status,
                                fechaBaja: values.fechaBaja!== '' && values.fechaBaja!==null ? moment(values.fechaBaja).format("YYYY-MM-DD"): '',
                                vehiculo: {id: residente.value}
                            }                            
                            Post({url: TARJETA_ACCESO_SAVE, data: d,access_token: auth.data.access_token, header:true})
                            .then(response=>{
                                setSubmitting(false)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/operaciones/tarjeta-acceso")
                            })
                            .catch(error=>{
                                setSubmitting(false)
                                //console.log(error)
                                toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
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
                    setFieldValue
                }) => (
                    <Form className="mt-4 form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Número <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.numero && 'error'} form-control`}
                                        type="text"
                                        name="numero"
                                    />
                                    {errors.numero && <Form.Control.Feedback type="invalid" >{errors.numero}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                                    <Field as="select" className={`${errors.status && 'error'} form-control`} type="text" name="status">
                                        <option value="activo">Activo</option>
                                        <option value="baja">Baja</option>
                                        <option value="suspendido">Suspendido</option>
                                    </Field>
                                    {errors.status && <Form.Control.Feedback type="invalid" >{errors.status}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Fecha baja </Form.Label>
                                        <DatePicker className="form-control"
                                            showPopperArrow={false}
                                            selected={values.fechaBaja}
                                            autoComplete="off"
                                            dateFormat="dd-MM-yyyy"
                                            onChange={date => {setFieldValue('fechaBaja', date)}}
                                        />                                        
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Residente <span className="text-danger">*</span></Form.Label>
                                    <SelectAjax
                                        defaultValue={residente === null || Object.keys(residente).length === 0 ? false : residente}
                                        url={TARJETA_ACCESO_AUTOCOMPLETE_RESIDENTE}
                                        access_token={auth.data.access_token}
                                        isMulti={false}
                                        handleChange={(value) => {
                                            setResidente(value)
                                            setValidResidente(true)
                                        }} 
                                        defaultOptions={residente}   
                                        valid={isValidResidente}     
                                        isClearable={false}                                                 
                                    />                                      
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/operaciones/tarjeta-acceso" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}
                </Formik>
            }
        </div>
    )

}