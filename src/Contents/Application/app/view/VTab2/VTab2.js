App.viewController.define('VTab2', {

    require: [

    ],

    init: function() {
        this.control({
            'view': {
                show: this.onShow
            },
            '#Search': {
                keyup: this.searchOnKeyUP
            },
            '#SearchDomaines': {
                click: function() {
                    App.$('#SEARCH').dom().innerHTML = "";
                    App.$('#Search').dom().value = "";
                }
            }
        });
    },
    searchOnKeyUP: function(me) {

        if (!App.key.set('search.domaine')) App.key.set('search.domaine', 1);
        var AO = App.key.get('AO');
        var data = AO.query('select * from ? where Objet like "%' + App.$('#Search').dom().value + '%" and id_domaine=' + App.key.get('search.domaine'));
        App.$('#SEARCH').dom().innerHTML = "";
        App.$('<ons-list-header>' + data.length + ' résultat(s)</ons-list-header><ons-list><ons-lazy-repeat id="SAOList"></ons-lazy-repeat></ons-list>').appendTo(App.$('#SEARCH'));
        var AOList = App.$('#SAOList').dom();
        AOList.delegate = {
            createItemContent: function(i) {
                var obs = "";

                if (data[i].Observation) obs = data[i].Observation;
                var cls = "star0";
                var tab = App.key.get('Favorites');

                var favorites = App.key.get('Favorites');

                if (favorites.indexOf(data[i].IdAppelOffre.toString()) > -1) {
                    cls = "star";
                };

                var tpl = [
                    '<ons-card>',
                    '<div class="logo l' + data[i].IdSource + '"></div>',
                    '<div class="objet"><b>' + data[i].Objet + '</b></div>',
                    '<br><small>' + obs + '</small>',
                    '<br>&nbsp;<br><button id="dao' + data[i].IdAppelOffre + '" class="button-success pure-button">Document</button>',
                    '&nbsp;<div id="idao' + data[i].IdAppelOffre + '" class="favorites ' + cls + '"></div>',
                    '</ons-card>'
                ];
                return ons.createElement(tpl.join(''));
            },
            countItems: function() {
                return data.length;
            }
        };
        AOList.refresh();
        App.$('.favorites').on('click', function(event) {
            if (App.$(event.target).dom().outerHTML.indexOf('star0') > -1) {
                App.$(event.target).removeClass('star0').addClass('star');
                console.log(event.target.id);
                var id = event.target.id.split('dao')[1];
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
        App.$('.pure-button').on('click', function(event) {
            var id = event.target.id.split('idao')[1];

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
    },
    onShow: function(me) {
        var p = this;
        var domaines = [];
        var AO = App.key.get('AO');
        var data = AO.query('select id_domaine,nom_domaine from ?  group by nom_domaine,id_domaine order by nom_domaine');

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (!App.$('#search-domaines' + i).dom()) {
                App.$('<ons-list-item id="search-domaines' + i + '" tappable>').appendTo(App.$('#SearchDomaines'));
                var el = App.$('#search-domaines' + i);
                el.on('click', function() {
                    ApplicationCache.domaine = item.id_domaine;
                    App.key.set('search.domaine', item.id_domaine);
                });
                var label = App.$('<label>');
                label.dom().className = "left";
                label.appendTo(el);
                if (i == 0) var checked = "checked";
                else var checked = "";
                App.$('<ons-radio name="radio" input-id="radio' + item.id_domaine + '" ' + checked + '>').appendTo(label);
                App.$('<label class=center for="radio' + item.id_domaine + '">' + item.nom_domaine + '</label>').appendTo(el);
            }
        };

    }
});