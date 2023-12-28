import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Jumbotron, Row, Table } from 'react-bootstrap';
import { authContext } from '../context/AuthContext';
import CardSkeleton from '../loaders/CardSkeleton';
import Get from '../service/Get';
import { REPORTE_MTTO_VENCIDO_CONCILIACION } from '../service/Routes';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { FaDownload } from 'react-icons/fa';
import { formatNumber } from '../utils/formatNumber';
import { calcConciliado } from '../utils/calcConciliado';
import moment from 'moment'


export default function MantenimientoVencidoConciliacion(){
    const {auth} = useContext(authContext)
    const [items, setItems] = useState([])
    const [conciliados, setConciliados] = useState([])
    const [detalle, setDetalle] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewDetalle, setViewDetalle] = useState(false)

    useEffect(()=>{
        Get({url: REPORTE_MTTO_VENCIDO_CONCILIACION, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setDetalle(response.data)
            if(response.data != null){
                let d = []
                Object.keys(response.data).forEach(item=>{
                    //console.log(response.data[item])
                    let temp = {
                        asociado: item, 
                        treinta: calcConciliado(response.data[item], "30"),
                        sesenta: calcConciliado(response.data[item], "60"),
                        noventa: calcConciliado(response.data[item], "90"),
                        total: calcConciliado(response.data[item], "100")
                    }
                    d.push(temp)
                })
                d.sort(({total:a}, {total:b}) => b-a)  
                setConciliados(d)             
                setItems(d)
                //console.log(d)
            }

            



            setLoading(false)
        })
        .catch(error=>{
            console.log(error)
        })
    },[])

    const downloadPDF = e =>{
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text('Conciliación mantenimiento vencido', 40, 30)      
        doc.setFontSize(10);        
        doc.text(`Fecha de impresión ${moment().format('DD-MM-YYYY')}`, 40, 42)
        doc.autoTable({
            html:'#tableCC',
            theme: 'striped',
            startY: 55,
            headStyles: {  
                0: {       
                    halign: 'left'               
                },  
                1: {  
                    halign: 'right'
                },  
                2: {  
                    halign: 'right'
                }  ,
                3: {  
                    halign: 'right'
                },
                4: {  
                    halign: 'right'
                }
            }, 
        }); 
        doc.autoTable({
            html:'#tableCC2',
            theme: 'plain',
            startY: doc.autoTable.previous.finalY + 5,
            columnStyles: {  
                0: {  
                    cellWidth: 250,  
                    halign: 'right'
                },  
                1: {  
                    textColor: [220,53,69],
                },  
                2: {    
                    textColor: [220,53,69],
                }  ,
                3: {    
                    textColor: [220,53,69],
                },
                4: {    
                    textColor: [220,53,69],
                },
                5: {    
                    textColor: [220,53,69],
                }
            },  
        });       
        doc.save(`conciliacion_mantenimiento_vencido.pdf`)
    }

    const onHandleChecked = checked =>{
        setViewDetalle(checked)        
        if(checked){
            //console.log(detalle)
            let arr = [];
            Object.keys(detalle).forEach(item=>{
                detalle[item].map((item)=>{
                    arr.push(item)
                })
            })
            
            const result = [...arr.reduce((r, o) => {
                const key = o.asociado + '-' + o.referencia;
                
                const item = r.get(key) || Object.assign({}, o, {
                  treinta: 0,
                  sesenta: 0,
                  noventa: 0,
                  total: 0
                });
                
                item.treinta += o.treinta;
                item.sesenta += o.sesenta;
                item.noventa += o.noventa;
                item.total += o.noventa+o.sesenta+o.treinta;
              
                return r.set(key, item);
              }, new Map).values()];

              //console.log(result)
              result.sort(({total:a}, {total:b}) => b-a)
              setItems(result)
            //console.log(arr)



        }else{
            setItems(conciliados)
        }
    }

    return(
        <div>
            {
                loading ? <CardSkeleton height={400}/> :
                <Row>
                    <Col>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6>Conciliación cartera mantenimiento vencido</h6>  
                                    <Form.Check
                                        type="checkbox"
                                        label="Detalle"
                                        checked={viewDetalle}
                                        onChange={e=>onHandleChecked(e.target.checked)}
                                    />                         
                                </div>                                
                                <Dropdown.Divider />
                                {
                                    items.length===0 ? <Row><Col><Jumbotron fluid className="text-center"><Container>No existen datos que mostrar</Container></Jumbotron></Col></Row>
                                :
                                <Row>
                                <Col xs="12" lg="12">
                                        <div className="d-flex flex-row-reverse bd-highlight"> 
                                            <div className="p-2 bd-highlight"><Button variant="outline-secondary" size="sm" onClick={()=>downloadPDF()}><FaDownload /></Button></div>                                        
                                        </div>
                                </Col>
                                    <Col className="h-600 mb-2" xs="12" lg="12">
                                        <Table size="sm" hover responsive id="tableCC">
                                            <thead>
                                                <tr>
                                                    <th width={viewDetalle ? '50%':'60%'}>Asociado</th>
                                                    {
                                                        viewDetalle && <th width='10%'>Referencia</th>
                                                    }                                                    
                                                    <th width='10%' className="text-right">30</th>
                                                    <th width='10%' className="text-right">60</th>
                                                    <th width='10%' className="text-right">90</th>
                                                    <th width='10%' className="text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items.map((item, i)=>(
                                                        <tr key={i}>
                                                            <td>{item.asociado}</td>
                                                            {
                                                                viewDetalle && <td>{item.referencia}</td>
                                                            }                                                            
                                                            <td className="text-right">{formatNumber(item.treinta)}</td>
                                                            <td className="text-right">{formatNumber(item.sesenta)}</td>
                                                            <td className="text-right">{formatNumber(item.noventa)}</td>
                                                            <td className="text-right">{formatNumber(item.total)}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col xs="12" lg="12">
                                        <Table id="tableCC2">
                                            <tbody>
                                                <tr>
                                                    <td width={viewDetalle? '50%' : '60%'} colSpan={viewDetalle ? '2' : '1'} className="font-weight-bold text-right">Total</td>
                                                    <td width="10%" className="text-right text-danger font-weight-bold">{formatNumber(calcConciliado(items, '30'))}</td>
                                                    <td width="10%" className="text-right text-danger font-weight-bold">{formatNumber(calcConciliado(items, '60'))}</td>
                                                    <td width="10%" className="text-right text-danger font-weight-bold">{formatNumber(calcConciliado(items, '90'))}</td>
                                                    <td width="10%" className="text-right text-danger font-weight-bold">{formatNumber(calcConciliado(items, '100'))}</td>
                                                </tr>                                            
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            }            
        </div>
    );


}