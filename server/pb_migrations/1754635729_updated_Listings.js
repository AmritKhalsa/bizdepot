/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number1770272360",
    "max": null,
    "min": null,
    "name": "Inquiry_Calls_Taken",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select350060700",
    "maxSelect": 1,
    "name": "Current_Stage",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Buyer Qualification",
      "Letter of Intent (LOI)",
      "Due Diligence Process",
      "Purchase Agreement Negotiation",
      "Financing Coordination",
      "In Escrow",
      "Closing & Transition",
      "Deal Closed",
      "Off Market"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date730092644",
    "max": "",
    "min": "",
    "name": "Day_Stage_Changed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
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

  // add field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3323299907",
    "hidden": false,
    "id": "relation670493011",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "Broker_Assigned",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text669692280",
    "max": 0,
    "min": 0,
    "name": "Owner_Name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "email1347873152",
    "name": "Owner_Email",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number4085973545",
    "max": null,
    "min": null,
    "name": "Owner_Phone",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3950563313",
    "max": 0,
    "min": 0,
    "name": "Description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_591651777")

  // remove field
  collection.fields.removeById("number1770272360")

  // remove field
  collection.fields.removeById("select350060700")

  // remove field
  collection.fields.removeById("date730092644")

  // remove field
  collection.fields.removeById("select2091671594")

  // remove field
  collection.fields.removeById("relation670493011")

  // remove field
  collection.fields.removeById("text669692280")

  // remove field
  collection.fields.removeById("email1347873152")

  // remove field
  collection.fields.removeById("number4085973545")

  // remove field
  collection.fields.removeById("text3950563313")

  return app.save(collection)
})
