App.viewController.define('VAO', {

    require: [

    ],

    init: function() {

        this.control({
            'view': {
                show: this.onShow,
                hide: this.onHide
            },
            '#AOList': {
                data: {
                    AO: [],
                    domaine: ""
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
                        var fav = App.key.get('Favorites');
                        if (fav.indexOf(id) == -1) {
                            App.$(event.target).removeClass('star0').addClass('star');
                            fav.push(id);
                            App.key.set('Favorites', fav);
                        } else {
                            App.$(event.target).removeClass('star').addClass('star0');
                            fav.remove(id);
                            App.key.set('Favorites', fav);
                        };
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
            },
            '#closebutton': {
                click: function(e) {
                    App.$('#Navigator').dom().popPage().catch(function() {});
                }
            }
        });

    },
    onHide: function() {
        App.control['#AOList'].AO = [];
    },
    onShow: function(me) {

        var data = me.target.data;
        var dta = me.target.querySelectorAll('data');
        data.domaine = data.items[0].nom_domaine;
        var data = App.key.get('AO').query('SELECT * FROM ? WHERE id_domaine=' + data.items[0].id_domaine);
        for (var i = 0; i < data.length; i++) {
            if (App.key.get('Favorites').indexOf(data[i].IdAppelOffre) != -1) data[i].star = true;
        };
        App.control['#AOList'].AO = data;
        App.control['#AOList'].domaine = data[0].nom_domaine;

    }
});