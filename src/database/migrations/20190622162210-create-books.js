'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isbn: {
        allowNull: true,
        type: Sequelize.STRING(20),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      originalTitle: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      edition: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      publisher: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      coverUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      coverName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      numberOfPages: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Authors',
          key: 'id',
        }
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('indisponivel', 'disponivel', 'emprestado'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Books');
  }
};
