import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MyMarker from './MyMarker';
import { useLocation } from 'react-router-dom';

const Map = () => {
    const { state } = useLocation();
    const [position, setPosition] = useState([32.06178114416816, 34.815025961985384]);
    const [name, setName] = useState("");
    const mapProvider = new OpenStreetMapProvider();

    useEffect(() => {    
            
        if (state?.location) {
            locationSearch(state.location);
        }
    }, [state]);

    const locationSearch = async (query) => {
        try {
            console.log("Searching for location:", query);
            const cities = await mapProvider.search({ query });
            
            if (cities.length > 0) {
                console.log("Found location:", cities[0]);
                setPosition([cities[0].y, cities[0].x]);
                setName(cities[0].label);
            } else {
                console.log("No location found");
            }
        } catch (error) {
            console.error("Error searching location:", error);
        }
    };

    return (
        <div className='text-center' style={{ height: '100vh', width: '100vw' }}>
            <MapContainer className='my-4' center={position} zoom={13} style={{
                height: '100%', width: '100%'
            }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MyMarker pos={position} x={name} />
            </MapContainer>
        </div>
    );
}

export default Map;