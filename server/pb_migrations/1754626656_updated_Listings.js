/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1629558190",
    "max": 0,
    "min": 0,
    "name": "Buisness_Name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3758015581",
    "max": 0,
    "min": 0,
    "name": "Confidential_Listing_Name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2817059741",
    "max": 0,
    "min": 0,
    "name": "Location",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number3583459706",
    "max": null,
    "min": null,
    "name": "Asking_Price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number948576670",
    "max": 1,
    "min": 0,
    "name": "Commission_Percentage",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3032975039",
    "max": null,
    "min": null,
    "name": "Agents_Split",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "date1198865377",
    "max": "",
    "min": "",
    "name": "Date_Listed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // remove field
  collection.fields.removeById("text1629558190")

  // remove field
  collection.fields.removeById("text3758015581")

  // remove field
  collection.fields.removeById("text2817059741")

  // remove field
  collection.fields.removeById("number3583459706")

  // remove field
  collection.fields.removeById("number948576670")

  // remove field
  collection.fields.removeById("number3032975039")

  // remove field
  collection.fields.removeById("date1198865377")

  return app.save(collection)
})
