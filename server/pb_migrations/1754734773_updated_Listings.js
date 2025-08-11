/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // add field
  collection.fields.addAt(17, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url1621885554",
    "name": "BizBuySell_Listing_Link",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url54601144",
    "name": "BizDepot_Listing_Link",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url3207746910",
    "name": "Drive_Link",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // remove field
  collection.fields.removeById("url1621885554")

  // remove field
  collection.fields.removeById("url54601144")

  // remove field
  collection.fields.removeById("url3207746910")

  return app.save(collection)
})
