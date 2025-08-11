/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2515406498")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2091671594",
    "maxSelect": 1,
    "name": "Status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "something"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2515406498")

  // remove field
  collection.fields.removeById("select2091671594")

  return app.save(collection)
})
