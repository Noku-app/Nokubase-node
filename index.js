let databasemod = require("./src/abstraction").database
let config = require("./config.json")
console.log(config)
let database = new databasemod({config: config})
database.insertHashed("tobi@gm", "asish", 123)