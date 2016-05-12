define([ 'underscore', 'backbone', 'text!templates/menu.html' ], function(_, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'ul',
        className: 'nav nav-sidebar',
        template: _.template(tpl),

        initialize: function () {
            this.listenTo(this.collection, 'change reset add remove', this.render);
        },

        render: function () {
            this.$el.html(this.template({ collection: this.collection }));

            return this;
        }
    });
});
