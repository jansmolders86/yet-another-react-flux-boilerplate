const origin = 'http://localhost:3000';
const urls = {
  dbUpdateUser: `${origin}/updateUser`,
  dbLogin: `${origin}/auth/login`,
  dbRegister: `${origin}/auth/register`,
  dbLogoutUser: `${origin}/logout`,
  dbUsers: `${origin}/users`
};


module.exports = urls;
