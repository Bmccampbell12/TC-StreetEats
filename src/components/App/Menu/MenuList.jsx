import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuItemCard from './MenuItemCard';

const MenuList = ({ truckId }) => {
    const dispatch = useDispatch();
    const menuItems = useSelector((state) => state.menu.items);
    const loading = useSelector((state) => state.menu.loading);
    const error = useSelector((state) => state.menu.error);

    useEffect(() => {
        if (truckId) {
            dispatch({ type: 'FETCH_MENU_ITEMS', payload: truckId });
        }
    }, [dispatch, truckId]);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div>Error loading menu: {error}</div>;
    if (!menuItems.length) return <div>No menu items available</div>;

    return (
        <div className="menu-list">
            <h2>Menu Items</h2>
            <div className="menu-grid">
                {menuItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MenuList;
