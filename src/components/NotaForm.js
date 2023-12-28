import { Field, Formik } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Col,Row,Button } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import * as Yup from 'yup';
import es from "date-fns/locale/es";
import moment from "moment";
import Post from '../service/Post';
import { NOTAALERTA_GET_SAVE } from '../service/Routes';
import { toast } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';

registerLocale("es", es);

export default function NotaForm({auth, id, setItems, items,initialValues,setInitialValues,alert}){
    const shemaValidate = Yup.object().shape({
        descripcion: Yup.string()
            .required('Campo Requerido'),
        fechaRecordatorio: Yup.string()
            .required('Campo Requerido'),
    });


    return(
        <Row>            
            <Col>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue, resetForm }) => { 
                        let d ={
                            id: values.id,
                            tipo: values.tipo,
                            lote: {id: id},
                            activa: true,
                            descripcion: values.descripcion,
                            fechaRecordatorio: moment(values.fechaRecordatorio).format("YYYY-MM-DD")
                        }                                       
                        Post({url: NOTAALERTA_GET_SAVE, data: d,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            if(values.id===""){
                                let arr = [...items]
                                arr.push(response.data.data)
                                setItems(arr)
                            }else{
                                let arr = [...items]
                                const index = arr.findIndex(e=>e.id===values.id);
                                arr[index].fechaRecordatorio = values.fechaRecordatorio
                                arr[index].descripcion = values.descripcion
                                setItems(arr)
                            }
                            // setInitialValues({
                            //     id: '',
                            //     tipo: 'nota',
                            //     lote: {id: id},
                            //     activa: true,
                            //     descripcion: '',
                            //     fechaRecordatorio: ''
                            // })   
                            resetForm({
                                values: {
                                  // the type of `values` inferred to be Blog
                                  id: '',
                                  descripcion: '',
                                  fechaRecordatorio: '',
                                }}
                            )                         
                            setSubmitting(false)
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
                    <Form className="form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Fecha {alert ? 'recordatorio' : 'creación'} <span className="text-danger">*</span></Form.Label>
                                    <DatePicker className={`${errors.fechaRecordatorio && 'error'} form-control`}
                                        showPopperArrow={false}
                                        selected={values.fechaRecordatorio}
                                        autoComplete="off"
                                        locale="es"
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date()}
                                        onChange={date => {
                                            if(date===null){
                                                setFieldValue('fechaEntrega', new Date())
                                            }else{
                                                setFieldValue('fechaRecordatorio', date)
                                            }                                                                              
                                        }}
                                    /> 
                                    {errors.fechaRecordatorio && <Form.Control.Feedback type="invalid" >{errors.fechaRecordatorio}</Form.Control.Feedback>} 
                                </Form.Group>
                            </Col>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.descripcion && 'error'} form-control`}
                                        as="textarea"
                                        rows="3"
                                        name="descripcion" 
                                    />
                                    {errors.descripcion && <Form.Control.Feedback type="invalid" >{errors.descripcion}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>                                                                     
                        </Row>  
                        <Row>
                            <Col><Button type="submit" variant="primary">Salvar</Button></Col>                            
                        </Row>
                    </Form>
                )}
                </Formik>
            </Col>            
        </Row>
    ) 

}