require.config({
    paths: {
        jquery: 'libs/jquery',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text.require'
    }
});

require([ 'jquery', 'router' ], function ($, Router) {
    $(document).ready(function () {
        new Router();

        Backbone.history.start({ pushState: true });
        if (Backbone.history && Backbone.history._hasPushState) {
            $(document).delegate("a", "click", function(evt) {
                var href = $(this).attr("href");
                var protocol = this.protocol + "//";

                if (href.slice(protocol.length) !== protocol) {
                    evt.preventDefault();

                    Backbone.history.navigate(href, true);
                }
            });
        }
    });
});