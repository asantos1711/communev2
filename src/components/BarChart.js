import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment'

export default function BarChart({items,dateAnio,setDateAnio}){
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: `Lotes que han pagado para el año (${moment(dateAnio).format('YYYY')})`,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: items.map(item=>item.cantidad)
          }
        ]
    }

    return (
    <Card className="shadow">
        <Card.Body>
          <Form.Group as={Row} className="mb-0">
              <Form.Label column sm={{ span: 2, offset: 6 }}  className="text-right">Año</Form.Label>
              <Col sm="4">
                <DatePicker className="form-control form-control-sm"
                  selected={dateAnio}
                  onChange={date => setDateAnio(date)}
                  showYearPicker
                  dateFormat="yyyy"
                />
              </Col>                  
          </Form.Group>
          <Bar data={data} />
        </Card.Body>
    </Card>
    )
}