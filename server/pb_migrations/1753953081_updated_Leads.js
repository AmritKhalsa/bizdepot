/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2515406498")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date179083332",
    "max": "",
    "min": "",
    "name": "Date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2515406498")

  // remove field
  collection.fields.removeById("date179083332")

  return app.save(collection)
})
