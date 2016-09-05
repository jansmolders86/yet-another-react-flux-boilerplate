import alt from '../core/alt';
import UserActions from '../actions/UserActions';
import UserSource from '../sources/UserSource';
import { datasource } from 'alt-utils/lib/decorators';

/**
 * user profile and operations
 */
@datasource(UserSource)
class UserStore {

  constructor() {
    // real-auth
    this.user = {
      id: null,
      token: null,
      username: null,
      isAdmin: false,
      isLoggedIn: false,
      showModal: false,
      users: [],
      loginMessage: null
    };

    this.exportPublicMethods({
      isLoggedIn: this.isLoggedIn,
      isAdmin: this.isAdmin,
    });

    this.bindActions(UserActions);
  }

  // Calls

  onLogin(user) {
    this.getInstance().login(user);
  }

  onRegister(user) {
    this.getInstance().register(user);
  }

  onFetchUsers() {
    this.getInstance().fetchUsers();
  }

  updateUser(user) {
    this.getInstance().updateUser(user);
  }

  onLogout() {
    this.getInstance().logout();
  }

  isLoggedIn() {
    const username = this.getState().username;
    if(username !== undefined && username !== null){
      return true;
    } else {
      return false;
    }
  }

  // Helpers

  isAdmin() {
    const admin = this.getState().isAdmin;
    if(this.getState().isAdmin  === undefined){
      return false;
    }
    return admin;
  }

  getUsername() {
    const st = this.getState().user;
    return st.username;
  }

  // Success handling

  onUserSuccess(res){
    if(res.status === 200){
      let admin = false;
      if (res.data.permission === 'admin') {
        admin = true
      }
      this.setState({
        id: res.data._id,
        username: res.data.username,
        isAdmin: admin,
        isLoggedIn: true,
        loginMessage: null,
        showModal: false
      });
    }
  }

  onUserUpdateSuccess(res){
    if(res.status === 200){
      this.getInstance().fetchUsers();
    }
  }

  onUsersSuccess(res){
    if(res.status === 200){
      this.setState({
        users: res.data
      });
    }
  }

  onLogoutSuccess(){
    this.setState({
      username: null,
      isAdmin: false,
      isLoggedIn: false,
      showModal: false
    });
    window.location.replace('/');
  }

  // error handling
  onUserError(res){
    this.setState({
      loginMessage: 'loginError'
    });
  }

  onUsersError(err){
  }

  onUserUpdateError(err){
  }

  onLogoutError(err){
  }

}

export default alt.createStore(UserStore, 'UserStore');

