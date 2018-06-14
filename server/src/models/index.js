import Sequelize from 'sequelize';

const sequelize = new Sequelize('twitter', 'postgres', 'postgres', {
  dialect: 'postgres',
});

const models = {
  User: sequelize.import('./user'),
  Tweet: sequelize.import('./tweet'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize, Sequelize };

export default models;
