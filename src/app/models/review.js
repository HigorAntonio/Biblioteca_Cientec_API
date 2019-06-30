module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define('Review', {
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
          review: {
            allowNull: true,
            type: Sequelize.TEXT,
          },
          rating: {
            allowNull: false,
            type: Sequelize.INTEGER,
            validate: {
                min: {
                    args: [1],
                    msg: "O campo rating deve ser maior que 1 e menor que 5"
                },
                max: {
                    args: [5],
                    msg: "O campo rating deve ser maior que 1 e menor que 5"
                }
            }
          },
    });

    return Review;
}