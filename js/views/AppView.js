define([
    'underscore', 'backbone',
    'views/MenuView',
    'views/TabView',
    'views/AccordionView',
    'text!templates/layout.html'
], function(_, Backbone, MenuView, TabView, AccordionView, tpl) {
    return Backbone.View.extend({
        template: _.template(tpl),

        initialize: function (opts) {
            this.menuCollection = opts.menuCollection;
            this.tabCollection = opts.tabCollection;
            this.accordionCollection = opts.accordionCollection;

            this.renderLayout();

            this.menuView = new MenuView({ collection: this.menuCollection });
            this.tabView = new TabView({ el: '#tabs', collection: this.tabCollection });
            this.accordionView = new AccordionView({ el: '#accordions', collection: this.accordionCollection });

            this.render();
        },

        renderLayout: function () {
            this.$el.html(this.template());
        },

        render: function () {
            this.$el.find('#menu').html(this.menuView.render().el);
            this.tabView.render();
            this.accordionView.render();

            return this;
        }
    });
});
