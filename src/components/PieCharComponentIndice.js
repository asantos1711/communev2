import React, { useEffect, useState } from 'react'
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from "date-fns/locale/es"
import moment from 'moment'
import 'moment/locale/es';
import { DASHBOARD_INDICE_CARTERA_PAGADA } from '../service/Routes';
import Get from '../service/Get';
import CardSkeleton from '../loaders/CardSkeleton';
import { getColors } from '../utils/getColors';
import { getColorOnly } from '../utils/getColorOnly';

registerLocale("es", es)

export default function PieCharComponentIndice({access_token}){
    const [date, setDate] = useState(new Date())
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [colors, setColors] = useState([])

    useEffect(()=>{
        let mounted = true;
        setLoading(true)
        Get({url: `${DASHBOARD_INDICE_CARTERA_PAGADA}/${moment(date).format("M")}/${moment(date).format('YYYY')}`, access_token: access_token})
        .then(response=>{
            //console.log(response)
            if(mounted) {
                setData(response.data.data)
                setColors(getColors(response.data.data))
                setTimeout(()=>{
                    setLoading(false)
                }, 2000)
            }
        })
        .catch(error=>{
            //console.log(error)
        })

        return () => mounted = false;
    },[date])

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index,
      }) => {
         const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x+10} y={y} fill="white" textAnchor={'end'} dominantBaseline="middle">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

    return (
        loading ? <CardSkeleton height={390}/> :
        <Card className="shadow-sm">
            <Card.Body>
                <div className="d-flex">
                    <Card.Title className="flex-grow-1">Indice cartera pagada</Card.Title>
                    <DatePicker className="form-control form-control-sm"
                        selected={date}
                        onChange={date => setDate(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        locale="es"
                    />
                </div>                
                <Dropdown.Divider />
                <Row className="mt-3">
                    <Col xs="12" md="12">
                        <ul className="list-inline">
                            {
                                data.map((item,index)=>(
                                    <li key={index} className="list-inline-item">
                                        <span className="badge badge-pill badge-primary" style={{background: getColorOnly(item.name)}}>{item.name} ({item.value})</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </Col>
                    <Col xs="12" md="12">                    
                        <PieChart width={600} height={255}>
                            <Pie
                                data={data}
                                startAngle={180} endAngle={0}
                                innerRadius={60}
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {
                                data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
                                }
                            </Pie>          
                        </PieChart>
                    </Col>
            </Row>
            </Card.Body>            
        </Card>
    );
}

