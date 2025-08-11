/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "select2091671594",
    "maxSelect": 1,
    "name": "Status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "On Track",
      "At Risk",
      "Off Track",
      "Completed"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "select2091671594",
    "maxSelect": 1,
    "name": "Status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "On Track"
    ]
  }))

  return app.save(collection)
})
