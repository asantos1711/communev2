import React from 'react'
import { Card, Table } from 'react-bootstrap'
import { getMonthStr } from '../utils/getMonthStr'
import { setBagdeStatus } from '../utils/setBagdeStatus'
import { formatNumber } from '../utils/formatNumber'

export default function MttoDetail(props){
    return(
        <Card className="shadow">
            <Card.Body>
                <Table size="sm" className="n-border">
                    <thead>
                        <tr>
                            <th>Período</th>
                            <th className="text-center">Estado del pago</th>
                            <th>Pagar</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td width="30%">{`${getMonthStr(props.mtto.mes)} - ${props.mtto.year}`}</td>
                            <td width="30%" className="text-center"><span className={`badge badge-pill ${setBagdeStatus(props.mtto.status)}`}>{props.mtto.status}</span></td>
                            <td width="40%">{formatNumber(props.mtto.amount)}
                                {/* {
                                    props.mtto.status==="pagado" 
                                    ? <div>
                                        {
                                            props.mtto.amount > sumPagos(props.mtto.cobroMantenimientoList)
                                            && <span className="text-muted"><del>{formatNumber(props.mtto.amount)}</del></span>
                                        }                                        
                                        {' '}{formatNumber(sumPagos(props.mtto.cobroMantenimientoList))}
                                      </div>
                                    : formatNumber(getAmountMttoDcto(props.mtto.cobroMantenimientoList))
                                }                                 */}
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table> 
            </Card.Body>
        </Card>
    )
}