import React from 'react'
import { Row, Col, Table, Alert } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { calcTotal } from '../utils/calcTotal'
import { applyDiscount } from '../utils/applyDiscount'
import { getDiscountSpecial } from '../utils/getDiscountSpecial'
import { formatNumber } from '../utils/formatNumber'
import { sumPagos } from '../utils/sumPagos'
import { getInteresMoratorio } from '../utils/getInteresMoratorio'

export default function ReglasDescuentoMtto(props){
    //console.log(props)
    return(
        <Row>
            <Col>
                <div><span>Descuentos</span></div>
                    <Table size="sm" responsive>
                        {
                            (props.descuentos.length === 0 && props.discount===null && props.cobros.length===0)
                            ? <tbody>
                                <tr>
                                    <td colSpan="3"><Alert variant="info">No existen descuentos</Alert></td>
                                </tr>
                                </tbody>
                            : <tbody>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td width="15%" className="text-right">
                                        <NumberFormat 
                                            value={props.total} 
                                            prefix="$" 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            displayType="text" 
                                            thousandSeparator={true}
                                        />
                                    </td>
                                </tr>
                                {
                                    props.discount!==null ?
                                    <tr>
                                        <td colSpan="2">Descuento especial del lote</td>
                                        <td width="15%" className="text-right">
                                            <h6>- {formatNumber(getDiscountSpecial(props.total, props.discount))}</h6>
                                        </td>
                                    </tr>
                                    : props.descuentos.length > 0 &&
                                      props.descuentos.map((item, i)=>(
                                        <tr key={i}>
                                            <td width="30%" className={`${!applyDiscount(item.day_before,props.total, props.fechaCorte) && "line-through"}`}>{item.name}</td>
                                            <td width="55%" className={`${!applyDiscount(item.day_before,props.total, props.fechaCorte) && "line-through"}`}>{item.description}</td>
                                            <td width="15%" className={`${!applyDiscount(item.day_before,props.total, props.fechaCorte) && "line-through"} text-right`}>
                                                <h6>
                                                <NumberFormat 
                                                    value={item.discount}
                                                    displayType="text"
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    thousandSeparator={true}
                                                    prefix="- $"
                                                />
                                                </h6>
                                            </td>
                                        </tr>
                                    ))
                                }                                
                                {
                                    props.cobros.length > 0 &&
                                    <tr>
                                        <td colSpan="2">Pagado hasta el momento</td>
                                        <td width="15%" className="text-right">
                                            <h6>- {formatNumber(sumPagos(props.cobros))}</h6>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        }
                        
                        <tfoot>
                            <tr>
                                <td colSpan="2" className="font-weight-bold text-success">Total mantenimiento</td>
                                <td className="font-weight-bold text-right text-success">
                                    {formatNumber(calcTotal(props.descuentos, props.total, props.fechaCorte, props.discount, sumPagos(props.cobros)))}                                    
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="text-danger">Intereses moratorios</td>
                                <td className="text-right text-danger">{formatNumber(getInteresMoratorio(props.moratorios, props.fechaCorte))}</td>
                            </tr>                            
                        </tfoot>
                    </Table>

            </Col>
        </Row>
    )
}