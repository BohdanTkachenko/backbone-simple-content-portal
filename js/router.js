define([
    'jquery',
    'underscore',
    'backbone',

    'collections/MenuCollection',
    'collections/TabCollection',

    'views/AppView'
], function($, _, Backbone, MenuCollection, TabCollection, AppView){
    return Backbone.Router.extend({
        initialize: function (opts) {
            this.menuCollection = new MenuCollection();
            this.tabCollection = new TabCollection();
            this.accordionCollection = new Backbone.Collection();

            this.appView = new AppView({
                el: 'body',
                menuCollection: this.menuCollection,
                tabCollection: this.tabCollection,
                accordionCollection: this.accordionCollection
            });

            this.menuCollection.on('change reset add remove', this.setActiveMenu, this);
            this.tabCollection.on('change reset add remove', this.setActiveTab, this);
            this.accordionCollection.on('reset', this.updateAccordionsCollection, this);
            this.accordionCollection.on('change', this.updateAccordionsUrl, this);
        },

        routes: {
            ':menuItem(/)': 'showMenuItem',
            ':menuItem/:tab(/)': 'showTab',
            ':menuItem/:tab/:accordions(/)': 'showAccordions',
            '*actions': 'defaultAction'
        },

        defaultAction: function () {
            var me = this;

            this.currentMenu = null;
            this.currentTab = null;
            this.currentAccordions = null;

            this.menuCollection.fetch({
                success: function () {
                    me.navigate(me.menuCollection.first().get('name'), { trigger: true });
                }
            });
        },

        showMenuItem: function (menu) {
            var me = this;

            this.currentMenu = menu;
            this.currentTab = null;
            this.currentAccordions = null;

            this.menuCollection.setActive(this.currentMenu);

            this.menuCollection.fetch();
            this.tabCollection.fetch({
                data: { menu: menu },
                success: function () {
                    me.navigate(menu + '/' + me.tabCollection.first().get('name'), { trigger: true });
                }
            });
        },

        showTab: function (menu, tab) {
            var me = this;

            this.currentMenu = menu;
            this.currentTab = tab;
            this.currentAccordions = null;

            this.menuCollection.setActive(this.currentMenu);
            this.tabCollection.setActive(this.currentTab);

            this.menuCollection.fetch();
            this.tabCollection.fetch({
                data: { menu: menu },
                success: function () {
                    me.accordionCollection.reset(me.tabCollection.find(function (item) {
                        return item.id === tab;
                    }).get('data'));

                    var accordionNames = me.accordionCollection.map(function (item) {
                        return item.get('name');
                    });

                    me.navigate(menu + '/' + tab + '/' + accordionNames.join(','), { trigger: true });
                }
            });
        },

        showAccordions: function (menu, tab, accordions) {
            var me = this;

            this.currentMenu = menu;
            this.currentTab = tab;
            this.currentAccordions = accordions.split(',');

            this.menuCollection.setActive(this.currentMenu);
            this.tabCollection.setActive(this.currentTab);

            this.accordionCollection.off('change', this.updateAccordionsUrl);

            this.menuCollection.fetch();
            this.tabCollection.fetch({
                data: { menu: menu },
                success: function () {
                    me.accordionCollection.reset(me.tabCollection.find(function (item) {
                        return item.id === tab;
                    }).get('data'));

                    me.accordionCollection.on('change', me.updateAccordionsUrl, me);
                }
            });
        },

        setActiveMenu: function () {
            this.menuCollection.setActive(this.currentMenu);
        },

        setActiveTab: function () {
            this.tabCollection.setActive(this.currentTab);
        },

        updateAccordionsCollection: function () {
            this.accordionCollection.map(function (model) {
                model.set('collapse', (this.currentAccordions || []).indexOf(model.get('name')) === -1);
            }, this);
        },

        updateAccordionsUrl: function () {
            this.currentAccordions = this.accordionCollection.filter(function (model) {
                return model.get('collapse') === false;
            }).map(function (model) {
                return model.get('name');
            });

            this.navigate(this.currentMenu + '/' + this.currentTab + '/' + this.currentAccordions.join(','));
        }
    });
});