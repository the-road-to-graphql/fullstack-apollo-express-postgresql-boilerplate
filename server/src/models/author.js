import bcrypt from 'bcrypt';

export const createHashedPassword = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const author = (sequelize, DataTypes) => {
  const Author = sequelize.define('author', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  });

  Author.generatePasswordHash = async password => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  Author.validatePasswordWithHash = async password => {
    return await bcrypt.compare(password, this.password);
  };

  Author.beforeCreate(async function(user) {
    user.password = await this.generatePasswordHash(user.password);
  });

  Author.associate = models => {
    Author.hasMany(models.Tweet);
  };

  return Author;
};

export default author;
