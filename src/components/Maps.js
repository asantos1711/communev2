import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const Maps = withScriptjs(withGoogleMap((props) =>  
  <GoogleMap
    defaultZoom={15}
    defaultCenter={ props.isMarkerShown ? { lat: parseFloat(props.lat), lng: parseFloat(props.lng) } : { lat: 21.11190910655062, lng: -86.84308940297123 }}
    onClick={props.onClick}
  >
    {
      props.isMarkerShown 
        ? <Marker position={{ lat: parseFloat(props.lat), lng: parseFloat(props.lng) }} />
        : <Marker position={props.onMarkerClick} />
    }
  </GoogleMap>
))

export default Maps


