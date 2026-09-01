const fs = require('fs');
const data = JSON.parse(fs.readFileSync('MR_SANTOSH_FINAL_356_API.postman_collection (2).json', 'utf8'));

function findEndpoint(item, path) {
    if (item.request && item.request.url && item.request.url.raw && item.request.url.raw.includes(path)) {
        console.log(`Method: ${item.request.method}`);
        console.log(`URL: ${item.request.url.raw}`);
    }
    if (item.item) {
        item.item.forEach(subItem => findEndpoint(subItem, path));
    }
}

data.item.forEach(item => findEndpoint(item, 'restaurant-panel'));
