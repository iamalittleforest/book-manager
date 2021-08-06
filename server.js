const sequelize = require('../config/connection');

const connection = async () => {
  try {
    await sequelize.sync({ force: false })
    console.log(`Loaded x books into the library`);
  } catch(err) {
    console.log(err);
  }
}

connection();