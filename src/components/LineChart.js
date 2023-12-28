import React from 'react'
import { Card, Form, Row, Col } from 'react-bootstrap'
import { Line } from 'react-chartjs-2'
import DatePicker, { registerLocale } from 'react-datepicker';
import es from "date-fns/locale/es"
import moment from 'moment'
import {CapFirst} from '../utils/CapFirst'
import 'moment/locale/es';

registerLocale("es", es)

export default function LineChart({items,dateLine,setDateLine}){

    const month = date =>{
        moment().locale("es")
        return CapFirst(moment(date).format("MMMM"))
    }


    const data = {
        labels: items.map(item=>item.day),
        datasets: [
          {
            label: `Lotes que han pagado para la fecha (${month(dateLine)} - ${moment(dateLine).format("YYYY")})`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: items.map(item=>item.cantidad)
          }
        ]
    }

    return (
        <Card className="shadow">
            <Card.Body>
            <Form.Group as={Row} className="mb-0">
                <Form.Label column sm={{ span: 2, offset: 6 }}  className="text-right">Mes</Form.Label>
                <Col sm="4">
                    <DatePicker className="form-control form-control-sm"
                        selected={dateLine}
                        onChange={date => setDateLine(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        locale="es"
                    />
                </Col>                  
            </Form.Group>
                <Line  data={data} />
            </Card.Body>
        </Card>
    )
}