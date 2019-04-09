const mongodb = require('mongodb').MongoClient;

const DB_NAME = 'portfolio' ; 

const MONGO_URL = `mongodb://localhost:27017/${DB_NAME}?authSource=admin`

const connect = async () => {
try {
const client = await mongodb.connect(MONGO_URL, { useNewUrlParser: true});
return client.db(DB_NAME); 
} catch (error) {
  console.log(error);
}
};

module.exports = connect; 