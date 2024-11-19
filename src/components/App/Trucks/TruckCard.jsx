import React from 'react';
import { useNavigate } from 'react-router-dom';

const TruckCard = ({ truck }) => {
    const navigate = useNavigate();

    return (
        <div className="truck-card" onClick={() => navigate(`/truck/${truck.id}`)}>
            <img src={truck.image_url} alt={truck.name} />
            <h3>{truck.name}</h3>
            <p>{truck.cuisine}</p>
            <div className="status">
                {truck.is_open ? 
                    <span className="open">Open Now</span> : 
                    <span className="closed">Closed</span>
                }
            </div>
        </div>
    );
};


export default TruckCard;