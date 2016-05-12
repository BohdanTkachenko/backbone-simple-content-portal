define([ 'backbone', 'config', 'models/MenuItem' ], function(Backbone, config, MenuItem) {
    return Backbone.Collection.extend({
        model: MenuItem,
        url: config.apiBaseUrl + 'menu&callback=?',

        setActive: function (name) {
            this.map(function (item) {
                item.set('active', item.get('name') === name);
            });
        }
    });
});
