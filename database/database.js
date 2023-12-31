const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
  }).then(con => {
    console.log(`MongoDB Database is connected to ${con.connection.host}` )
  })
}

module.exports = connectDatabase