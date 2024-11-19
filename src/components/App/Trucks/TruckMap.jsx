import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

function TruckMap() {
    const dispatch = useDispatch();
    const history = useHistory();
    const trucks = useSelector((state) => state.truck?.allTrucks || []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            dispatch({
                type: 'SEARCH_TRUCKS_BY_LOCATION',
                payload: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        });
    }, []);

    return (
        <MapContainer center={[44.977753, -93.265011]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trucks.map(truck => (
                <Marker 
                    key={truck.id} 
                    position={[truck.latitude, truck.longitude]}
                >
                    <Popup>
                        <h3>{truck.name}</h3>
                        <button onClick={() => history.push(`/trucks/${truck.id}`)}>
                            View Details
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
export default TruckMap;