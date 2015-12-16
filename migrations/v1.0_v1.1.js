var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dds');

require('../lib/config/mongoose').init(mongoose);
require('../lib/models/acceptanceTest');

var AcceptanceTest = mongoose.model('AcceptanceTest');

var AcceptanceTestActivity = mongoose.model('AcceptanceTestActivity');

var stream = AcceptanceTest.find().stream();

stream.on('data', function(acceptanceTest) {
    var cleanedResults = [];

    acceptanceTest.expectedResults.forEach(function(result) {
        if (result.code.indexOf('_non_calulable') == -1)
            cleanedResults.push(result);
    });

    var diff = cleanedResults.length - acceptanceTest.expectedResults.length;

    if (! diff)
        return console.log(acceptanceTest._id, 'Nothing to do');

    if (! cleanedResults.length) {
        return acceptanceTest.remove(function(err, product) {
            console.log(acceptanceTest._id, 'Deleted (all tested values removed)')
        });
    }

    acceptanceTest
        .set('expectedResults', cleanedResults)
        .save(function(err, data) {
            if (err) {
                console.log(acceptanceTest._id);
                return console.trace(err);
            }

            console.log(acceptanceTest._id, 'Removed', diff, 'obsolete values to test');
        });
});

stream.on('end', function() {
    console.log('completed!');
    process.exit();
});

stream.on('error', function(err) {
    console.trace(err);
});

