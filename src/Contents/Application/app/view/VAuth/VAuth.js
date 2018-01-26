App.viewController.define('VAuth', {
    require: [
        "api.ecureuilmobile.MyService",
        "api.ecureuil.AO"
    ],
    init: function() {

        this.control({
            'view': {
                show: this.onShow
            }
        });

    },
    onShow: function() {
        var settings = App.key.get('settings');

        function getID() {
            App.DB.post('gestionao2://mobile', [{
                MobileId: App.key.get('keycode')
            }], function(r) {
                var IO = new App.IO('http://ecureuil.applications.siipro.fr');
                IO.on('connect', function() {
                    console.log('connected.');
                    IO.subscribe('#' + App.key.get('keycode'));
                    IO.on('#' + App.key.get('keycode'), function() {
                        App.$('.keycode').html('OK !');
                        App.DB.post('gestionao2://mobile', {
                            MobileId: App.key.get('keycode'),
                            Synchro: 1
                        }, function(e, r) {
                            if (e.affectedRows == 1) {
                                IO.send('#' + App.key.get('keycode') + 'OK', true, "*");
                                App.key.set('AUTH', App.key.get('keycode'));
                                App.key.set('Tinder', []);
                                setTimeout(function() {
                                    settings.tinder = 0;
                                    App.navigator.popPage({ animation: "lift" });
                                }, 1000);
                            }
                        });
                    });
                });

            });

        };
        var MyService = api.ecureuilmobile.MyService;
        if (!App.key.get('keycode')) {
            MyService.genID({}, function(value) {
                App.$('.keycode').html(value);
                App.key.set('keycode', value);
                getID();
            });
        } else {
            App.$('.keycode').html(App.key.get('keycode'));
            getID();
        }
    }

});