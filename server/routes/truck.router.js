const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const truckQueries = require('../modules/truck.queries');
const { param } = require('express-validator');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
/**
 * GET all trucks with details
 */
router.get('/', async (req, res) => {
  try {
    const { search, cuisine } = req.query;

  let queryText = `
            SELECT 
            t.*,
            u.username as vendor_name,
            COALESCE(AVG(r.rating), 0) as average_rating,
            COUNT(r.id) as review_count
        FROM "trucks" t
        LEFT JOIN "users" u ON t.vendor_id = u.id
        LEFT JOIN "reviews" r ON t.id = r.truck_id
        WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 1;


    if (search) {
      queryText += ` AND (t.name ILIKE $${paramCount} OR t.cuisine_type ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    if (cuisine) {
      queryText += ` AND t.cuisine_type ILIKE $${paramCount}`;
      queryParams.push(`%${cuisine}%`);
      paramCount++;
    }

    if (minRating) {
      queryText += ` HAVING COALESCE(AVG(r.rating), 0) >= $${paramCount}`;
      queryParams.push(parseFloat(minRating));
    }

    queryText += `
      GROUP BY t.id, u.username
      ORDER BY t.name ASC
    `;

    const result = await pool.query(queryText, queryParams);
    
    res.json({
      trucks: result.rows,
      total: result.rowCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting trucks:', error);
    res.status(500).json({ 
      message: 'Error retrieving trucks', 
      error: process.env.NODE_ENV === 'development' ? error.message : null 
     });
  }
  
});
/**
 * Get /api/trucks/:id --> gets a single truck with details
 */
router.get('/:id', 
  [param('id').isInt().toInt()], 
  handleErrors,
  async (req, res) => {
    try {
      const queryText = `
        SELECT 
          t.*,
          u.username as vendor_name,
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(r.id) as review_count,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', m.id,
              'name', m.name,
              'price', m.price,
              'description', m.description,
              'category', m.category
            )
          ) as menu_items
        FROM "trucks" t
        LEFT JOIN "users" u ON t.vendor_id = u.id
        LEFT JOIN "reviews" r ON t.id = r.truck_id
        LEFT JOIN "menu_items" m ON t.id = m.truck_id
        WHERE t.id = $1
        GROUP BY t.id, u.username
      `;

      const result = await pool.query(queryText, [req.params.id]);

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Truck not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error getting truck detail', error);
      res.status(500).json({ 
        message: 'Error retrieving truck details',
        error: process.env.NODE_ENV === 'development' ? error.message : null 
      });
    }
  }
);
/**
 * POST route to create new truck --> protected route
 */
router.post('/', rejectUnauthenticated, async (req, res) => {
  // checks if user is a vendor
  if (req.user.user_type !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can create trucks' })
  }
  const { name, description, cuisine_type, location } = req.body;

  const queryText = `
  INSERT INTO "trucks" 
  (name, description, cuisine_type, location, vendor_id)
  VALUES 
  ($1, $2, $3, $4)
  RETURNING *
  `;
  try {
    const result = await pool.query(queryText, [
      name,
      description,
      cuisine_type,
      location,
      req.user.id
    ])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.log('Error adding truck:', error)
    res.status(500).json({ message: 'Error adding truck' })
   }
});
/**
 * PUT route to update truck details/ location --> protected route
 * Only truck's vendor can update
 */
router.put('/:id/location', rejectUnauthenticated, async (req, res) => {
  try{
      // Get truck to check ownership
    const truck = await truckQueries.getTruckById(req.params.id)
    if (truck.vendor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })

    }
    const result = await pool.query(`
      UPDATE "trucks"
      SET latitude = $1,
      longitde = $2,
      last_location_update = NOW()

WHERE id = $3
RETURNING *`, [req.body.latitude, req.body.longitude, req.params.id])
      res.json(result.rows[0]) 
    } catch(error) {
        console.error('Error updating location', error)
        res.status(500).json({ message: 'Error updating location' })
      }
    })
/**
 * DELETE route to delete truck details --> protected route
 * Only truck's vendor can update
 */
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  try{
      // Get truck to check ownership
    const truck = await truckQueries.getTruckById(req.params.id)
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' })
    }
      // Checks if user owns this truck
      if (truck.vendor_id !== req.user.id) {
        return res.status(403).json({ message: 'You can only delete your own trucks' })
      } 
      await truckQueries.deleteTruck(req.params.id)
      res.json({ message: 'Truck deleted successfully' })
    } catch (error) {
      console.error('Error in DELETE /api/trucks/:id:', error);
    res.status(500).json({ message: 'Error deleting truck' })
    }
});
  


module.exports = router;
