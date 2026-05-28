const express = require('express')
const { createCar, getCars, getCarById, updateCar, deleteCar, getCarsAvailable } = require('../controllers/carController');
const { isAuthenticated } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');
const upload = require("../middlewares/upload");

const carRouter = express.Router()

carRouter.post('/',isAuthenticated,isAdmin,upload.single("image"),createCar);
carRouter.get('/',getCars)
carRouter.get('/available', getCarsAvailable);
carRouter.get('/:id',getCarById)
carRouter.put('/:id',isAuthenticated,isAdmin,updateCar)
carRouter.delete('/:id',isAuthenticated,isAdmin,deleteCar)

module.exports = carRouter;
