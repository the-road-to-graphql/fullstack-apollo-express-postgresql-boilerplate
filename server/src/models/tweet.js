const tweet = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('tweet', {
    text: DataTypes.STRING,
  });

  Tweet.associate = models => {
    Tweet.belongsTo(models.Author);
  };

  return Tweet;
};

export default tweet;
