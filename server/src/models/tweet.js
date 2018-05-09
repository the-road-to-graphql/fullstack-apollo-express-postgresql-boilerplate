const tweet = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('tweet', {
    text: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
  });

  Tweet.associate = models => {
    Tweet.belongsTo(models.Author);
  };

  return Tweet;
};

export default tweet;
