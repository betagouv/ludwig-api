var path = require('path');
var fs = require('fs');

var mongoose;

exports.init = function (mongooseInstance) {

    mongoose = mongooseInstance;

    // Bootstrap models
    var modelsPath = path.join(__dirname, '../models');
    fs.readdirSync(modelsPath).forEach(function (file) {
        if (/(.*)\.(js$|coffee$)/.test(file)) {
            require(modelsPath + '/' + file);
        }
    });

};

exports.instance = function () {
    return mongoose;
};
