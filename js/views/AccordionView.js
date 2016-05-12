define([ 'underscore', 'backbone', 'views/AccordionItemView' ], function(_, Backbone, AccordionItemView) {
    return Backbone.View.extend({
        initialize: function () {
            this.listenTo(this.collection, 'reset add remove', this.render);
        },

        render: function () {
            this.$el.html('');

            this.collection.each(function (model) {
                this.$el.append((new AccordionItemView({ model: model })).render().$el);
            }, this);

            return this;
        }
    });
});
