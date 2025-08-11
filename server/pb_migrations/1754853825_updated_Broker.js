/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3323299907")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool1238311538",
    "name": "Admin",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3323299907")

  // remove field
  collection.fields.removeById("bool1238311538")

  return app.save(collection)
})
