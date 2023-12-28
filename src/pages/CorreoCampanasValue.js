import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import { CORREO_CAMPANAS_GET_BY_ID, CORREO_CAMPANAS_SAVE } from '../service/Routes';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import { Field, Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { EditorState, convertToRaw,ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function CorreoCampanasValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    const history = useHistory()
    const [cuerpo, setCuerpo] = useState(EditorState.createEmpty())

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        titulo: '',
        cuerpo: ''
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${CORREO_CAMPANAS_GET_BY_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{  
                //console.log(response)       
                setCuerpo(EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(response.data.data.cuerpo)
                      )
                ))              
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    titulo: response.data.data.titulo,
                    //cuerpo: response.data.data.cuerpo
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,props.auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        titulo: Yup.string()
          .required('Campo Requerido'),
        name: Yup.string()
          .required('Campo Requerido'),
    });

    const onEditorStateChange = (editorState) => {
        setCuerpo(editorState)
    };

    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton height={400}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => { 
                        values['cuerpo'] = draftToHtml(convertToRaw(cuerpo.getCurrentContent()))
                        //console.log(values)  
                       
                        Post({url: CORREO_CAMPANAS_SAVE, data: values,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/admin/correo-campanas")
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
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.name && 'error'}`}
                                        type="text"
                                        name="name"
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                   
                        </Row> 
                        <Row>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Título <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.titulo && 'error'}`}
                                        type="text"
                                        name="titulo" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.titulo} 
                                    />
                                    {errors.titulo && <Form.Control.Feedback type="invalid" >{errors.titulo}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                   
                        </Row> 
                        <Row>
                            <Col>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                    <Editor
                                        editorState={cuerpo}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="border editorWrapper"
                                        onEditorStateChange={onEditorStateChange}
                                        toolbar={{
                                            inline: { inDropdown: false },
                                            list: { inDropdown: true },
                                            textAlign: { inDropdown: true },
                                            link: { inDropdown: true },
                                            history: { inDropdown: true },
                                        }}

                                    />
                                </Form.Group>
                            </Col>                            
                        </Row>                       
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/correo-campanas" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}