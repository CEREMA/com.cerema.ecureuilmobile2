App.viewController.define('VTabPreferences', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            '#preferences': {
                data: {
                    prefs: []
                },
                methods: {
                    checkboxVal: this.onCheck
                }
            },
            "#unlogin": {
                click: this.unLogin
            }
        });

    },
    onCheck: function(p, id) {
        var settings = App.key.get('settings');
        settings[id.split('switch_')[1]] = p;
        App.key.set('settings', settings);
    },
    unLogin: function() {
        App.DB.del('gestionao2://mobile?MobileId=' + App.key.get('AUTH'), function(r) {
            App.key.unset('AUTH');
            App.key.unset('keycode');
            App.navigator.pushPage('view/VAuth/VAuth.html', { animation: "lift" });
        });
    },
    onShow: function(me) {
        var settings = App.key.get('settings');
        App.control['#preferences'].prefs = [{
            id: "switch_tinder",
            icon: "",
            title: "Quoi de neuf ?",
            checked: settings.tinder
        }];
    }
});