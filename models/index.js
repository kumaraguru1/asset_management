const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Read all files in the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    // Filter out files that are not JavaScript files or the current file
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    try {
      // Dynamically load each model and register it in the `db` object
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      
      // If the model is valid, add it to `db`
      if (model && model.name) {
        db[model.name] = model;
      } else {
        console.error(`Model file ${file} does not export a valid model.`);
      }
    } catch (err) {
      console.error(`Error loading model ${file}:`, err);
    }
  });

// Define Associations between models
db.AssetCategory.hasMany(db.Asset, { foreignKey: 'category_id' });
db.Asset.belongsTo(db.AssetCategory, { foreignKey: 'category_id' });

db.Asset.hasMany(db.Transaction, { foreignKey: 'asset_id' });
db.Transaction.belongsTo(db.Asset, { foreignKey: 'asset_id' });

db.Employee.hasMany(db.Transaction, { foreignKey: 'employee_id' });
db.Transaction.belongsTo(db.Employee, { foreignKey: 'employee_id' });

// Ensure User model is included
// if (db.User) {
db.User.hasMany(db.Transaction, { foreignKey: 'user_id' }); // Add associations if required
db.Transaction.belongsTo(db.User, { foreignKey: 'user_id' });
// }

// Attach sequelize and Sequelize to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object, which contains all models and sequelize instance
module.exports = db;
