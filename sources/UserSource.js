import urls from '../constants/url';
import axios from 'axios';
import ua from '../actions/UserActions';
import querystring from 'querystring';
const header =  { 'Content-Type': 'application/x-www-form-urlencoded' };

const UserSource = {
    updateUser: {
        remote(state, user) {
          const updatedUser = user[0];
          return new Promise(function(resolve, reject) {
              axios.post(urls.dbUpdateUser, querystring.stringify(updatedUser), { headers: header }).then(function(user) {
                resolve(user);
              });
          });
        },
        success: ua.userUpdateSuccess,
        error: ua.userUpdateError
    },
    logout: {
      remote(state, user) {
        return new Promise(function(resolve, reject) {
          axios.get(urls.dbLogoutUser).then(function(user) {
            resolve(user);
          });
        });
      },
      success: ua.logoutSuccess,
      error: ua.logoutError
    },
    fetchUsers: {
      remote(state) {
        return new Promise(function(resolve, reject) {
          axios.get(urls.dbUsers).then(function(users) {
            if(users !== undefined && users !== null){
              resolve(users);
            } else {
              reject(users);
            }
          });
        });
      },
      success: ua.usersSuccess,
      error: ua.usersError
    },
    login: {
      remote(state, user) {
        const incommingUser = user;
        return new Promise(function(resolve, reject) {
          axios.post(urls.dbLogin, querystring.stringify(incommingUser), { headers: header }).then(function(res) {
            if(res.status !== 401 || res.status !== 400){
              resolve(res);
            } else {
              reject(res);
            }
          }).catch(function(res) {
            if(res.status === 401 || res.status === 400) {
              ua.userError(res);
            } else if(res.status === 200){
              ua.userSuccess(res);
            }
          })
        });
      },
      success: ua.userSuccess,
      error: ua.userError
    },
    register: {
      remote(state, user) {
        return new Promise(function (resolve, reject) {
          axios.post(urls.dbRegister, querystring.stringify(user), {headers: header}).then(function (res) {
            if (res.status !== 401 || res.status !== 400) {
              resolve(res);
            } else {
              reject(res);
            }
          }).catch(function (res) {
            if (res.status === 401 || res.status === 400) {
              ua.userError(res);
            } else if (res.status === 200) {
              ua.userSuccess(res);
            }
          })
        });
      },
      success: ua.userSuccess,
      error: ua.userError
    }
};

export default UserSource;
