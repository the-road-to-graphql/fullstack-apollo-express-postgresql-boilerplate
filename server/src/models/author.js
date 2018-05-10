import bcrypt from 'bcrypt';

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

  Author.findByLogin = async login => {
    let user = await Author.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await Author.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  Author.associate = models => {
    Author.hasMany(models.Tweet);
  };

  Author.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  Author.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  Author.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return Author;
};

export default author;
