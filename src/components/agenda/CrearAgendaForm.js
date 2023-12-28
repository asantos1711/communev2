import { Field, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import { authContext } from "../../context/AuthContext";
import Get from "../../service/Get";
import { AMENIDAD_CREATE_AGENDA_SAVE, DELETE_HORARIOP, DELETE_VARIACIONES, LOTE_GET, REGLAAMENIDAD_GET_ACTIVE, TIPOAMENIDAD_GET_ACTIVAS } from "../../service/Routes";
import * as Yup from 'yup';
import { loaderRequest } from "../../loaders/LoaderRequest";
import moment from "moment";
import { FaTrash } from "react-icons/fa";
import Post from "../../service/Post";
import { toast } from "react-toastify";
import Delete from "../../service/Delete";
import { useHistory } from "react-router-dom";
import Select  from "react-select";

export default function CrearAgendaForm({agenda=null}){
    const { auth } = useContext(authContext)
    const [tipoAmenidadesOpt, setTipoAmenidadesOpt]  = useState([])
    const [reglasOpt, setReglasOpt] = useState(agenda?.reglasAgendaList ?? [])
    const history = useHistory();
    const [initialValues, setInitialValues] = useState({
        id: agenda?.id ?? '', 
        tipoAmenidad: agenda?.tipoAmenidad?.id ??  '',
        variacionAmenidad: agenda?.tipoAmenidadVariacionesList ?? [],
        loteList: [agenda?.lote] ?? [],
        aforoMaximo: agenda?.aforoMaximo ?? 10,
        bookingWindows: agenda?.bookingWindowsDesdeHr ? [agenda.bookingWindowsDesdeHr, agenda.bookingWindowsHastaHr] : [],//desde-hasta prev horas
        duracion: agenda?.duracionActividadMinutos ?? 0,
        diasDisponibles: agenda?.diasDisponible ? agenda.diasDisponible.split(";") : '', //L, M,M,J,V,S,D,
        horarioGeneral: agenda?.id ? [agenda?.horarioIniciaGlobal, agenda?.horarioTerminaGlobal] : [], //desde, hasta
        horarioPremium: agenda?.horarioServicioPremiumList ?? [], //desde, hasta
        permiteVisita: agenda?.permiteVisita ?? false,
        active: agenda?.activa ?? true,
        general: agenda?.general ?? false,
    });
   
    const [lote, setLote] = useState(agenda?.lote?.id ?? '')
    const [lotesOpt, setLotesOpt] = useState([])
    const [todosLotes, setTodosLotes] = useState(agenda?.general ?? false)
    const [errorForm, setErrorForm] = useState(false)


    const [diasDisponibles, setDiasDisponibles] = useState(agenda?.diasDisponible ? agenda.diasDisponible.split(";") : [])
    const [horarioGeneralStart, setHorarioGeneralStart] = useState(agenda?.horarioIniciaGlobal ?? '')
    const [horarioGeneralEnd, setHorarioGeneralEnd] = useState(agenda?.horarioTerminaGlobal ?? '')
    const [horariosPremium, setHorarioPremium] = useState(agenda?.horarioServicioPremiumList ?? [])
    const [horaPremiumStart, setHoraPremiumStart] = useState('')
    const [horaPremiumEnd, setHoraPremiumEnd] = useState('')
    const [variacion, setVariacion] = useState('')
    const [variacionesOpt, setVariacionesOpt] = useState(agenda?.tipoAmenidadVariacionesList ?? [])
    const [bookingWindowsDesde, setBookingWindowsDesde] = useState(agenda?.bookingWindowsDesdeHr ?? 0)
    const [bookingWindowsHasta, setBookingWindowsHasta] = useState(agenda?.bookingWindowsHastaHr ?? 0)

    useEffect(() => {
        //amenidades
        Get({url: TIPOAMENIDAD_GET_ACTIVAS, access_token: auth.data.access_token})
        .then(response=>{           
            setTipoAmenidadesOpt(response.data)
        })
        .catch(error=>{
            //todo console the error
        })

        Get({url: `${LOTE_GET}/condominal`, access_token: auth.data.access_token})
        .then(response=>{
            setLotesOpt(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })

        Get({url: REGLAAMENIDAD_GET_ACTIVE, access_token: auth.data.access_token})
        .then(response=>{
            response.data.forEach(item => {
                const obj = {checked: false, category: item.category, title: item.name, valor: ''}
                const fIndex = reglasOpt.findIndex(it => it.category === item.category)
                if(fIndex < 0){
                    setReglasOpt(prev => ([...prev, obj])) 
                }else{
                    const copyR = [...reglasOpt]
                    copyR[fIndex].title = item.name
                    setReglasOpt(copyR)
                }
            });
            
            //setReglasOpt(response.data.map(item=>({checked: false, category: item.category, title: item.name, valor: ''})))
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    const shemaValidate = Yup.object().shape({
        
    });

    const onHandleClick = (pos, dia) => {
        if(diasDisponibles.filter(item=>item===pos).length > 0){
            const diaFilter = diasDisponibles.filter(item=>item!==pos)
            setDiasDisponibles(diaFilter);
        }else{
            setDiasDisponibles(prev=>([...prev, pos]));
        }        
    }

    const crearHorarioPremium = () => {
        if(horaPremiumStart && horaPremiumEnd){
            const obj = {
                horarioInicia: horaPremiumStart,
                horarioTermina: horaPremiumEnd
            }

            const horaPInitM = moment(horaPremiumStart, "HH:mm");
            const horaPEndM = moment(horaPremiumEnd, "HH:mm");

            const horaGInitM = moment(horarioGeneralStart, "HH:mm");
            const horaGEndM = moment(horarioGeneralEnd, "HH:mm");

            if(horaGInitM.isSameOrBefore(horaPInitM) && horaGEndM.isSameOrAfter(horaPInitM)
            && horaGInitM.isSameOrBefore(horaPEndM) && horaGEndM.isSameOrAfter(horaPEndM)){
                if(horariosPremium.filter(item=>moment(item.horarioTermina, "HH:mm").isBefore(horaPInitM)).length === horariosPremium.length){
                    setHorarioPremium(prev=>([...prev, obj]))
                }
            }            
        }
    }
    const deleteHorarioP = async (index, item) => {
        let next = true;
        if(item.id){
            const response = await Delete({url: `${DELETE_HORARIOP}/${item.id}`, access_token: auth.data.access_token})
            if(!response.data.success){
                next = false;
                toast.error("No se puede ejecutar la acción. Intente más tarde", {autoClose: 8000})
            }
        }
        if(next){
            const copyH = [...horariosPremium]
            copyH.splice(index, 1)
            setHorarioPremium(copyH)
        }        
    }

    const crearVariacion = () => {
        if(variacionesOpt.filter(item=>item.name===variacion.trim()).length === 0){
            setVariacionesOpt(prev=> ([...prev, {name: variacion.trim()}]))
            setVariacion('')
        }        
    }
    const deleteVariacion = async (index, item) => {
        let next = true;
        if(item.id){
            const response = await Delete({url: `${DELETE_VARIACIONES}/${item.id}`, access_token: auth.data.access_token})
            if(!response.data.success){
                next = false;
                toast.error("No se puede ejecutar la acción. Intente más tarde", {autoClose: 8000})
            }
        }
        if(next){
            const copyV = [...variacionesOpt]
            copyV.splice(index, 1)
            setVariacionesOpt(copyV)
        }        
    }

    const onHandleChangeRegla = (valor, typo, index) => {
        const copyRegla = [...reglasOpt]
        switch(typo){
            case 'checkbox':
                copyRegla[index].checked = valor;
                break;
            case 'valor':
                copyRegla[index].valor = valor;
                break;
            default:
                return;
        }
        setReglasOpt(copyRegla);
    }

    const setEndPlusMin = (minutos) => {
        const horaPInitM = moment(horaPremiumStart, "HH:mm");
        const horaPEndM = moment(horaPremiumEnd, "HH:mm");
        if(!horaPremiumStart){
            setHoraPremiumStart('')
            setHoraPremiumEnd('')
        }else if(horaPEndM.diff(horaPInitM, 'minuts') < 30 || isNaN(horaPEndM.diff(horaPInitM, 'minutes'))){
            const newTime = horaPInitM.add(30, 'minutes');
            setHoraPremiumEnd(newTime.format("HH:mm"))
        }
    }
    
    return(
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={shemaValidate}
                onSubmit={(values, { setSubmitting, setFieldValue }) => {
                    //console.log(values)
                    let data = {
                        id: values.id, 
                        tipoAmenidad: {id: values.tipoAmenidad},
                        variacionAmenidad: variacionesOpt,
                        loteList: values.loteList,
                        aforoMaximo: values.aforoMaximo,
                        bookingWindows: [bookingWindowsDesde, bookingWindowsHasta],//desde-hasta prev horas
                        duracion: values.duracion,
                        diasDisponibles: diasDisponibles, //L, M,M,J,V,S,D,
                        horarioGeneral: [horarioGeneralStart, horarioGeneralEnd], //desde, hasta
                        horarioPremium: horariosPremium, //desde, hasta
                        permiteVisita: values.permiteVisita,
                        active: values.active,
                        reglas: reglasOpt,
                        general: todosLotes,
                    }   
                    
                    //console.log(data)
                    if(data.tipoAmenidad.id === null || (data.loteList.length === 0 && !todosLotes) || diasDisponibles.length === 0 || 
                        reglasOpt.filter(item=>item.checked && item.valor === '').length > 0){
                        setSubmitting(false)
                        setErrorForm(true)
                    }else{
                        setErrorForm(false)
                        Post({url: AMENIDAD_CREATE_AGENDA_SAVE, data: data,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(response.data.success){
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                setTimeout(() => {
                                    history.push('/admin/ver-agenda')
                                }, 2000)
                                
                            }else{
                                toast.error(response.data.message,{ autoClose: 8000 })
                            }
                            
                            //console.log(response)
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
                            console.log(error.response)
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
                <Form className="form" onSubmit={handleSubmit}>
                    {isSubmitting && loaderRequest()}
                    {
                        errorForm && <div className="text-danger">El formulario no está correcto verifique los campos obligatorios</div>
                    }
                    <Row>
                        <Col xs={12} lg="5">
                            <Form.Group>
                                <Form.Label>Lote <span className="text-danger">*</span></Form.Label>
                                <Form.Check 
                                    type="checkbox"
                                    checked={todosLotes}
                                    onChange={e=>{
                                        if(e.target.checked){
                                            setLote(null)
                                        }
                                        setTodosLotes(e.target.checked)
                                        setFieldValue('loteList', [])
                                    }}
                                    label="General"
                                />{' '}   
                                {!todosLotes && 
                                <Select 
                                    options={lotesOpt.map(item=>({label: `ref: ${item.referencia}. Propietario: ${item.residente_name}`, value: item.id}))} 
                                    isClearable
                                    value={lote}
                                    onChange={(value)=>{
                                        setLote(value)
                                        setFieldValue('loteList', lotesOpt.filter(item=>item.id===value.value).map(e=>({id: e.id})))
                                    }}
                                    placeholder="Seleccionar opción"
                                />
                                
                                // <Form.Control 
                                //     className={`${errors.loteList && 'error'} form-control`}
                                //     value={lote}
                                //     onChange={e=>{
                                //         setLote(e.target.value)
                                //         setFieldValue('loteList', lotesOpt.filter(item=>item.id==e.target.value).map(e=>({id: e.id})))
                                //     }}
                                //     as="select"
                                //     disabled={todosLotes}
                                // >
                                //     <option value=''>Seleccionar opción</option>
                                //     {
                                //         lotesOpt.map((item)=>(
                                //             <option value={item.id} key={item.id}>{`ref: ${item.referencia}. Propietario: ${item.residente_name}`}</option>
                                //         ))
                                //     }
                                // </Form.Control>
                            }
                                {errors.loteList && <Form.Control.Feedback type="invalid" >{errors.loteList}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col> 
                        <Col xs="12" />
                        <Col xs={12} lg="5">
                            <Form.Group>
                                <Form.Label>Amenidad <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.tipoAmenidad && 'error'} form-control`}
                                    name="tipoAmenidad" 
                                    as="select"
                                >
                                    <option value=''>Seleccionar opción</option>
                                    {
                                        tipoAmenidadesOpt.map((item)=>(
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))
                                    }
                                </Field>
                                {errors.tipoAmenidad && <Form.Control.Feedback type="invalid" >{errors.tipoAmenidad}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="2">
                            <Form.Group className="mb-0">
                                <Form.Label>Variaciones</Form.Label>
                                <InputGroup className="mb-0">
                                    <Form.Control
                                        value={variacion}
                                        onChange={e=>setVariacion(e.target.value)}
                                    />
                                    <Button 
                                        variant="outline-secondary" 
                                        disabled={!variacion}
                                        onClick={crearVariacion}>Crear</Button>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col xs="12" md="12"  className="mb-2 mt-1">
                            {
                                variacionesOpt.map((item, index)=>(
                                    <div className="d-flex align-items-center" key={index}>
                                        <div className="pr-2"><span className="badge badge-secondary p-1">{item.name}</span></div>
                                        <div><FaTrash className="text-danger cursor-pointer" onClick={e=>deleteVariacion(index, item)}/></div>
                                        
                                    </div>                                    
                                ))
                            }
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="5">
                            <Form.Label>Horario General<span className="text-danger">*</span></Form.Label>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Form.Control
                                    placeholder="Desde"
                                    type="time"
                                    value={horarioGeneralStart}
                                    onChange={e=>setHorarioGeneralStart(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Form.Control
                                    placeholder="Hasta"
                                    type="time"
                                    value={horarioGeneralEnd}
                                    onChange={e=>setHorarioGeneralEnd(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="5">
                            <Form.Label>Horario Premium</Form.Label>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="2">
                            <Form.Group className="mb-0">
                                <Form.Control
                                    placeholder="Desde"
                                    type="time"
                                    value={horaPremiumStart}
                                    onChange={e=>setHoraPremiumStart(e.target.value)}
                                    onBlur={e=>setEndPlusMin(30)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="2">
                            <Form.Group  className="mb-0">
                                <Form.Control
                                    placeholder="Hasta"
                                    type="time"
                                    value={horaPremiumEnd}
                                    onChange={e=>setHoraPremiumEnd(e.target.value)}
                                    onBlur={e=>setEndPlusMin(30)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="1">
                            <Form.Group  className="mb-0">
                                <Button 
                                    variant="outline-secondary" 
                                    disabled={!horarioGeneralStart || !horarioGeneralEnd}
                                    onClick={crearHorarioPremium}>Crear</Button>
                            </Form.Group>
                        </Col>
                        <Col xs="12" md="12"  className="mb-2 mt-1">
                            {
                                horariosPremium.map((item, index)=>(
                                    <div className="d-flex align-items-center" key={index}>
                                        <div className="pr-2"><span className="badge badge-secondary p-1">{`${item.horarioInicia} - ${item.horarioTermina}`}</span></div>
                                        <div><FaTrash className="text-danger cursor-pointer" onClick={e=>deleteHorarioP(index, item)}/></div>
                                        
                                    </div>
                                    
                                ))
                            }
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="5">
                            <Form.Group>
                                <Form.Label>Días disponibles<span className="text-danger">*</span></Form.Label>
                                <ul className="list-inline">
                                    <li className={`list-inline-item border mr-0 p-2 cursor-pointer ${diasDisponibles.includes('2') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('2', 'Lunes')}>Lunes</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('3') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('3', 'Martes')}>Martes</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('4') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('4','Miércoles')}>Miércoles</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('5') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('5', 'Jueves')}>Jueves</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('6') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('6', 'Viernes')}>Viernes</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('7') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('7', 'Sábado')}>Sábado</li>
                                    <li className={`list-inline-item border mr-0 border-left-0 p-2 cursor-pointer ${diasDisponibles.includes('1') ? 'bg-secondary text-white' : ''}`} onClick={e=>onHandleClick('1', 'Domingo')}>Domingo</li>
                                </ul>
                            </Form.Group>
                        </Col>
                        <Col xs="12" />
                        <Col xs="12" lg="5">
                            <Form.Label className="mb-0">Duración</Form.Label>
                            <Form.Text className="text-muted">Formato en minutos (en caso de no aplicar dejar en 0)</Form.Text>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Field
                                    name="duracion" 
                                    className="form-control"
                                    type="number"
                                    min="0"
                                    onBlur={e=>{
                                        if(isNaN(e.target.value) || e.target.value < 0){
                                            setFieldValue('duracion', 0)
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="5">
                            <Form.Label className="mb-0">Booking windows</Form.Label>
                            <Form.Text className="text-muted">Formato en horas (en caso de no aplicar dejar en 0)</Form.Text>
                        </Col>
                        <Col xs="12" />
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Form.Control
                                    placeholder="Desde"
                                    type="number"
                                    value={bookingWindowsDesde}
                                    onChange={e=>setBookingWindowsDesde(e.target.value)}
                                    onBlur={e=>{
                                        if(isNaN(e.target.value) || e.target.value < 0){
                                            setBookingWindowsDesde(0)
                                        }
                                        else if(bookingWindowsDesde <= bookingWindowsHasta){
                                            setBookingWindowsHasta(0)
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Form.Control
                                    placeholder="Hasta"
                                    type="number"
                                    value={bookingWindowsHasta}
                                    onChange={e=>setBookingWindowsHasta(e.target.value)}
                                    onBlur={e=>{
                                        if(isNaN(e.target.value) || e.target.value < 0){
                                            setBookingWindowsHasta(0)
                                        }
                                        else if(bookingWindowsDesde <= bookingWindowsHasta){
                                            setBookingWindowsHasta(0)
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="12"/>
                        <Col xs={12} lg="2">
                            <Form.Group>
                                <Form.Label>Aforo máximo <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.aforoMaximo && 'error'} form-control`}
                                    name="aforoMaximo" 
                                    type="number"
                                    min={1}
                                    onBlur={e=>{
                                        if(isNaN(e.target.value) || e.target.value < 1){
                                            setFieldValue('aforoMaximo', 1)
                                        }
                                    }}
                                />
                                {errors.aforoMaximo && <Form.Control.Feedback type="invalid" >{errors.aforoMaximo}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs="12"/>
                        <Col xs={12} lg="5">
                            <div className="pr-4 form-check form-check-inline">
                                <Field 
                                    className={`form-check-input`}
                                    name="permiteVisita" 
                                    type="checkbox"
                                />
                                <label className="form-check-label">Permite visita</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <Field 
                                    className={`form-check-input`}
                                    name="active" 
                                    type="checkbox"
                                />
                                <label className="form-check-label">Activa</label>
                            </div>
                        </Col>
                        <Col xs="12"/>
                        <Col xs="12" md="12">
                            <div className="border shadow my-2 p-2">
                                <h6>Reglas</h6>
                                <Dropdown.Divider />
                                {
                                    reglasOpt.map((item, index)=>(
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <div className="pr-2">
                                               <input 
                                                    type="checkbox" 
                                                    checked={item.checked}
                                                    onChange={e=>onHandleChangeRegla(e.target.checked, 'checkbox', index)}
                                                /> 
                                            </div>
                                            <div className="pr-2">{item.title}</div>
                                            <div>
                                                <input
                                                    className="form-control w-50"
                                                    value={item.valor}
                                                    type="number"
                                                    onChange={e=>onHandleChangeRegla(e.target.value, 'valor', index)}
                                                />
                                            </div>
                                        </div>
                                    ))
                                }    
                            </div>
                        </Col>
                    </Row>                                               
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                        </Col>
                    </Row>
                </Form>
            )}            
            </Formik>
        </>
    )

}