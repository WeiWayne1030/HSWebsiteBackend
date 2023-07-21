'use strict'
<<<<<<< HEAD:migrations/20230715120232-create-color.js

=======
<<<<<<<< HEAD:migrations/20230715032610-create-item.js
========

>>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Colors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
<<<<<<< HEAD:migrations/20230715120232-create-color.js
=======
<<<<<<<< HEAD:migrations/20230715032610-create-item.js
      state: {
        type: Sequelize.BOOLEAN
      },
      image: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      CategoryId: {
        type: Sequelize.INTEGER
      },
========
>>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
<<<<<<< HEAD:migrations/20230715120232-create-color.js
   return queryInterface.dropTable('Colors')
=======
<<<<<<<< HEAD:migrations/20230715032610-create-item.js
    return queryInterface.dropTable('Items')
========
   return queryInterface.dropTable('Colors')
>>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/migrations/20230715120232-create-color.js
  }
}
