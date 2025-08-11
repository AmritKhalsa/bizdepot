/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3323299907")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number901924565",
    "max": null,
    "min": null,
    "name": "password",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3323299907")

  // remove field
  collection.fields.removeById("number901924565")

  return app.save(collection)
})
