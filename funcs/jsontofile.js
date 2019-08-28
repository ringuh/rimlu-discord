
module.exports = (obj, filename = 'json.tmp') => {
    const fs = require('fs')

    console.log(obj)
    var cache = [];
    fs.writeFile(filename, JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 4), function (err) {
        if (err) throw err;
    });

    cache = null
}