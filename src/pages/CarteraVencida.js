import { Card, Dropdown, Row, Col, Table, Form, Button } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react'
import Get from '../service/Get';
import { authContext } from '../context/AuthContext';
import { REPORTE_CARTERA_VENCIDA } from '../service/Routes';
import TableSkeleton from '../loaders/TableSkeleton';
import { loaderRequest } from '../loaders/LoaderRequest';
import * as XLSX from "xlsx";
import CardSkeleton from "../loaders/CardSkeleton";
import { saveAs } from 'file-saver';
import { getCreator } from '../utils/getCreator';
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { FiltroCV } from '../utils/FiltroCV';
import { FiltroCVExtrasSanc } from '../utils/FiltroCVExtrasSanc';
import moment from 'moment';

export default function CarteraVencida(){
    let {path} = useRouteMatch();
    const [items, setItems] = useState([]);
    const {auth} = useContext(authContext);
    const [isLoading, setLoading] = useState(true);
    const fileExtension = '.xlsx';

    const [tiposExtraG, setTiposExtraG] = useState([]);
    const [tiposSancG, setTiposSancG] = useState([]);
    const tiposExtra = [];
    const tiposSanc = [];
    const tiposInit = [];
    var props = "";

    useEffect(()=> {
        setLoading(true)
        Get({url: `${REPORTE_CARTERA_VENCIDA}`, access_token: auth.data.access_token})
        .then(response=>{
            // console.log(response.data);

            // recopilando los tipos de extraordinaria del residencial actual
            for(let val in response.data) {
                for(let val1 in response.data[val]) {
                    if(tiposExtra.length === 0) {
                        if(response.data[val][val1].tipoExtraordinaria != null) {
                            tiposExtra.push(response.data[val][val1].tipoExtraordinaria);
                        }
                    } else {
                        var aux = tiposExtra.indexOf(response.data[val][val1].tipoExtraordinaria);
                        if(aux === -1 && response.data[val][val1].tipoExtraordinaria != null) {
                            tiposExtra.push(response.data[val][val1].tipoExtraordinaria);
                        }
                    }
                }
            }
            tiposExtra.sort();
            setTiposExtraG(tiposExtra);

            // recopilando los tipos de sanciones del residencial actual
            for(let val in response.data) {
                for(let val1 in response.data[val]) {
                    if(tiposSanc.length === 0) {
                        if(response.data[val][val1].tipoSanc != null) {
                            tiposSanc.push(response.data[val][val1].tipoSanc);
                        }
                    } else {
                        var aux1 = tiposSanc.indexOf(response.data[val][val1].tipoSanc);
                        if(aux1 === -1 && response.data[val][val1].tipoSanc != null) {
                            tiposSanc.push(response.data[val][val1].tipoSanc);
                        }
                    }
                }
            }
            tiposSanc.sort();
            setTiposSancG(tiposSanc);

            for(let val in response.data) {
                for(let val1 in response.data[val]) {
                    if(tiposInit.length === 0) {
                        if(response.data[val][val1].tipoInit != null) {
                            tiposInit.push(response.data[val][val1].tipoInit);
                        }
                    } else {
                        var aux1 = tiposInit.indexOf(response.data[val][val1].tipoInit);
                        if(aux1 === -1 && response.data[val][val1].tipoInit != null) {
                            tiposInit.push(response.data[val][val1].tipoInit);
                        }
                    }
                }
            }
            tiposInit.sort();
            
            if(response.data !== null) {
                let d = [];
                Object.keys(response.data).forEach(item=> {
                    let temp = {
                        Residentes: (response.data[item][0].asociado),
                        Referencia: (response.data[item][0].referencia),
                        Manzana: (response.data[item][0].manzana),
                        Lote: (response.data[item][0].lote),
                        Categoria_de_construccion: (response.data[item][0].cat_construccion),
                    }

                    // determinar el numero y tipos de cuotas extraordinarias, deberiamos usar un arreglo de elementos, que se devuelvan como elementos individuales
                    // [lista de extraordinarias]
                    let ExtraO = 0; let valueEO = 0;
                    for(let i = 0; i < tiposExtra.length; i++) {
                        ExtraO = tiposExtra[i];
                        valueEO = FiltroCVExtrasSanc(response.data[item], "Extra", tiposExtra, ExtraO);
                        temp[ExtraO] = valueEO;
                    }
                    
                    // mantenimiento indicaremos de la misma forma que lo hace mantenmiento vencido conciliado
                    temp["Treinta_dias"] = FiltroCV(response.data[item], "30");
                    temp["Sesenta_dias"] = FiltroCV(response.data[item], "60");
                    temp["Noventa_o_mas_dias"] = FiltroCV(response.data[item], "90");
                    temp["TotalMtto"] = FiltroCV(response.data[item], "100");

                    // determinar el numero y tipos de sanciones
                    // [lista de sanciones]
                    let Sanc = 0; let valueSA = 0;
                    for(let i = 0; i < tiposSanc.length; i++) {
                        Sanc = tiposSanc[i];
                        valueSA = FiltroCVExtrasSanc(response.data[item], "Sanc", tiposSanc, Sanc);
                        temp[Sanc] = valueSA;
                    }

                    let Init = 0; let valueIN = 0;
                    for(let i = 0; i < tiposInit.length; i++) {
                        Init = tiposInit[i];
                        valueIN = FiltroCVExtrasSanc(response.data[item], "Inicial", tiposInit, Init)
                        temp[Init] = valueIN;
                    }
                    
                    
                    d.push(temp);
                    
                })
                setItems(d);
                props = d;
            }
            
            
            setLoading(false)
            downloadXlsx(props);
        })
        .catch(error=>{
            setLoading(false)
            console.log(error);
        })
    },[])

    const downloadXlsx = async (props) =>{
        // console.log("Estas en downloadXlsx");
        
        const creator = getCreator();
        
        var wb = XLSX.utils.book_new();

        wb.Props = {
            Title: "CV",
            Subject: "cv",
            Author: creator,
            CreatedDate: new Date(),
        };

        var ws = XLSX.utils.json_to_sheet(props);
        wb.SheetNames.push("Cartera Vencida");
        wb.Sheets["Cartera Vencida"] = ws;


        // esta parte crea el archivo bajo los parametros y atributos que definimos arriba
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary', ignoreEC: true});

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;
        }
        let fecha = moment().format("DD-MM-YYYY_h_mm_ss");

        let filename = "Cartera_Vencida"+creator+" "+fecha+".xlsx";
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename);
    }

    return (
        <div>
        {isLoading && loaderRequest()}
            {
                isLoading ? <Card className='shadow'><Card.Body><TableSkeleton/></Card.Body></Card> :
                <div>
                    <p>Archivo descargado, por favor revise su carpeta de descargas</p>
                    <p>Si el archivo no se descargó 
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => window.location.reload(false)}>Pulsa aqui</button> 
                    </p>
                </div>
            }
        </div>
    )

}
