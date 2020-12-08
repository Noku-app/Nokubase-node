/*
 * Copyright (c) 2020 Xemplar Softworks LLC (https://xemplarsoft.com)
 * Copyright (c) 2020 Noku App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let databasemod = require("./src/abstraction").database
let config = require("./config.json")
let database = new databasemod({config: config, clean: true})
database.insertHashed("tobi@gm", "asish", 123)
let e = database.isEmailTaken("tobi", async (taken) => {console.log(taken)})
database.registerUser({email: "tobi", uid: 19382})
console.log(e)
database.isEmailTaken("tobi", async (taken) => {console.log(taken)})
