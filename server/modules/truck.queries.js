const pool = require('./pool');

/**
 * Collection of database queries for truck operations
 */
const truckQueries = {
  /**
   * Get trucks with optional filtering
   * @param {Object} options - Query options
   * @param {string} options.searchTerm - Search term for truck name or cuisine
   * @param {string} options.cuisine - Specific cuisine type
   * @param {Object} options.location - Location coordinates {latitude, longitude}
   * @param {number} options.radius - Search radius in meters
   * @returns {Promise<Array>} Array of truck objects
   */
  async getTrucks({ searchTerm = '', cuisine = '', location = null, radius = 5000 } = {}) {
    const query = `
      SELECT 
        t.*,
        u.username as vendor_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as average_rating,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', m.id,
            'name', m.name,
            'description', m.description,
            'price', m.price,
            'category', m.category
          )
        ) FILTER (WHERE m.id IS NOT NULL) as menu_items
      FROM "Trucks" t
      LEFT JOIN "users" u ON t.vendor_id = u.id
      LEFT JOIN "reviews" r ON t.id = r.truck_id
      LEFT JOIN "truck_menu" m ON t.id = m.truck_id
      WHERE ($1 = '' OR t.name ILIKE $1 OR t.cuisine_type ILIKE $1)
        AND ($2 = '' OR t.cuisine_type ILIKE $2)
        AND ($3::numeric IS NULL OR 
          (
            point(t.longitude, t.latitude) <@> point($4, $3) <= $5
          )
        )
      GROUP BY t.id, u.username
      ORDER BY 
        CASE 
          WHEN $3::numeric IS NOT NULL THEN point(t.longitude, t.latitude) <@> point($4, $3)
          ELSE t.name 
        END;
    `;

    try {
      const result = await pool.query(query, [
        `%${searchTerm}%`,
        `%${cuisine}%`,
        location?.latitude,
        location?.longitude,
        radius / 1609.34  // Convert meters to miles for the <@> operator
      ]);
      return result.rows;
    } catch (error) {
      console.error('Error in getTrucks:', error);
      throw new Error('Failed to fetch trucks');
    }
  },

  /**
   * Get a single truck by ID with full details
   * @param {number} id - Truck ID
   * @returns {Promise<Object>} Truck object with details
   */
  async getTruckById(id) {
    const query = `
      SELECT 
        t.*,
        u.username as vendor_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as average_rating,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', m.id,
            'name', m.name,
            'description', m.description,
            'price', m.price,
            'category', m.category
          )
        ) FILTER (WHERE m.id IS NOT NULL) as menu_items,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', r.id,
            'rating', r.rating,
            'comment', r.comment,
            'user_id', r.user_id,
            'created_at', r.created_at,
            'username', ru.username
          )
        ) FILTER (WHERE r.id IS NOT NULL) as reviews
      FROM "Trucks" t
      LEFT JOIN "users" u ON t.vendor_id = u.id
      LEFT JOIN "reviews" r ON t.id = r.truck_id
      LEFT JOIN "users" ru ON r.user_id = ru.id
      LEFT JOIN "truck_menu" m ON t.id = m.truck_id
      WHERE t.id = $1
      GROUP BY t.id, u.username;
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getTruckById:', error);
      throw new Error('Failed to fetch truck details');
    }
  },

  /**
   * Create a new truck
   * @param {Object} truck - Truck details
   * @returns {Promise<Object>} Created truck object
   */
  async createTruck({ name, description, cuisine_type, location, vendor_id }) {
    const query = `
      INSERT INTO "Trucks" (
        name, 
        description, 
        cuisine_type, 
        latitude,
        longitude,
        vendor_id,
        last_location_update
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [
        name,
        description,
        cuisine_type,
        location.latitude,
        location.longitude,
        vendor_id
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in createTruck:', error);
      throw new Error('Failed to create truck');
    }
  },

  /**
   * Update truck details
   * @param {number} id - Truck ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated truck object
   */
  async updateTruck(id, updates) {
    const validFields = ['name', 'description', 'cuisine_type', 'latitude', 'longitude', 'last_location_update'];
    const fields = Object.keys(updates).filter(key => validFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');
    
    const query = `
      UPDATE "Trucks"
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

    try {
      const values = [...fields.map(field => updates[field]), id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateTruck:', error);
      throw new Error('Failed to update truck');
    }
  },

  /**
   * Delete a truck and its related records
   * @param {number} id - Truck ID
   * @returns {Promise<Object>} Deleted truck object
   */
  async deleteTruck(id) {
    // Note: We don't need explicit deletion of related records
    // because we have ON DELETE CASCADE in our schema
    const query = 'DELETE FROM "Trucks" WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteTruck:', error);
      throw new Error('Failed to delete truck');
    }
  }
};

module.exports = truckQueries;