const pool = require('./pool');

const truckQueries = {

    async getTrucks({ searchTerm = '', cuisine = '', location = null, radius = 5000 } = {}) {
        const query = `
        SELECT t.*,
        COUNT (DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as average_rating
        FROM "TRUCKS" t
        LEFT JOIN reviews r ON t.id = r.truck_id
        WHERE
        ($1 = '' OR t.name ILIKE $1 OR t.cuisine ILIKE $1)
        AND ($2 = '' OR t.cuisine ILIKE $2)
        AND ($3::numeric IS NULL OR ABS(t.location - $3) <= $4)
        GROUP BY t.id
        ORDER BY average_rating DESC;
        `;

      const result = await pool.query(query, [
        `%${searchTerm}%`,
        `%${cuisine}%`,
        location,
        radius
      ]);
      return result.rows;

    },
    // Gets a single truck by ID with full details. 
    async getTruckById(id) {
        const query = `
        SELECT t.*,
        COUNT (DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as average_rating
        FROM "TRUCKS" t
        LEFT JOIN reviews r ON t.id = r.truck_id
        LEFT JOIN truck_menu tm ON t.id = tm.truck_id
        WHERE t.id = $1
        GROUP BY t.id;
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];

    },
    // Create new truck.
    async createTruck({ name, cuisine, location, vendor_id }) {
        const query = `
        INSERT INTO "trucks" (name, cuisine, location, vendor_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

       const result = await pool.query(query, [
        name,
        cuisine,
        location,
        vendor_id
       ]);
       return result.rows[0];
    },

    // Update truck details.
    async updateTruck(id, { name, cuisine, location }) {
        const query = `
            UPDATE "trucks"
            SET
            name = COALESCE($1, name),
            cuisine = COALESCE($2, name),
            location = COALESCE($3, location),
        WHERE id = $4
        RETURNING *;
        `;

        const result = await pool.query(query, [
            name, cuisine, 
            location,
            id
        ]);
        return result.rows[0];
    },

    // Delete truck (with Cascade & relationship checks)
    async deleteTruck(id) {
    // Checks for related records first
    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM reviews WHERE truck_id = $1
        UNION
        SELECT 1 FROM truck_menu WHERE truck_id = $1
        UNION
        SELECT 1 FROM favorites WHERE truck_id = $1
      );
   `;

    const { exists } = (await pool.query(checkQuery, [id])).rows[0];

    if (exists) {
        throw new Error('cannot delete truck with existing relationships');

    }
    const query = `
    DELETE FROM "trucks"
    WHERE id = $1
    RETURNING *;
    `;

    const result = await pool.query(query, [id])
    return result.rows[0];
    }
};

module.exports = truckQueries;