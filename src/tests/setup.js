import httpServer from '../index';
import models, { sequelize } from '../models';


const createUsersWithMessages = async date => {
  try {
    await models.User.create(
      {
        username: 'rwieruch',
        email: 'hello@robin.com',
        password: 'rwieruch',
        role: 'ADMIN',
        messages: [
          {
            text: 'Published the Road to learn React',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );

    await models.User.create(
      {
        username: 'ddavids',
        email: 'hello@david.com',
        password: 'ddavids',
        messages: [
          {
            text: 'Happy to release ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
          {
            text: 'Published a complete ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );
  } catch (error) {
    console.error(error);
  }
};

const setup = ({eraseDatabaseOnSync}) =>
  sequelize.sync({force: eraseDatabaseOnSync})
  .then(async () => {
    if (eraseDatabaseOnSync) await createUsersWithMessages(new Date());
    httpServer.listen({ port: 8000 }, () => { console.log('Apollo Server on http://localhost:8000/graphql'); });
    return;
  });

export default setup;