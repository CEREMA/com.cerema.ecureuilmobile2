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
            '#SearchList': {
                data: {
                    AO: []
                },
                methods: {
                    thClassValue: function(id) {
                        return value = 'l' + id;
                    },
                    Star: function(star) {
                        if (star) return "star";
                        else return "star0";
                    },
                    Favorites: function(id, event) {
                        if (App.$(event.target).dom().outerHTML.indexOf('star0') > -1) {
                            App.$(event.target).removeClass('star0').addClass('star');
                            var tab = App.key.get('Favorites');
                            if (tab.indexOf(id) == -1) tab.push(id);
                            App.key.set('Favorites', tab);
                        } else {
                            var tab = App.key.get('Favorites');
                            var index = tab.indexOf(id);
                            tab.splice(index, 1);
                            App.key.set('Favorites', tab);
                            App.$(event.target).removeClass('star').addClass('star0');
                        }
                        App.DB.post('gestionao2://favorites', [{
                            userid: 614,
                            fav: JSON.stringify(App.key.get('Favorites')),
                            LastUpdate: new Date()
                        }], function(e, r) {
                            console.log(e);
                            console.log(r);
                        })
                    },
                    getDoc: function(id, event) {
                        var modal = App.$('ons-modal');
                        modal.show();
                        var fileTransfer = new FileTransfer();
                        if (device.platform == "iOS") {
                            var store = cordova.file.dataDirectory;
                        } else {
                            var store = cordova.file.externalDataDirectory;
                        }

                        var response = App.key.get('AO').query('select _BLOB from ? where IdAppelOffre=' + id);
                        response = JSON.parse(response[0]._BLOB);
                        if (response.length == 0) {
                            return false;
                        };
                        response = response[0];

                        var filename = response.filename;

                        fileTransfer.download(encodeURI('https://ecureuil.applications.siipro.fr/docs/' + response.docId + '.pdf'), store + filename, function(entry) {

                            var onShow = function() {
                                modal.hide();
                            };
                            var onClose = function() {
                                window.resolveLocalFileSystemURL(store, function(dir) {
                                    dir.getFile(filename, {
                                        create: false
                                    }, function(entry) {
                                        entry.remove(function() {

                                        });
                                    }, null, null);
                                });
                            };
                            var onMissingApp = function(appId, installer) {
                                modal.hide();
                                if (confirm("Voulez vous installer un visualisateur de PDF pour Android?")) {
                                    installer();
                                }
                            };
                            var onError = function(err) {
                                modal.hide();
                                alert("Le document n'existe pas.");
                            };

                            // Options de config pour la methode viewDocument.
                            var options = {
                                title: "-",
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

                            SitewaertsDocumentViewer.viewDocument("file://" + store + filename, "application/pdf", options, onShow, onClose, onMissingApp, onError);
                        });

                    }
                }
            }
        });
    },
    searchOnKeyUP: function(me) {
        var data = App.key.get('AO').query('select * from ? where Objet like "%' + App.$('#Search').dom().value + '%"');
        var total = data.length;
        data = data.slice(1, 25);
        for (var i = 0; i < data.length; i++) {
            if (App.key.get('Favorites').indexOf(data[i].IdAppelOffre) != -1) data[i].star = true;
        };
        App.control['#SearchList'].total = total;
        App.control['#SearchList'].AO = data;
    },
    onShow: function(me) {

    }
});