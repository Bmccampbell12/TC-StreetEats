import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter } from '@/components/ui/card';

const TruckList = () => {
const dispatch = useDispatch()
const { allTrucks, loading, error } = useSelector(state => state.trucks)

useEffect(() => {
    dispatch({ type: 'FETCH_TRUCKS_REQUEST' });
}, [dispatch]);

if (loading) {
    return <div>Error: {error}</div>;
}

return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {allTrucks.map(truck => (
      <Link to={`/trucks/${truck.id}`} key={truck.id}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardBody>
            <h3 className="text-xl font-bold">{truck.name}</h3>
            <p className="text-gray-600">{truck.cuisine}</p>
            <p className="text-gray-500">
              {truck.review_count} reviews - {truck.average_rating.toFixed(1)} stars
            </p>
            </CardBody>
            <CardFooter>
              <span className="text-gray-500">
                {Math.round(Math.abs(truck.location) / 1000)} km away
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TruckList;