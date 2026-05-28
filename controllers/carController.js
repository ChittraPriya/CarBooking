const Car = require("../models/cars");

exports.createCar = async (req, res) => {
  try {
    const { name, brand, pricePerDay, model, seats, fuelType  } = req.body;

    if (!name || !brand || !pricePerDay) {
      return res.status(400).json({  message: "Name, brand, and pricePerDay are required", });
    }

     const carData = {
      name,
      brand,
      pricePerDay,
      model,
      seats,
      fuelType,
      description: req.body.description,

      // ☁️ Cloudinary image
      image: req.file ? req.file.path : null,
    };
    //save to db
    const car = await Car.create(carData);
    res.status(201).json({message: "Car Created Successfully",
      car});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const { brand, fuelType, minPrice, maxPrice, search } = req.query;

    let filter = {};

    // 🔍 search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🚗 brand filter
    if (brand) {
      filter.brand = brand;
    }

    // ⛽ fuel filter
    if (fuelType) {
      filter.fuelType = fuelType;
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter);

    res.status(200).json({ cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarsAvailable = async (req, res) => {
  try {
    const { branch, available } = req.query;

    let filter = {};

    //  FIXED
    if (available === "true") {
      filter.available = true;
    }

    if (branch) {
      filter.branch = branch;
    }

    const cars = await Car.find(filter)
      .populate("branch", "name location");

    return res.status(200).json({
      message: "Cars fetched successfully",
      count: cars.length,
      cars
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching cars",
      error: error.message
    });
  }
};
exports.getCarById = async( req,res) => {
  try {
    const car = await Car.findById(req.params.id);
    if(!car){
      return res.status(400).json({message:'Car not found'})
    }
    res.status(200).json(car)
  } catch(error) {
    res.status(500).json({message: error.message})
  }
}

exports.updateCar = async(req,res) => {
  try {
    const updateCar = await Car.findByIdAndUpdate(req.params.id,req.body,{new: true})
    if(!updateCar) {
      return res.status(400).json({message: "Car not Found"})
    }

    return res.status(200).json(updateCar)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.deleteCar = async(req,res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id)

    if(!deletedCar){
      return res.status(400).json({message: 'Car not Found'})
    }

    res.status(200).json({message: 'Car Deleted Successfully'})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}