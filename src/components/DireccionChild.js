import React from 'react'
import { RiBuilding4Line } from 'react-icons/ri'
import { getIconTipoLote } from '../utils/getIconTipoLote'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { getIconCatHab } from '../utils/getIconCatHab'
import { getIconSubCatHab } from '../utils/getIconSubCatHab'
import { getIconCatConst } from '../utils/getIconCatConst'
import { getIconSubCatConst } from '../utils/getIconSubCatConst'

export default function DireccionChild(props){
    return (
        <div className="pt-4">
            <h5>Unidades</h5>
            <div className="d-flex justify-content-start horizontal-scroll">            
                {
                        props.direcciones.map((item,i)=>(
                            <div key={i} className="unidades">
                                <span className="text-secondary d-block">
                                    <RiBuilding4Line className="mb-1"/> <span className="mr-5">{item.referencia}</span>
                                    {getIconTipoLote(item.tipo_lote)}
                                    {getIconCatHab(item.category_hab)}
                                    {getIconSubCatHab(item.sub_category_hab)}
                                    {getIconCatConst(item.category_const)}
                                    {getIconSubCatConst(item.category_const)}
                                </span>
                                <span className="text-secondary d-block"><FaMapMarkedAlt className="mb-1"/> {item.direccion}</span>
                            </div>
                        ))
                    }
            </div>
        </div>        
    )
}