import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function TruckLocator() {
    const dispatch = useDispatch();
    const trucks = useSelector(state => state.trucks.nearbyTrucks);
    const [userLocation, setUserLocation] = useState({
        lat: 44.977753,  // Minneapolis default
        lng: -93.265011
    });

    // Custom marker icons
    const truckIcon = new L.Icon({
        iconUrl: '/images/truck-marker.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);
                    searchNearbyTrucks(location);
                },
                (error) => {
                    console.log('Error getting location:', error);
                    searchNearbyTrucks(userLocation);
                }
            );
        }
    }, []);

    const searchNearbyTrucks = (location) => {
        dispatch({
            type: 'SEARCH_TRUCKS_BY_LOCATION',
            payload: {
                latitude: location.lat,
                longitude: location.lng,
                radius: 5000 // 5km radius
            }
        });
    };

    return (
        <div className="truck-locator">
            <h2>Find Food Trucks Near You</h2>
            <MapContainer 
                center={[userLocation.lat, userLocation.lng]} 
                zoom={13} 
                style={{ height: '70vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* User Location Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>You are here</Popup>
                </Marker>

                {/* Truck Markers */}
                {trucks.map(truck => (
                    <Marker 
                        key={truck.id}
                        position={[truck.latitude, truck.longitude]}
                        icon={truckIcon}
                    >
                        <Popup>
                            <h3>{truck.name}</h3>
                            <p>{truck.cuisine}</p>
                            <button onClick={() => history.push(`/foodtrucks/${truck.id}`)}>
                                View Details
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            <div className="nearby-trucks-list">
                <h3>Nearby Food Trucks</h3>
                {trucks.map(truck => (
                    <div key={truck.id} className="truck-item">
                        <h4>{truck.name}</h4>
                        <p>{truck.cuisine}</p>
                        <p>Distance: {truck.distance?.toFixed(1)} km</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TruckLocator;
