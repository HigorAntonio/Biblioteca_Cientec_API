const bcrypt = require("bcryptjs");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo name não pode ser vazio"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo email não pode ser vazio"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo password não pode ser vazio"
                }
            }
        },
        passwordResetToken: Sequelize.STRING,
        passwordResetExpires: Sequelize.DATE,
    }, {
        hooks: {
            beforeCreate: user => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            },
            beforeUpdate: user => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    });

    return User;
}