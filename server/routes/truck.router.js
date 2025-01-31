const express = require('express');
const { param, body, query, validationResult } = require('express-validator');
const router = express.Router();
const truckQueries = require('../modules/truck.queries');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * Middleware to validate request
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * GET /api/trucks
 * Get all trucks with optional filtering
 */
router.get('/', [
  query('search').optional().trim().escape(),
  query('cuisine').optional().trim().escape(),
  query('latitude').optional().isFloat({ min: -90, max: 90 }),
  query('longitude').optional().isFloat({ min: -180, max: 180 }),
  query('radius').optional().isInt({ min: 0, max: 50000 }),
  validateRequest
], async (req, res) => {
  try {
    const { search, cuisine, latitude, longitude, radius } = req.query;
    const location = latitude && longitude ? { 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude) 
    } : null;

    const trucks = await truckQueries.getTrucks({
      searchTerm: search,
      cuisine,
      location,
      radius: radius ? parseInt(radius) : 5000
    });

    res.json({
      trucks,
      total: trucks.length,
      filters: { search, cuisine, location, radius },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in GET /api/trucks:', error);
    res.status(500).json({ 
      message: 'Error retrieving trucks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/trucks/:id
 * Get a single truck with details
 */
router.get('/:id', [
  param('id').isInt().toInt(),
  validateRequest
], async (req, res) => {
  try {
    const truck = await truckQueries.getTruckById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    res.json(truck);
  } catch (error) {
    console.error('Error in GET /api/trucks/:id:', error);
    res.status(500).json({ 
      message: 'Error retrieving truck details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/trucks
 * Create a new truck (protected route)
 */
router.post('/', [
  rejectUnauthenticated,
  body('name').trim().isLength({ min: 2, max: 80 }).escape(),
  body('description').trim().isLength({ min: 10, max: 500 }).escape(),
  body('cuisine_type').trim().isLength({ min: 2, max: 80 }).escape(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  validateRequest
], async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create trucks' });
    }

    const { name, description, cuisine_type, latitude, longitude } = req.body;
    const truck = await truckQueries.createTruck({
      name,
      description,
      cuisine_type,
      location: { latitude, longitude },
      vendor_id: req.user.id
    });

    res.status(201).json(truck);
  } catch (error) {
    console.error('Error in POST /api/trucks:', error);
    res.status(500).json({ 
      message: 'Error creating truck',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/trucks/:id/location
 * Update truck location (protected route)
 */
router.put('/:id/location', [
  rejectUnauthenticated,
  param('id').isInt().toInt(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  validateRequest
], async (req, res) => {
  try {
    const truck = await truckQueries.getTruckById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    if (truck.vendor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this truck' });
    }

    const { latitude, longitude } = req.body;
    const updatedTruck = await truckQueries.updateTruck(req.params.id, {
      latitude,
      longitude,
      last_location_update: new Date()
    });

    res.json(updatedTruck);
  } catch (error) {
    console.error('Error in PUT /api/trucks/:id/location:', error);
    res.status(500).json({ 
      message: 'Error updating truck location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/trucks/:id
 * Delete a truck (protected route)
 */
router.delete('/:id', [
  rejectUnauthenticated,
  param('id').isInt().toInt(),
  validateRequest
], async (req, res) => {
  try {
    const truck = await truckQueries.getTruckById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    if (truck.vendor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this truck' });
    }

    await truckQueries.deleteTruck(req.params.id);
    res.json({ message: 'Truck deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/trucks/:id:', error);
    res.status(500).json({ 
      message: 'Error deleting truck',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
