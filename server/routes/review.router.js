const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', async (req, res) => {
    try {
        const query = `
        SELECT reviews.*, users.username, trucks.name as truck_name 
        FROM reviews 
        JOIN users ON reviews.user_id = users.id 
        JOIN "Trucks" ON reviews.truck_id = "Trucks".id 
        ORDER BY reviews.created_at DESC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/reviews:', error);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const { truck_id, rating, comment } = req.body;
        const user_id = req.user.id;
        
        const query = `
            INSERT INTO reviews (truck_id, user_id, rating, comment, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        
        const result = await pool.query(query, [truck_id, user_id, rating, comment]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/reviews:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
