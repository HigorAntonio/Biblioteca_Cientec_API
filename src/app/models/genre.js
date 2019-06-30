module.exports = (sequelize, Sequelize) => {
    const Genre = sequelize.define('Genre', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo name não pode ser vazio"
                }
            }
        }
    });

    return Genre;
}