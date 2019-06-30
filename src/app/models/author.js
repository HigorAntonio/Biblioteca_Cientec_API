module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define('Author', {
          name: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
              notEmpty: {
                msg: "O campo nome não pode ser vazio"
              }
            }
          },
          about: {
            allowNull: true,
            type: Sequelize.TEXT,
            validate: {
              notEmpty: {
                msg: "O campo about não pode ser vazio"
              }
            }
          }
    });

    return Author;
}