const fs = require('fs');
const data = JSON.parse(fs.readFileSync('MR_SANTOSH_FINAL_356_API.postman_collection (2).json', 'utf8'));
function find(item) {
    if (item.request && item.request.url && item.request.url.raw && item.request.url.raw.includes('/retailer')) {
        console.log(`${item.request.method} ${item.request.url.raw}`);
    }
    if (item.item) item.item.forEach(find);
}
data.item.forEach(find);
