export const batchUsers = async (keys, models) => {
  // console.log('key: ',key);
  const users = await models.User.findAll({
    where: {
      id: {
        in: keys,
      },
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};
