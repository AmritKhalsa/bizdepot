/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // remove field
  collection.fields.removeById("relation79524168")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2515406498",
    "hidden": false,
    "id": "relation79524168",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "Listing",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
