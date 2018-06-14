export const batchUsers = async (keys, models) =>
  await models.User.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });
