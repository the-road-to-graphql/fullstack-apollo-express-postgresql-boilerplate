export const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: keys,
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};
