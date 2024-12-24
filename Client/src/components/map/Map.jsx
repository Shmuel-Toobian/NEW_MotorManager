import React, { useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { OpenStreetMapProvider } from "leaflet-geosearch"
import MyMarker from './MyMarker';

const Map = () => {
    const [position, setPosition] = useState([32.06178114416816, 34.815025961985384]);
    const [str, setStr] = useState("")
    const [name , setName] = useState("")
    const mapProvider = new OpenStreetMapProvider();

    const myRef = useRef("null")

    const locationSearch = async () => {
        let cities = await
            mapProvider.search({ query: str });

        console.log(cities);
        if (cities.length > 0){
            setPosition([cities[0].y, cities[0].x])
            setName(cities[0].label)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        locationSearch();
        myRef.current.value=""

    }
    return (
        <div className='text-center'>
            <form onSubmit={handleSubmit} className='my-2'>
                <input ref={myRef} onChange={(e) => setStr(e.target.value)} type="text" />
                <button className='btn btn-info ms-2'>search</button>
            </form>
            <MapContainer className='my-4' center={position} zoom={13} style={{
                height: '400px', width:
                    '100%'
            }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a
        href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        contributors'
                />

                <MyMarker pos={position} x={name}/>
        
            </MapContainer>
        </div>
    )
}
export default Map
