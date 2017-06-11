const Trello = require('trello');
const Config = require('config');

var t = new Trello(Config.get('api-key'), Config.get('token'));

const DbUtils = require('./lib/dbUtils');

t.addBoard('Project 3','' , Config.get('org-id'), function (err, data) {
    console.log(data);
    DbUtils.dbSync(t);
})