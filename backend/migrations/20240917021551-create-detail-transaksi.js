'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_transaksis', {
      id_detail_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // id_detail_transaksi: {
      //   type: Sequelize.INTEGER
      // },
      id_transaksi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: `transaksis`,
          key: `id_transaksi`
        }
      },
      id_menu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: `menus`,
          key: `id_menu`
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNullL: false
      },
      harga: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_transaksis');
  }
};