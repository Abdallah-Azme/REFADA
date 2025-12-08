const fs = require("fs");
const path = require("path");

const collectionPath = path.join(__dirname, "4_5886540210048605264.json");
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

function findUrls(items, prefix = "") {
  items.forEach((item) => {
    if (item.request) {
      if (item.request.url && item.request.url.raw) {
        console.log(`${item.request.method} ${item.request.url.raw}`);
      }
    }
    if (item.item) {
      findUrls(item.item, prefix ? `${prefix} > ${item.name}` : item.name);
    }
  });
}

findUrls(collection.item);
