import UserModel from'./userModel';

/**
 * The code below contains functions to query the datalayer and save
 * new data. Please access the database via this facade, rather than
 * using the models directly.
 */

export default {
  
    getUsers(callback) {
        UserModel.find().exec(function(err, users) {
            if (err) {
                console.log('failed to retrieve users');
            }
            callback(users);
        });
    },

    getUser(query, callback) {
        UserModel.findOne(query).exec(function (err, user) {
            callback(user);
        });
    },

    updateUser(query, user) {
      UserModel.findOneAndUpdate(query, user, {upsert:false}, function(err, doc){
        if (err) {
          console.log('Save failed : ',data);
        }
      });
    },

    addUser(user) {
      const User = new UserModel(user);
      UserModel.findOne({username : user.username}).exec(function (err, user) {
        if (user === undefined || user === null){
          User.save(function(err, data) {
            if (err) {
              console.log('Save failed : ',data);
            }
          });
        }else{
         // console.warn('user already exists: ');
        }
      });
    }
}
