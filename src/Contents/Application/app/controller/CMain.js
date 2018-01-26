App.controller.define('CMain', {

    views: [
        "VMain"
    ],

    require: [
        "api.ecureuil.AO"
    ],

    models: [],

    init: function() {

        this.control({
            'VMain': {
                'view': {
                    show: this.VMain_onshow
                }
            }
        });
        App.key.unset('lastpage');
        App.init('VMain');

    },
    VMain_onshow: function() {
        App.key.set('first_time', 2);
        if (!App.key.get('settings')) {
            var settings = {};
            App.key.set('settings', {});
        } else var settings = App.key.get('settings');

        if (!App.key.get('AUTH')) {
            App.navigator.pushPage('view/VAuth/VAuth.html', { animation: "lift" });
            return;
        };

        if ((!settings.tinder) || (settings.tinder == 1)) {
            if (App.key.get('Tinder').length > 0) {
                if (App.key.get('lastpage') != "tinder") {
                    App.navigator.pushPage('view/VTinder/VTinder.html', { animation: "lift" });
                    return;
                }
            }
        };

        var modal = App.$('ons-modal');
        var AO = api.ecureuil.AO;
        var UPD = App.key.get('update');

        if (!UPD) {
            UPD = 10000;
            App.key.set('update', UPD);
        };

        if (!App.key.get('Favorites')) App.key.set('Favorites', []);

        modal.show();

        AO.getUpdate(UPD, function(record) {

            var first_import = false;
            if (!App.key.get('AO')) App.key.set('AO', []);
            if (!App.key.get('AOKeys')) {
                App.key.set('AOKeys', []);
                first_import = true;
            };
            var ao = App.key.get('AO');
            var keys = App.key.get('AOKeys');
            var ids = record.data.getFields('IdAppelOffre');
            var dkeys = ids.diff(keys);

            if (first_import === false) {
                // on ne garde que les 20 premiers
                if (dkeys.length > 0) {
                    if (App.key.get('Tinder')) var tinder = App.key.get('Tinder');
                    else var tinder = [];
                    var newones = dkeys.slice(0, 20);
                    for (var i = 0; i < newones.length; i++) {
                        if (tinder.indexOf(newones[i]) == -1) tinder.push(newones[i]);
                    };
                    App.key.set('Tinder', tinder);
                }
            };

            var dao = record.data.query('select * from ? where IdAppelOffre in (' + dkeys.join(',') + ')');

            App.key.set('AOKeys', keys.concat(dkeys));
            App.key.set('AO', ao.concat(dao));

            App.key.set('update', App.key.get('AOKeys')[App.key.get('AOKeys').length - 1]);

            modal.hide();
            App.key.set('first_timer', 2);

        });
        /*
                db = window.sqlitePlugin.openDatabase({ name: 'demo.db', location: 'default' });
                db.sqlBatch([
                    'CREATE TABLE IF NOT EXISTS DemoTable (name, score)', ['INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]],
                    ['INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]],
                ], function() {
                    console.log('Populated database OK');
                }, function(error) {
                    console.log('SQL batch ERROR: ' + error.message);
                });

                db.executeSql('SELECT count(*) AS mycount FROM DemoTable', [], function(rs) {
                    console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
                }, function(error) {
                    console.log('SELECT SQL statement ERROR: ' + error.message);
                });
        */



    }


})