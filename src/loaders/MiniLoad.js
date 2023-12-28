import React from 'react'
import WaveLoading from 'react-loadingg/lib/WaveLoading';

export default function MiniLoad({texto}){

    const commonStyle = {
        margin: 'auto',
        right: 0,
    };

    return(
        <div>
            <h5 style={{color: '#6586FF', textAlign: 'center'}}>{texto}</h5>
            <WaveLoading  style={commonStyle} color={"#6586FF"}/>
        </div>
    )
}