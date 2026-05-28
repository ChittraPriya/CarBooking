const { createBranch, getBranches } = require("../controllers/branchController")

const express = require('express')

const branchRoute = express.Router()

branchRoute.post('/', createBranch);
branchRoute.get('/get',getBranches)

module.exports= branchRoute