import bcrypt from 'bcryptjs';
import dataFacade from '../models/dataFacade';
import config from '../constants/config';

let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync(config.masterAdminPassword, salt);

dataFacade.addUser({username : config.masterAdminUsername, password: hash, permission: "admin"});
