App.viewController.define('VAO', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            '#closebutton': {
                click: function(e) {
                    App.$('#Navigator').dom().popPage().catch(function() {});
                }
            }
        });

    },
    onShow: function(me) {

        var data = me.target.data;
        var dta = me.target.querySelectorAll('data');
        data.domaine = data.items[0].nom_domaine;
        for (var i = 0; i < dta.length; i++) {
            if (dta[i].getAttribute('id')) dta[i].outerHTML = data[dta[i].getAttribute('id')];
            if (dta[i].getAttribute('store')) {
                var sto = me.target.data[dta[i].getAttribute('store')];
                var tpl = dta[i].getAttribute('tpl');
                for (var j = 0; j < sto.length; j++) {
                    App.$('<ons-list-item></ons-list-item>').appendTo(dta[i]);
                }
            }
        };
        var AOList = App.$('#AOList').dom();
        AOList.delegate = {
            createItemContent: function(i) {
                var obs = "";

                if (data.items[i].Observation) obs = data.items[i].Observation;
                var cls = "star0";
                var tab = App.key.get('Favorites');

                var favorites = App.key.get('Favorites');

                if (favorites.indexOf(data.items[i].IdAppelOffre.toString()) > -1) {
                    cls = "star";
                };
                var tpl = [
                    '<ons-card>',
                    '<div class="logo l' + data.items[i].IdSource + '"></div>',
                    '<div class="objet"><b>' + data.items[i].Objet + '</b></div>',
                    '<br><small>' + obs + '</small>',
                    '<br>&nbsp;<br><button id="dao' + data.items[i].IdAppelOffre + '" class="button-success pure-button">Document</button>',
                    '&nbsp;<div id="idao' + data.items[i].IdAppelOffre + '" class="favorites ' + cls + '"></div>',
                    '</ons-card>'
                ];
                return ons.createElement(tpl.join(''));
            },
            countItems: function() {
                return data.items.length;
            }
        };
        AOList.refresh();

        App.$('.pure-button').on('click', function(event) {
            var id = event.target.id.split('dao')[1];
            var response = data.items.query('select _BLOB from ? where IdAppelOffre=' + id);
            if (response.length == 0) return alert('Le document est introuvable');
            response = JSON.parse(response[0]._BLOB);
            var url = 'http://ecureuil.applications.siipro.fr/docs/' + response[0].docId;
            var filename = response[0].filename;
            var modal = App.$('ons-modal');
            if (device.platform == "Android") {
                window.openFileNative.open(url);
            }
            if (device.platform == "iOS") {
                App.file.load(url, function(error, response) {
                    console.log(error);
                    console.log(response);

                    //var entry = this.result;
                    // Options de config pour la methode viewDocument.
                    var options = {
                        title: "Appel d'offre",
                        email: {
                            enabled: true
                        },
                        print: {
                            enabled: true
                        },
                        openWith: {
                            enabled: true
                        },
                        search: {
                            enabled: true
                        }
                    };
                    var onShow = function() {

                    };
                    var onClose = function() {

                    };
                    var onMissingApp = function() {

                    };
                    var onError = function() {

                    };
                    modal.hide();
                    // Plugin pour ouvrire les pdf native IOS.
                    SitewaertsDocumentViewer.viewDocument(response.nativeURL, "application/pdf", options, onShow, onClose, onMissingApp, onError);
                });
            };

        });
        App.$('.favorites').on('click', function(event) {
            if (App.$(event.target).dom().outerHTML.indexOf('star0') > -1) {
                App.$(event.target).removeClass('star0').addClass('star');
                var id = event.target.id.split('idao')[1];
                var tab = App.key.get('Favorites');
                if (tab.indexOf(id) == -1) tab.push(id);
                App.key.set('Favorites', tab);
            } else {
                var id = event.target.id.split('idao')[1];
                var tab = App.key.get('Favorites');
                var index = tab.indexOf(id);
                console.log(index);
                tab.splice(index, 1);
                console.log(tab);
                App.key.set('Favorites', tab);
                App.$(event.target).removeClass('star').addClass('star0');
            }
        });

    }
});