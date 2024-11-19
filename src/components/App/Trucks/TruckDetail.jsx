import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const TruckDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const truck = useSelector(state => state.truck.selectedTruck);

    useEffect(() => {
        dispatch({ type: 'FETCH_TRUCK_DETAIL', payload: id });
    }, [id]);

    return truck ? (
        <div className="truck-detail">
            <h2>{truck.name}</h2>
            <img src={truck.image_url} alt={truck.name} />
            <p>{truck.description}</p>
            <div className="menu">
                <h3>Menu</h3>
                {truck.menu_items?.map(item => (
                    <div key={item.id} className="menu-item">
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <span>${item.price}</span>
                    </div>
                ))}
            </div>
        </div>
    ) : <div>Loading...</div>;
};
 export default TruckDetail;