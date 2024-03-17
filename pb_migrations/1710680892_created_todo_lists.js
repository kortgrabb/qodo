/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ihfscesenx6blwl",
    "created": "2024-03-17 13:08:12.778Z",
    "updated": "2024-03-17 13:08:12.778Z",
    "name": "todo_lists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qkqxzxst",
        "name": "import_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ihfscesenx6blwl");

  return dao.deleteCollection(collection);
})
