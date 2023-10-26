import { Sequelize } from 'sequelize-typescript';
import { Item } from 'src/item/entities/item.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: procees.env.DB_HOST || 'localhost',
        port: procees.env.DB_PORT || 3306,
        username: procees.env.DB_USERNAME || 'root',
        password: procees.env.DB_PASSWORD || 'password',
        database: procees.env.DB_NAME || 'develop',
      });
      sequelize.addModels([Item]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
