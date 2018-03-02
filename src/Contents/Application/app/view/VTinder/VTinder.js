App.viewController.define('VTinder', {

    require: [

    ],

    init: function() {
        this.control({
            'view': {
                show: this.TinderShow
            },
            '#tinder-container': {
                data: {
                    ao: []
                },
                updated: this.updated,
                methods: {
                    Logo: this.logo
                }
            },
            '#closebutton': {
                click: this.closeme
            }
        });
    },
    logo: function(id) {
        return value = 'l' + id;
    },
    closeme: function() {
        App.key.set('lastpage', 'tinder');
        App.navigator.popPage({ animation: "lift" });
    },
    updated: function() {
        var buddies = App.$(".buddy").dom();
        buddies[0].style.display = "block";
        var MOVE = [];
        for (var i = 0; i < buddies.length; i++) {
            MOVE[i] = new Hammer(buddies[i]);
            MOVE[i].on("swipeleft", function(ev) {
                App.$(ev.target).up('.buddy').addClass('rotate-right').delay(200).fadeOut(300);
                if (App.$(ev.target).is(':last-child')) {
                    App.$('.buddy:nth-child(1)').removeClass('rotate-left').removeClass('rotate-right').fadeIn(300);
                } else {
                    try {
                        App.$(ev.target).up('.buddy').next().removeClass('rotate-left').removeClass('rotate-right').fadeIn(400);
                    } catch (e) {
                        App.key.set('lastpage', 'tinder');
                        App.navigator.popPage({ animation: "lift" });
                    }
                }
            });
            MOVE[i].on("swiperight", function(ev) {
                App.$(ev.target).up('.buddy').addClass('rotate-left').delay(200).fadeOut(300);
                if (App.$(ev.target).is(':last-child')) {
                    App.$('.buddy:nth-child(1)').removeClass('rotate-left').removeClass('rotate-right').fadeIn(300);
                } else {
                    try {
                        App.$(ev.target).up('.buddy').next().removeClass('rotate-left').removeClass('rotate-right').fadeIn(400);
                    } catch (e) {
                        App.key.set('lastpage', 'tinder');
                        App.navigator.popPage({ animation: "lift" });
                    }
                }
            });
        }
    },
    TinderShow: function(me) {
        App.key.set('first_timer', 2);
        App.control['#tinder-container'].ao = App.key.get('AO').query('select * from ? where IdAppelOffre in (' + App.key.get('Tinder').join(',') + ')');
    }

});