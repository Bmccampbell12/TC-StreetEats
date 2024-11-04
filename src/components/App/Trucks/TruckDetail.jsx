import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardFooter } from '@/components/ui/card';

const TruckDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedTruck, loading, error } = useSelector(state => state.truck);
  
    useEffect(() => {
      dispatch({ type: 'FETCH_TRUCK_BY_ID', payload: id });
    }, [dispatch, id]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (!selectedTruck) {
      return <div>Truck not found</div>;
    }

    return (
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold">{selectedTruck.name}</h1>
            <p className="text-gray-600">{selectedTruck.cuisine}</p>
            <p className="text-gray-500">
              {selectedTruck.review_count} reviews - {selectedTruck.average_rating.toFixed(1)} stars
            </p>
            <p className="text-gray-500">
              Location: {Math.round(Math.abs(selectedTruck.location) / 1000)} km away
            </p>
            <h2 className="text-xl font-bold mt-4">Menu</h2>
            <ul>
              {selectedTruck.menu_items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.item_name} - {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Favorites
            </button>
          </CardFooter>
        </Card>
      );
    };
    
    export default TruckDetail;