const { color, log } = require('console-log-colors');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL).
            then(() => {
                log(color.green(' ******************************************** '))
                log(color.green(' *******                              ******* '))
                log(color.green(' ******* Mongo Connected successfully ******* '))
                log(color.green(' *******                              ******* '))
                log(color.green(' ******************************************** '))
            }
            )
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB
