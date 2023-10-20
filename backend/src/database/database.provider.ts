import { Sequelize } from 'sequelize-typescript';
// import { User } from '../users/user.entity'; // assuming you have a User entity

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'develop',
      });
    //   sequelize.addModels([User]); // add your models here
      await sequelize.sync();
      return sequelize;
    },
  },
];
