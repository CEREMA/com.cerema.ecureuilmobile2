App.viewController.define('VTab1', {

    init: function() {

        this.control({
            'view': {
                show: this.onShow
            },
            '#listAO': {
                data: {
                    domains: []
                },
                methods: {
                    domain_click: this.domain_click
                }
            },
            '#qdn': {
                click: this.open_quoideneuf
            }
        });

    },
    open_quoideneuf: function() {
        App.navigator.pushPage('view/VTinder/VTinder.html', { animation: "lift" });
    },
    domain_click: function(id) {
        var response = App.key.get('AO').query('SELECT * FROM ? WHERE id_domaine=' + id);
        App.navigator.pushPage('view/VAO/VAO.html', { data: { items: response } });
    },
    onShow: function(me) {
        var interval = setInterval(function() {
            var ao = App.key.get('AO');
            if (ao) {
                if (ao.length > 0) {
                    clearInterval(interval);
                    App.control['#listAO'].domains = ao.query('SELECT * FROM ? where id_domaine is not null group by id_domaine');
                }
            }
        }, 1000);
    }

});