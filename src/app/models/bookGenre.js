module.exports = (sequelize, Sequelize) => {
    const BookGenre = sequelize.define('BookGenre', {
      bookId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: "O campo bookId não pode ser vazio"
          }
        }
      },
      genreId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: "O campo genreId não pode ser vazio"
          }
        }
      },
    });

    return BookGenre;
}