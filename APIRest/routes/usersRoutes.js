module.exports = function(users){
    // Mongo controller CRUD for Users
    const UsersCtrl = require('../controllers/users');

    users.route('/users')
    .get(UsersCtrl.findAllUsers);

    users.route('/users/findById/:id')
    .get(UsersCtrl.findById);

    users.route('/users/add')
    .post(UsersCtrl.addUser);

    users.route('/users/update')
    .put(UsersCtrl.updateUser);

    users.route('/users/delete/:id')
    .delete(UsersCtrl.deleteUser);

    users.route('/users/newers')
    .get(UsersCtrl.newers);

    users.route('/users/login')
    .post(UsersCtrl.login);
}