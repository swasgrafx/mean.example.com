var config = {};
config.session = {};
config.cookie = {};

//database
config.mongodb = 'mongodb://localhost/mean-cms';

//session
config.session.secret = 'monkey';
 
//cookie
config.cookie.domain = 'localhost';

module.exports = config;