import React, { useContext, useState, useEffect } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Dropdown, Row, Col, Table, Form, Button } from 'react-bootstrap';
import Get from '../service/Get';
import { LOTE_TIPO_TARJETA_GET } from '../service/Routes';
import { loaderRequest } from '../loaders/LoaderRequest';
import {formatTipoTarjeta} from '../utils/formatTipoTarjeta';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaTimes } from 'react-icons/fa';
import { formatNumber } from '../utils/formatNumber';
import moment from 'moment';
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import * as ExcelJS from "exceljs";
import { getCreator } from '../utils/getCreator';
registerLocale("es", es);

export default function CargosRecurrentesIndex(){
    let {path} = useRouteMatch();
    const { auth } = useContext(authContext)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [tipoTarjeta, setTipoTarjeta] = useState('')
    const [fechaPagoReal, setfechaPagoReal] = useState(new Date())
    //const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const [info, setInfo] = useState(null)

    useEffect(()=>{       
        if(tipoTarjeta!==''){
            setIsLoading(true)
            Get({url: `${LOTE_TIPO_TARJETA_GET}/${tipoTarjeta}/${moment(fechaPagoReal).format("YYYY-MM-DD")}`, access_token: auth.data.access_token})
            .then(response=>{
                console.log(response)
                setItems(response.data.loteTipoTarjetaDTOS)
                setInfo(response.data.configuracionResidencial)
                setIsLoading(false)
            })        
            .catch(error=>{
                // console.log(error)
                toast.error("Lo sentimos en estos momentos no podemos procesar la solicitud. Intente más tarde o contacte con el administrador", {autoClose: 10000})
                setIsLoading(false)
            })
        }        
    }, [tipoTarjeta])

    const getCadena = monto =>{
        var str = `${monto}00`;
        var ceros = '';
        var i = str.length 
        while (i < 12) {
            ceros += '0';
            i++;
        }
        str = `${ceros}${str}`
        return str;
    }
    const getCount = longitud =>{
        var str = longitud.toString();
        var ceros = '';
        var i = str.length; 
        while (i < 6) {
            ceros += '0';
            i++;            
        }
        str = `${ceros}${str}`
        return str;
    }

    const getCountTotal = items =>{
        var total = items.reduce(function (accumulator, item) {
            return accumulator + item.montoMtto;
          }, 0);
          
          var ceros = '';
          var str = `${total.toString()}00` 
          var i = str.length
          while (i < 15) {
            ceros += '0';          
            i++
        }
        str = `${ceros}${str}`
        return str
    }

    const exportToCSV = (csvData, fileName) => {
        //creacion de variables segun la privada
        const creator = getCreator()



        //nuevo
        var workbook = new ExcelJS.Workbook()
        workbook.creator = creator;
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        let sheet1 = workbook.addWorksheet("Datos");
        sheet1.views = [
            {state: 'frozen', xSplit: 0, ySplit: 1}
        ];
        //data

        //console.log(csvData)
        let arrDatos = csvData.map((item,i)=>[i+1,
            item.referencia.toUpperCase(), item.direccion.toUpperCase(), item.asociado.toUpperCase(), item.tarjetaHabiente ? item.tarjetaHabiente.toUpperCase(): '',
            item.noTarjeta, item.banco.toUpperCase(), item.montoMtto,item.tipoTarjeta.toUpperCase()
        ])
        //console.log(arrDatos)

        sheet1.addTable({
            name: 'DataTable',
            ref: 'A1',
            headerRow: true,
            totalsRow: true,
            style: {
                theme: 'TableStyleLight1'
            },
            columns: [
                {name: 'NO'},
                {name: 'REFERENCIA'},
                {name: 'DIRECCION'},
                {name: 'ASOCIADO'},
                {name: 'TARJETAHABIENTE'},
                {name: 'NUM DE TARJETA'},
                {name: 'BANCO'},
                {name: 'MANTTO',totalsRowFunction: 'sum'},
                {name: 'TIPO TARJETA'},
              ],
            rows: arrDatos,
        })       
        
        let firstRow = sheet1.getRow(1);
        firstRow.font = { name: 'New Times Roman', family: 4, size: 11, bold: false, color: {argb:'00000'} };
        firstRow.alignment = { vertical: 'middle', horizontal: 'center'};
        firstRow.height = 20;
        sheet1.getColumn(1).width = 8
        sheet1.getColumn(2).width = 15
        sheet1.getColumn(3).width = 25
        sheet1.getColumn(4).width = 35
        sheet1.getColumn(5).width = 35
        sheet1.getColumn(6).width = 25
        sheet1.getColumn(7).width = 15
        let col7 = sheet1.getColumn(8)
        col7.width = 15
        col7.numFmt = '"$"#,###.00'
        sheet1.getColumn(9).width = 15

        //sheet del mes
        let arrMes = csvData.map(item=>[
            'D5', item.noTarjeta.replace(/-/g, ""), getCadena(item.montoMtto), '484', `${info.nombreCortoCR}${item.referencia.replace(/-/g, "")}${info.codigoResidencialCR}`, '000', '         .'
        ])
        let sheet2 = workbook.addWorksheet("Mes");
        sheet2.views = [
            {state: 'frozen', xSplit: 0, ySplit: 1}
        ];
        arrMes.push(['T', getCount(items.length), getCountTotal(items), '000000', '000000000000000', '000000', '00000000000000.'])
        sheet2.addTable({
            name: 'MesTable',
            ref: 'A1',
            headerRow: true,
            style: {
                theme: 'TableStyleLight1'
            },
            columns: [
                {name: 'H'},
                {name: 'WEBFT2.00'},
                {name: 'ENT'},
                {name: info.codigoResidencialEntidadCR},
                {name: info.codigoResidencialNombreCR},
                {name: 'BANCOMER'},
                {name: moment().format('MMDDYYYY')}
              ],
            rows: arrMes,
        })

        let firstRow2 = sheet2.getRow(1);
        firstRow2.font = { name: 'New Times Roman', family: 4, size: 11, bold: false, color: {argb:'00000'} };
        firstRow2.alignment = { vertical: 'middle', horizontal: 'center'};
        firstRow2.height = 20;

        sheet2.getColumn(1).width = 10
        sheet2.getColumn(2).width = 20
        sheet2.getColumn(3).width = 25
        sheet2.getColumn(4).width = 15
        sheet2.getColumn(5).width = 25
        sheet2.getColumn(6).width = 15
        sheet2.getColumn(7).width = 15

        //sheet webtransfer
        let arrWebT = []
        arrWebT.push([`${info.codigoWebTransferResidencialCR}${moment().format('MMDDYYYY')}                  .`])
        let arrWebT2 = csvData.map(item=>[
            `D5${item.noTarjeta.replace(/-/g, "")}${getCadena(item.montoMtto)}484${info.nombreCortoCR}${item.referencia.replace(/-/g, "")}${info.codigoWebTransferCortoResidencialCR}         .`
        ])
        let arrWebt3 = arrWebT.concat(arrWebT2)
        let sheet3 = workbook.addWorksheet("WEB TRANSFER");
        sheet3.views = [
            {state: 'frozen', xSplit: 0, ySplit: 1}
        ];
        arrWebt3.push([`T${getCount(items.length)}${getCountTotal(items)}000000000000000000000000000000000000000000.`])

        //console.log(arrWebt3)

        sheet3.addTable({
            name: 'WebTable',
            ref: 'A1',
            headerRow: false,
            style: {
                theme: 'TableStyleLight1'
            },
            columns: [
                {name: 'REFERENCIA'},
              ],
            rows: arrWebt3,
        })

        sheet3.getColumn(1).width = 70

        //importacion de pagos
        let sheet4 = workbook.addWorksheet("IMPORTACION DE PAGOS");
        let arrDatosImportacion = csvData.map((item,i)=>[
            i+1,
            item.referencia.toUpperCase(), 
            item.montoMtto,
            moment(fechaPagoReal).format("MM/DD/YYYY"), 
            ""
        ])
        sheet4.addTable({
            name: 'DataTable',
            ref: 'A1',
            headerRow: true,
            style: {
                theme: 'TableStyleLight1'
            },
            columns: [
                {name: 'NO'},
                {name: 'REFERENCIA'},
                {name: 'MANTTO',totalsRowFunction: 'sum'},
                {name: 'FECHA PAGO'},
                {name: 'OBSERVACION'},
              ],
            rows: arrDatosImportacion,
        })       
        let fourRow = sheet4.getRow(1);
        fourRow.font = { name: 'New Times Roman', family: 4, size: 11, bold: false, color: {argb:'00000'} };
        fourRow.alignment = { vertical: 'middle', horizontal: 'center'};
        fourRow.height = 20;
        sheet4.getColumn(1).width = 8
        sheet4.getColumn(2).width = 15
        let colF3 = sheet4.getColumn(3)
        colF3.width = 15
        colF3.numFmt = '#,###.00'
        sheet4.getColumn(4).width = 15
        sheet4.getColumn(5).width = 25
         

        // save under export.xlsx
        workbook.xlsx.writeBuffer()
        .then(response=>{
            var blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                saveAs(blob, fileName+fileExtension);
        })
        .catch(error=>{
            console.log(error)
        })
        

        //console.log("File is written");

        
    }

    const deleteItem = ident =>{
        var arr = [...items]
        arr = arr.filter((item,i)=>i!==ident)
        setItems(arr)
    }

    return(
        <div>
            {isLoading && loaderRequest()}
            <ToastContainer />
            <Switch>            
                <Route path={path} exact>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`Cargos recurrentes`}</Card.Title>
                            <Dropdown.Divider />
                            <Row>
                                <Col xs="5" lg="5">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm={4}>Tipo de tarjeta</Form.Label>
                                        <Col sm={8}>
                                            <Form.Control 
                                                as="select"
                                                value={tipoTarjeta}
                                                onChange={e=>setTipoTarjeta(e.target.value)}
                                            >
                                                <option value="">Seleccionar opción</option>
                                                <option value="visa_mastercard">Visa/Mastercard</option>
                                                <option value="american_express">American Express</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col xs="5" lg="3">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm={4}>Fecha pago</Form.Label>
                                        <Col sm={8}>
                                        <DatePicker className="form-control"
                                                showPopperArrow={false}
                                                selected={fechaPagoReal}
                                                autoComplete="off"
                                                dateFormat="dd-MM-yyyy"
                                                onChange={date => {
                                                    if(date===null){
                                                        setfechaPagoReal(new Date())
                                                    }else{
                                                        setfechaPagoReal(date)
                                                    }                                                    
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col xs="2" lg="2">
                                    <Button variant="outline-primary" onClick={e=>exportToCSV(items, moment().format('DD-MM-YYYY'))}>Generar XLSX</Button>
                                </Col>
                            </Row>  
                            <Row>
                                <Col className={`${items.length > 15 && 'h-600'}`}>
                                    <Table bordered striped hover className="tb-cargos-recurrentes">
                                        <thead>
                                            <tr>
                                                <th style={{width: '2%'}}>No</th>
                                                <th style={{width: '6%'}}>Referencia</th>
                                                <th style={{width: '18%'}}>Dirección</th>
                                                <th style={{width: '12%'}}>Asociado</th>
                                                <th style={{width: '12%'}}>Tarjeta habiente</th>
                                                <th style={{width: '11%', textAlign: 'center'}}>Tarjeta</th>
                                                <th style={{width: '4%', textAlign: 'center'}}>Vence</th>
                                                <th style={{width: '3%', textAlign: 'center'}}>CVV</th>
                                                <th style={{width: '9%'}}>Banco</th>
                                                <th style={{width: '7%'}}>Período</th>
                                                <th style={{width: '8%'}}>MANTTO</th>                                                
                                                <th style={{width: '5%'}}>Tipo</th>
                                                <th style={{width: '3%'}}></th>
                                            </tr>
                                        </thead>
                                        {
                                            items.length === 0 
                                            ? <tbody><tr><td colSpan="13" className="text-center">No existe información a mostrar</td></tr></tbody>
                                            : <tbody>
                                                {
                                                    items.map((item,i)=>(
                                                        <tr key={i}>
                                                            <td>{i+1}</td>
                                                            <td>{item.referencia}</td>
                                                            <td>{item.direccion}</td>
                                                            <td>{item.asociado}</td>   
                                                            <td>{item.tarjetaHabiente}</td>                                                            
                                                            <td style={{textAlign: 'center'}}>{item.noTarjeta}</td>
                                                            <td style={{textAlign: 'center'}}>{item.fechaVencimiento}</td>
                                                            <td style={{textAlign: 'center'}}>{item.cvv}</td>
                                                            <td>{item.banco}</td>
                                                            <td>{item.periodo}</td>
                                                            <td>{formatNumber(item.montoMtto)}</td>
                                                            <td>{item.tipoTarjeta}</td>
                                                            <td style={{textAlign: 'center'}}><FaTimes onClick={e=>deleteItem(i)} /></td>
                                                        </tr>
                                                    ))
                                                }
                                              </tbody>
                                        }
                                        
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>                 
                </Route>  
            </Switch>
        </div>
    )
}