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

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

            console.log('file system open: ' + fs.name);
            fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function(fileEntry) {

                console.log("fileEntry is file?" + fileEntry.isFile.toString());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                writeFile(fileEntry, null);

            }, function(err) {
                console.log(err);
            });

        }, function(e, r) {

        });
    }

});