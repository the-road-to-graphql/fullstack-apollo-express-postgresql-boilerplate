import Sequelize from 'sequelize';

let sequelize;

const { DATABASE_URL, IS_TEST, TEST_DATABASE, DATABASE, DATABASE_USER, DATABASE_PASSWORD, HOST } = process.env;

if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  const database = IS_TEST === 'true' ? TEST_DATABASE : DATABASE;
  sequelize = new Sequelize(
    database,
    DATABASE_USER,
    DATABASE_PASSWORD,
    {
      host: HOST,
      dialect: 'mssql',  // postgres
    }
  );
}

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
