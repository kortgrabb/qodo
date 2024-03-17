/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ihfscesenx6blwl")

  // remove
  collection.schema.removeField("kfsamo5y")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ihfscesenx6blwl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kfsamo5y",
    "name": "todos",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
})
