import React from "react";
import { WaveLoading } from 'react-loadingg';
import './LoaderRequest.css'

const commonStyle = {
    margin: 'auto',
    position: 'initial',
    left: 0,
    right: 0,
    top:10,
    bottom:10
};

export const loaderRequest = () => {
    return  (
        <div className="react-loader-overlay">
            <div className="react-confirm-alert">
                <div className="custom-ui">
                        <h2>Por favor espere, estamos procesando la petición...</h2>
                        <WaveLoading style={commonStyle} color={"#6586FF"} />
                </div>
            </div>
        </div>
    )
}