const { start } = require('./modules/system/global')
const { connectDB } = require('./date/database') 

connectDB()
start()



