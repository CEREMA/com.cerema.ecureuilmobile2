App.application({

    name: Settings.NAMESPACE,

    controllers: Settings.CONTROLLERS,
    viewControllers: [
        'VTab1',
        'VAO',
        'VTinder',
        'VAuth',
        'VTab3',
        'VTab2',
        'VTabPreferences'
    ],
    modules: Settings.MODULES,

    launch: function() {
        App.key.set('first_timer', '1');
    }

});