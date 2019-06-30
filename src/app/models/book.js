const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('Book', {
        isbn: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo title não pode ser vazio"
                }
            }
        },
        originalTitle: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo originalTitle não pode ser vazio"
                }
            }
        },
        edition: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        publisher: {
            type: Sequelize.STRING,
            allowNull: true
        },
        coverUrl: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coverName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo description não pode ser vazio"
                }
            }
        },
        numberOfPages: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo numberOfPages não pode ser vazio"
                }
            }
        },
        language: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo language não pode ser vazio"
                }
            }
          },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('indisponivel', 'disponivel', 'emprestado'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O campo status não pode ser vazio"
                }
            }
        }
    }, {
        hooks: {
            beforeCreate: book => {
                if (!book.coverUrl) {
                    book.coverUrl = `http://localhost:${process.env.PORT}/files/${book.coverName}`;
                }
            },
            beforeDestroy: book => {
                if (book.coverUrl.indexOf('amazonaws') !== -1) {
                    return s3.deleteObject({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: book.coverName,
                    }).promise();
                } else {
                    return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', book.coverName));
                }
            }
        }
    });

    return Book;
}