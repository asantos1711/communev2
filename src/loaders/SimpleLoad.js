import React from "react";
import { LoopCircleLoading } from "react-loadingg";


export default function SimpleLoad(){
    const commonStyle = {
        margin: 'auto',
        left: 0,
        right: 0,
        top:10,
        bottom:10
    };
    return(
        <div className="bg-overlay">
            <LoopCircleLoading color={"#6586FF"} style={commonStyle}/>
        </div>
    )
}