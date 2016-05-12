define([ 'underscore', 'backbone', 'text!templates/accordion-item.html' ], function(_, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'div',
        className: 'panel panel-default',
        template: _.template(tpl),

        events: {
            "click .panel-heading": "toggle"
        },

        initialize: function () {
            this.model.set('collapse', false);
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template({ model: this.model }));

            return this;
        },

        toggle: function () {
            this.model.set('collapse', !this.model.get('collapse'));
        }
    });
});
