App.viewController.define('VTab3', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            }
        });

    },
    onShow: function(me) {
        function show() {
            var AO = App.key.get('AO');
            var keys = App.key.get('AOKeys');
            var store = {};
            var data = { items: [] };
            for (var i = 0; i < App.key.get('Favorites').length; i++) {
                var fav = App.key.get('Favorites')[i];
                fav = fav * 1;
                var key = keys.indexOf(fav);
                var ao = AO[key];
                data.items.push(ao);
            };
            data.items = data.items.query('select * from ? order by nom_domaine');
            var FAVList = App.$('#VTab3 ons-list');
            var nd = "";
            var tpl = [];
            for (var i = 0; i < data.items.length; i++) {
                if (nd != data.items[i].nom_domaine) {
                    var domaine = '<ons-list-header>' + data.items[i].nom_domaine + '</ons-list-header>';
                    nd = data.items[i].nom_domaine;
                    tpl.push(domaine);
                };

                var obs = "";
                if (data.items[i].Observation) obs = data.items[i].Observation;
                var cls = "star";
                var tpl2 = [
                    '<ons-card>',
                    '<div class="logo l' + data.items[i].IdSource + '"></div>',
                    '<div class="objet"><b>' + data.items[i].Objet + '</b></div>',
                    '<br><small>' + obs + '</small>',
                    '<br>&nbsp;<br><button id="dao' + data.items[i].IdAppelOffre + '" class="button-success pure-button">Document</button>',
                    '&nbsp;<div id="idao' + data.items[i].IdAppelOffre + '" class="favorites ' + cls + '"></div>',
                    '</ons-card>'
                ];
                tpl.push(tpl2.join(''));
            };
            App.$('#ListFavorites').dom().innerHTML = "";
            App.$(tpl.join('')).appendTo(App.$('#ListFavorites'));
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
                    App.key.set('Favorites', tab);
                    App.$(event.target).removeClass('star').addClass('star0');
                    show();
                }
            });
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
        };
        show();
    }
});