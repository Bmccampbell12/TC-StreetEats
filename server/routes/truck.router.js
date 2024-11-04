const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const truckQueries = require('../modules/truck.queries');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET /api/trucks
 */
router.get('/api/trucks', async (req, res) => {
  try {
    const trucks = await truckQueries.getTrucks(req.query);
    res.json(trucks);
  } catch (error) {
    console.error('Error in GET /api/trucks:', error);
    res.status(500).json({ message: 'Internal server error.' })
  }

});
/**
 * Get /api/trucks/:id --> gets a single truck's ID
 */
router.get('/:id', async (req, res) => {
  try{
    const truck = await truckQueries.getTruckById(req.params.id);
    if (!truck) {
      return res.status(400).json({ message: 'Truck not found' });
    } 
    res.json(truck);
  } catch (error) {
      console.error('Error in GET /api/trucks/:id', error);
      res.status(500).json({ message: 'Internal server error.' })
    }

  });
/**
 * POST route to create new truck --> protected route
 */
router.post('/', rejectUnauthenticated, async (req, res) => {
  // checks if user is a vendor
  if (req.user.role !== 'vendor') {
return res.status(403).json({ message: 'Only vendors can create trucks' });
  }

  try {
    const newTruck = await truckQueries.createTruck({
      ...req.body,
      vendor_id: req.user.id
    });
    res.status(201).json(newTruck)
  } catch (error) {
    console.error('Error in POST /api/trucks:', error)
    if (error.constraint === 'trucks_name_key') {
      return res.status(400).json({ message: 'A truck with this name already exists' })

    }
    res.status(500).json({ message: 'Internal server error.' });
  }
 
});
/**
 * PUT route to update truck details --> protected route
 * Only truck's vendor can update
 */
router.put('/:id', rejectUnauthenticated, async (req, res) => {
  try{
      // Get truck to check ownership
    const truck = await truckQueries.getTruckById(req.params.id)
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' })

    }
      // Checks if user owns this truck
      if (truck.vendor_id !== req.user.id) {
        return res.status(403).json({ message: 'You can only update your own trucks' })
      } 
      const updatedTruck = await truckQueries.updateTruck(req.params.id, req.body)
    res.json(updatedTruck);

     } catch (error) {
        console.error('Error in PUT /api/truck/:id:', error);
        res.status(500).json({ message: 'Internal server error.' })
      }

    });
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
      if (error.message.includes('existing relationships')) {
        return res.status(400).json({
          message: 'Cannot delete truck with existing reviews or menu items'
        })
    }
    res.status(500).json({ message: 'Internal server error.' })

    }
});
  


module.exports = router;
