const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')
const app = require('./app')

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log('Connected to Mongodb')

    app.listen(PORT, () =>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((err)=> {
    console.log("Error connecting to the MongoDB server:",err.message)
})