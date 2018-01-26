App.viewController.define('VTab1', {

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            'ons-list#listAO': {
                click: this.listOnClick
            },
            '#qdn': {
                click: this.open_quoideneuf
            }
        });

    },
    open_quoideneuf: function() {
        App.navigator.pushPage('view/VTinder/VTinder.html', { animation: "lift" });
    },
    listOnClick: function(event) {
        var list = App.$(event.target).up('ons-list-item').attr('id');
        var data = App.key.get('AO');
        var domaine = list.split('d')[1];
        var response = data.query('SELECT * FROM ? WHERE id_domaine=' + domaine);
        App.navigator.pushPage('view/VAO/VAO.html', { data: { items: response } });
    },
    onShow: function(me) {

        var page = App.viewController[me.target.id].controls;

        function loadAO(ao) {
            for (var el in ao) {
                var item = ao[el];
                if (!item) return;
                if (!document.getElementById('d' + item.id_domaine)) {
                    if (item.nom_domaine) {
                        var domaine = document.createElement('ons-list-item');
                        domaine.setAttribute('modifier', "chevron");
                        domaine.setAttribute('tappable', ' ');
                        domaine.setAttribute('id', "d" + item.id_domaine);
                        domaine.innerHTML = item.nom_domaine;
                        App.$(domaine).appendTo(App.$('ons-list#listAO'));
                    }
                };
            };
            for (var elx in page) {
                for (var events in page[elx]) {
                    //var evt = App.viewController[me.target.id][page[elx][events]];
                    if (typeof page[elx][events] === "function") {
                        App.$(elx).on(events, page[elx][events]);
                    };
                    if (typeof page[elx][events] === "string") {
                        App.$(elx).on(events, App.viewController[me.target.id][page[elx][events]]);
                    }
                }
            }
        };
        var interval = setInterval(function() {
            var ao = App.key.get('AO');
            if (ao) {
                if (ao.length > 0) {
                    clearInterval(interval);
                    loadAO(ao);
                }
            }
        }, 1000);
    }

});