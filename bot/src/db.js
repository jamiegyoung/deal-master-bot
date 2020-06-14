const { MongoClient } = require('mongodb');
const { connectionString } = require('../configs/db.json');
const sanitize = require('mongo-sanitize');

const mongoClient = new MongoClient(
  encodeURI(connectionString),
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
);
  
mongoClient.connect()
  .then(connection => connection.db('dealMasterBot'))
  .then(database => {
    const db = module.exports;
    
    db.setCountry = async (channelId, country) => {
      const cleanCountry = sanitize(country.toUpperCase());
      try {
        const res = await database.collection('servers')
        .updateOne(
          { 'channels.id': sanitize(channelId) },
          { $set: { 'channels.$.country': cleanCountry } }
        );
        return res.result.nModified;
          
      } catch (err) {
        console.error(err);
        return false;
      }
    };

    db.getCountry = async channelId => {
      try {
        const res = await database.collection('servers')
          .find(
            { 'channels.id': sanitize(channelId) },
            { 
              projection: {
                _id: 0,
                'channels.country': 1
              } 
            }
          )
          .toArray();
        if (!res.length) return false;
        return res[0].channels[0].country;
      } catch (err) {
        console.error(err);
        return false;
      }
    };
  });
