import React from 'react'
import { Marker, Popup, Tooltip, useMap } from 'react-leaflet'

const MyMarker = (props) => {

    const map = useMap();
    map.flyTo(props.pos);

    return (
        <Marker position={props.pos}>
            <Popup>
                {props.x}
            </Popup>
            <Tooltip>  {props.x} </Tooltip>
        </Marker>
    )
}

export default MyMarker
