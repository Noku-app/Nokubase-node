//let databasemod = require("./src/abstraction").database
//let config = require("./config.json")
//let database = new databasemod({config: config, clean: true})
//database.insertHashed("tobi@gm", "asish", 123)
//let e = database.isEmailTaken("tobi", async (taken) => {console.log(taken)})
//database.registerUser({email: "tobi", uid: 19382})
//console.log(e)
//database.isEmailTaken("tobi", async (taken) => {console.log(taken)})

module.exports = {
    database: require("./src/abstraction").database
}