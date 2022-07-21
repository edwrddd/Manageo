const axios = require("axios");
const path = require("path")
const util = require("util");
const fs = require("fs");

var readdir = util.promisify(fs.readdir)

class Roblox {
    _internalFiles = ["/users", "/groups", "/auth"]
    constructor(options = {}) {
        this._options = options
        this._cache = {}

        const buildRoblox = async() => {
            for (let fileIndex in this._internalFiles) {
                let fileGroup = this._internalFiles[fileIndex]
                let filesInGroup = await readdir(path.join(__dirname, fileGroup))
                filesInGroup.forEach(async file => {
                    let requiredFile = require("." + fileGroup + "/" + file);
                    let fileName = file.split(".")[0];
                    this[fileName] = async (...args) => {
                        return requiredFile.run(this, axios, ...args)
                    }
                })
            }
        }
        
        buildRoblox()

        return this
    }
}

module.exports = Roblox