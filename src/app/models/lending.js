module.exports = (sequelize, Sequelize) => {
    const Lending = sequelize.define('Lending', {
          userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            validate: {
              notEmpty: {
                msg: "O campo userId não pode ser vazio"
              }
            }
          },
          bookId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            validate: {
              notEmpty: {
                msg: "O campo bookId não pode ser vazio"
              }
            }
          },
          returnDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
          },
    });

    return Lending;
}