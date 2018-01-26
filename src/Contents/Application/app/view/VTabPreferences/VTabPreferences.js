App.viewController.define('VTabPreferences', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            "#unlogin": {
                click: this.unLogin
            }
        });

    },
    unLogin: function() {
        App.DB.del('gestionao2://mobile?MobileId=' + App.key.get('AUTH'), function(r) {
            console.log(r);
        });
        App.key.unset('AUTH');
        App.key.unset('keycode');
        App.navigator.pushPage('view/VAuth/VAuth.html', { animation: "lift" });
        return;
    },
    onShow: function(me) {
        var settings = App.key.get('settings');

        function fireEvent(element, event) {
            if (document.createEventObject) {
                // dispatch for IE
                var evt = document.createEventObject();
                return element.fireEvent('on' + event, evt)
            } else {
                // dispatch for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true); // event type,bubbling,cancelable
                return !element.dispatchEvent(evt);
            }
        };
        App.$('#preferences').html(' ');
        var tpl = [
            '<ons-list-item>',
            '<div class="left">',
            '%ICON%',
            '</div>',
            '<div class="center">',
            '%TITLE%',
            '</div>',
            '<div class="right">',
            '<ons-switch id="%ID%" %VALUE%></ons-switch>',
            '</div>',
            '</ons-list-item>'
        ];
        var TPL = tpl.join('').replace('%TITLE%', 'Quoi de neuf ?');
        TPL = TPL.replace('%ID%', 'switch_qneuf');
        TPL = TPL.replace('%ICON%', '');
        if (settings.tinder == 1) TPL = TPL.replace('%VALUE%', 'checked');
        else TPL = TPL.replace('%VALUE%', '');
        App.$(TPL).appendTo(App.$('#preferences'));
        App.$('#switch_qneuf').on('change', function(p) {
            var settings = App.key.get('settings');
            if (p.value === true) settings.tinder = 1;
            else settings.tinder = 2;
            App.key.set('settings', settings);
        });
    }
});