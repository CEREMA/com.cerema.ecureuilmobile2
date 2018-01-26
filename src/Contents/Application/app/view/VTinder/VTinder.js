App.viewController.define('VTinder', {

    require: [
        "api.ecureuil.Feed"
    ],

    init: function() {

        this.control({
            'view': {
                show: this.TinderShow
            },
            '#closebutton': {
                click: function(e) {
                    App.key.set('lastpage', 'tinder');
                    App.navigator.popPage({ animation: "lift" });
                }
            }
        });

    },
    TinderShow: function(me) {
        App.key.set('first_timer', 2);
        var ul = App.$("#TinderUL");

        var data = App.key.get('AO').query('select * from ? where IdAppelOffre in (' + App.key.get('Tinder').join(',') + ')');

        var tpl = [
            '<li id="TIN{IdAppelOffre}" class="pane">',
            '<div class="logo l{IdSource}"></div>',
            '<div class="objetT"><b>{Objet}</b></div>',
            '<br><small>{Observation}</small>',
            '</li>'
        ];

        var item = tpl.render(data);
        App.$(item).appendTo(ul);

        $("#tinderslide").jTinder({
            onDislike: function(item) {
                item = item[0].id.split('TIN')[1];
                var tinder = App.key.get('Tinder').remove(item * 1);
                console.log(tinder);
                App.key.set('Tinder', tinder);
                if (App.key.get('Tinder').length == 0) {
                    App.key.set('lastpage', 'tinder');
                    App.navigator.popPage({ animation: "lift" });
                }
            },
            onLike: function(item) {
                item = item[0].id.split('TIN')[1];
                var fav = App.key.get('Favorites');
                if (fav.indexOf(item) == -1) {
                    fav.push(item);
                };
                App.key.set('Favorites', fav);
                var tinder = App.key.get('Tinder').remove(item * 1);
                App.key.set('Tinder', tinder);
                if (App.key.get('Tinder').length == 0) {
                    App.key.set('lastpage', 'tinder');
                    App.navigator.popPage({ animation: "lift" });
                }
            },
            animationRevertSpeed: 200,
            animationSpeed: 400,
            threshold: 1,
            likeSelector: '.like',
            dislikeSelector: '.dislike'
        });
    }

});