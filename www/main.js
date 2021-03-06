define([
    '/bower_components/chainpad-listmap/chainpad-listmap.js',
    '/bower_components/chainpad-crypto/crypto.js',
    '/bower_components/jquery/dist/jquery.min.js',
], function ( Listmap, Crypto) {
    var userName = window.prompt("What is your name?");

    // Figure out the websocket URL, this maps to the config parameter websocketURL
    var websocketURL = (''+window.location.href).replace(
        /http((s)?\:\/\/[^\/]+\/).*$/, function (all, a) {
            return 'ws' + a + 'cryptpad_websocket';
        }
    );

    var rt = Listmap.create({
        websocketURL: websocketURL,
        channel: "b87dff2e9a465f0e0ae36453d19b087c",
        data:{},
        crypto: Crypto.createEncryptor("sksyaHv+OOlQumRmZrQU4f5N"),
    });

    var $userList = $('#visitors');

    var render = function (visitors) {
        $userList.text(visitors
            .map(function (name) {
                return '* ' + name;
            }).join('\n'));
    };

    var proxy = rt.proxy.on('ready', function () {
        console.log('ready!');

        // now that the object is ready, listen for further changes
        proxy.on('change', ['guestBook'], function (oldValue, newValue, path) {
            console.log("A new user (%s) signed the guestbook", newValue);
            render(proxy.guestBook);
        }).on('disconnect', function () {
            // if the user loses their connection, inform them
            window.alert('Network connection lost!');
        });

        // initialize the guestbook, if it isn't already there
        if (!proxy.guestBook) { proxy.guestBook = []; }

        // do a little validation on your input, and
        if (typeof userName !== 'string') {
            render(proxy.guestBook);
            return;
        }

        userName = userName.trim();
        // add your name to the guestBook, if it isn't already there
        if (userName && proxy.guestBook.indexOf(userName) === -1) {
            proxy.guestBook.push(userName);
        }

        // display the current list (with your name)
        render(proxy.guestBook);
    });
});
