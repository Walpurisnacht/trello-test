/**
 * Created by walpurisnacht on 17/06/11.
 */
const Db = require('better-sqlite3');
const Config = require('config');
const Moment = require('moment');

var db = new Db('trello.db');

function dbSync(t) {

    dbTrunc();

    var bmStmt = db.prepare('INSERT INTO board_master VALUES (@id, @idOrganization, @name, @closed)');
    var lmStmt = db.prepare('INSERT INTO list_master VALUES (@id, @idBoard, @name, @closed)');
    var cmStmt = db.prepare('INSERT INTO card_master VALUES (@id, @idBoard, @idList, @idLabels, @name, @closed)');
    var clmStmt = db.prepare('INSERT INTO chklist_master VALUES (@id, @idBoard, @idCard, @name)');
    var cimStmt = db.prepare('INSERT INTO chk_item_master VALUES (@id, @idChecklist, @name, @state)');
    var lbmStmt = db.prepare('INSERT OR IGNORE INTO label_master VALUES (@id, @idBoard, @color)');

    t.getOrgBoards(Config.get('org-id'), function (err, boards) {
        Log('SYNC START');
        boards.forEach(function (board) {
            //Preprocess
            board.closed = board.closed ? 1 : 0;
            //Sync board_master
            bmStmt.run(board);

            t.getListsOnBoard(board.id, function (err, lists) {

                lists.forEach(function (list) {
                    //Preprocess
                    list.closed = list.closed ? 1 : 0;
                    //Sync list_master
                    lmStmt.run(list);

                    t.getCardsOnList(list.id, function (err, cards) {
                        cards.forEach(function (card) {
                            //Preprocess
                            card.closed = card.closed ? 1 : 0;
                            card.idLabels = card.idLabels[0];
                            //Sync card_master
                            cmStmt.run(card);

                            card.labels.forEach(function (label) {
                                //Sync label_master
                                lbmStmt.run(label);
                            })

                            t.getChecklistsOnCard(card.id, function (err, chklss) {
                                chklss.forEach(function (chkls) {
                                    //Sync chklist_master
                                    clmStmt.run(chkls);

                                    chkls.checkItems.forEach(function (chkitem) {
                                        //Preprocess
                                        chkitem.state = (chkitem.state == 'incomplete') ? 0 : 1;
                                        //Sync chk_item_master
                                        cimStmt.run(chkitem);
                                    })
                                })
                            })
                        })
                    })
                });
            });
        });
        Log('SYNC END');
    });
}

function dbTrunc() {

    var tbl = db.prepare('SELECT * FROM sqlite_master WHERE type=@table');
    var tblList = tbl.all({table: 'table'});

    Log('TRUNCATE START');
    tblList.forEach(function (table) {
        var trunc = db.prepare('DELETE FROM ' + table.tbl_name);
        trunc.run();
    })
    Log('TRUNCATE END');
}

function Log(msg) {
    console.log('[LOG] ' + Moment().format("YYYY-MM-DD HH:mm:ss ")  +msg);
}

module.exports.dbSync = dbSync;