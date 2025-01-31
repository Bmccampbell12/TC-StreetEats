import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Set custom icon for food trucks
const truckIcon = new L.icon({
    iconUrl: 'https://www.shutterstock.com/image-vector/food-beverage-truck-logo-vector-suitable-2286533463',
    iconSize: [35, 35],
});

const TruckSearch = () => {
    const dispatch = useDispatch();
    const trucks = useSelector((state) => state.truck.allTrucks);
    const [cuisineFilter, setCuisineFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch({ type: 'FETCH_TRUCKS' });
    }, [dispatch]);

    // Filter trucks based on search term and cuisine
    const filteredTrucks = trucks.filter(truck => {
        return (
            (cuisineFilter === '' || truck.cuisine_type.toLowerCase().includes(cuisineFilter.toLowerCase())) 
            && (searchTerm === '' || truck.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    console.log('All trucks:', trucks);
    console.log('Filtered trucks:', filteredTrucks);

    return (
        <div className="food-truck-search">
            <h1>Food Truck Finder</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Filter by cuisine"
                    value={cuisineFilter}
                    onChange={event => setCuisineFilter(event.target.value)}
                />
            </div>

            {/*Map display with Leaflet API */}
            <MapContainer center={[44.9778, -93.2650]} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {filteredTrucks.map(truck => (
                    truck.latitude && truck.longitude && (
                        <Marker
                            key={truck.id}
                            position={[truck.latitude, truck.longitude]}
                            icon={truckIcon}>
                            <Popup>
                                <h3>{truck.name}</h3>
                                <p>Cuisine: {truck.cuisine_type}</p>
                                <p>{truck.description}</p>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default TruckSearch;