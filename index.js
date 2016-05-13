'use strict';

//dependencies
var path = require('path');
var libPath = path.join(__dirname, 'lib');
var pagify = require(path.join(libPath, 'pagify'));

module.exports = function(sails) {

    function patch(context) {
        _.forEach(sails.models, function(model) {

            // Add pagify method to all models. Ignoring associative tables
            if(model.globalId) {
                pagify(model, context);
            }
        })
    }

    return {

        defaults: {
            __configKey__: {
                perPage: 10
            }
        },

        initialize: function(next) {
            var eventsToWaitFor = ['hook:orm:loaded', 'hook:pubsub:loaded'];
            sails.after(eventsToWaitFor, function() {
                patch(this);
                next();
            }.bind(this))
        }
    }
}
