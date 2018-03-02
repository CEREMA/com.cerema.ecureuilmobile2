App.viewController.define('VTab3', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            '#ListFavorites': {
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

                            SitewaertsDocumentViewer.viewDocument(store + filename, "application/pdf", options, onShow, onClose, onMissingApp, onError);
                        });

                    },
                    Favorites: this.setFavorites
                }
            }
        });

    },
    setFavorites: function(id, event) {
        var fav = App.key.get('Favorites');
        App.$(event.target).removeClass('star').addClass('star0');
        fav.remove(id);
        App.key.set('Favorites', fav);
        var AO = App.key.get('AO').query('SELECT * FROM ? WHERE IdAppelOffre in (' + App.key.get('Favorites').join(',') + ')');
        for (var i = 0; i < AO.length; i++) AO[i].star = true;
        App.control['#ListFavorites'].AO = AO;
        App.DB.post('gestionao2', {
            userid: 614,
            fav: JSON.stringify(App.key.get('Favorites')),
            LastUpdate: new Date()
        })
    },
    onShow: function(me) {
        var AO = App.key.get('AO').query('SELECT * FROM ? WHERE IdAppelOffre in (' + App.key.get('Favorites').join(',') + ')');
        for (var i = 0; i < AO.length; i++) AO[i].star = true;
        App.control['#ListFavorites'].AO = AO;
    }
});