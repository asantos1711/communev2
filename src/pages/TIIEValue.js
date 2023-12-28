import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import { useHistory, Link } from 'react-router-dom';
import { TIIE_GET_BY_ID, TIIE_SAVE } from '../service/Routes';
import Get from '../service/Get';
import * as Yup from 'yup';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';
import DatePicker from 'react-datepicker';
import moment from 'moment'

export default function TIIEValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    const history = useHistory()
    const [date, setDate] = useState(new Date())

    const [initialValues, setInitialValues] = useState({
        id: '', 
        mes: moment(new Date()).format("M"),
        year: moment(new Date()).format("YYYY"),
        porcentaje: ''
    })
    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${TIIE_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{                        
                let entity ={
                    id: response.data.data.id,
                    mes: response.data.data.mes,
                    year: response.data.data.year,
                    porcentaje: response.data.data.porcentaje
                }
                setDate(new Date(response.data.data.year, response.data.data.mes-1, 1))
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        mes: Yup.number()
            .required('Campo Requerido'),
        year: Yup.number()
            .required('Campo Requerido'),
        porcentaje: Yup.number()
          .positive("No puede poner porcentaje negativo")  
          .min(1, 'Campo porcentaje mayor a 0')
          .max(100, 'Campo porcentaje menor o igual a 100')
          .required('Campo Requerido')
    });
    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton height={200}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        const d={
                            id: values.id,
                            mes: values.mes,
                            year: values.year,
                            porcentaje: values.porcentaje                            
                        }
                        Post({url: TIIE_SAVE, data: d,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            //console.log(response)
                            setSubmitting(false)
                            if(response.data.success){
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/admin/tiie")
                            }else{
                                toast.info(response.data.message, {autoClose: 8000})
                            }
                            
                        })
                        .catch(error=>{
                            setSubmitting(false)
                           // console.log(error)
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
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Período <span className="text-danger">*</span></Form.Label>
                                    <DatePicker className={`${(errors.year || errors.mes) && 'error'} form-control`}
                                        dateFormat="MMMM/yyyy"
                                        locale="es"
                                        selected={date}
                                        onChange={date => {
                                            if(date===null){
                                                setDate(new Date())
                                                setFieldValue('mes', moment(new Date()).format("M"))
                                                setFieldValue('year', moment(new Date()).format("YYYY"))
                                            }else{
                                                setDate(date)
                                                setFieldValue('mes', moment(date).format("M"))
                                                setFieldValue('year', moment(date).format("YYYY"))
                                            }
                                        }}
                                        showMonthYearPicker
                                    />
                                    {(errors.year || errors.mes) && <Form.Control.Feedback type="invalid" >{errors.year}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Porcentaje <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.porcentaje && 'error'} form-control`}
                                        type="number"
                                        name="porcentaje"
                                    />                                    
                                    {errors.porcentaje && <Form.Control.Feedback type="invalid" >{errors.porcentaje}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                 
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/tiie" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}