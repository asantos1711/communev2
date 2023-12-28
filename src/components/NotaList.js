import React,{ useState } from 'react';
import { Col,Button,Row,Form } from 'react-bootstrap';
import TableData from './TableData';
import moment from 'moment';
import { FiEdit } from 'react-icons/fi';
import { setStatusNota } from '../utils/setStatusNota';
import { loaderRequest } from '../loaders/LoaderRequest';
import Post from '../service/Post';
import { NOTAALERTA_CHANGE_ACTIVA } from '../service/Routes';
import { toast } from 'react-toastify';

export default function NotaList({items, editItem,auth}){
    const [isSubmiting, setSubmiting] = useState(false)
    const formatDate = (cell) => {
        return moment(cell).format("DD-MM-YYYY")
    }

    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }

    const activeFormatter = (cell, row) => {
        return <Form.Check 
            type="switch"
            id={`custom-switch_${row.id}`}
            label="Activa"
            defaultChecked={cell}
            value={cell}
            onChange={e => onChangeActive(e.target.checked, row)}
        />
    }

    const onChangeActive = (checked, row) =>{
        console.log(checked)
        console.log(row)
        setSubmiting(true)
        let d = row
        d['activa'] = checked
        console.log(d)
        Post({url: NOTAALERTA_CHANGE_ACTIVA,data: d, access_token: auth.data.access_token, header:true})
        .then(response=>{
            setSubmiting(false)
            toast.success("Acción exitosa", {autoClose: 3000})
        })
        .catch(error=>{
            setSubmiting(false)
            toast.error('Ocurrió un error. Contacte al administrador', {autoClose: 6000})
        })
        
    }

    const statusFomater = (cell, row) => {
        return setStatusNota(row.fechaRecordatorio, row.activa)
    }



    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'fechaRecordatorio',
            text: 'Fecha creada',
            headerStyle: { width: '15%' },
            formatter: formatDate,
        },
        // {
        //     dataField: 'activa',
        //     text: 'Activa',
        //     headerStyle: { width: '10%' },
        //     formatter: activeFormatter,
        // },
        {
            dataField: 'descripcion',
            text: 'Descripcion',
        },
        // {
        //     dataField: 'dummy2',
        //     isDummyField: true,
        //     text: 'Estatus',
        //     headerAlign: 'center',
        //     align: 'center',
        //     headerStyle: { width: '12%' },
        //     formatter: statusFomater,            
        // },
        // {
        //     dataField: '',
        //     isDummyField: true,
        //     text: '',
        //     headerAlign: 'center',
        //     align: 'center',
        //     headerStyle: { width: '5%' },
        //     formatter: actions,            
        // }
    ];


    return(
        <Row>
            {isSubmiting && loaderRequest()}
            <Col>
                <TableData columns={columns} products={items} />
            </Col>
        </Row>
    )

}