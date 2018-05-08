import Sequelize from 'sequelize';

const sequelize = new Sequelize('twitter', 'postgres', 'postgres', {
  dialect: 'postgres',
});

const models = {
  Author: sequelize.import('./author'),
  Tweet: sequelize.import('./tweet'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
