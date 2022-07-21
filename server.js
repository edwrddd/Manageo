const express = require("express");
const axios = require("axios");

var cookies = require("cookie-parser");
var body = require("body-parser");

var server = {};
server.app = express();

server.app.use(body.urlencoded({extended: false}))
server.app.use(body.json())
server.app.use(cookies())

let backendProduction = require("./source/backend/production.json");
let frontendProduction = require("./source/frontend/production.json");

let sessionModule = require("./source/modules/session.js");
let robloxModule = require("./source/modules/roblox/container.js");

server.session = new sessionModule();
server.roblox = new robloxModule();

backendProduction.forEach(async file => {
    let requiredFile = require("./source/backend/" + file.file);
    server.app[file.method]("/api/" + file.url, async(request, response, next) => {
        requiredFile.run(server, request, response, next);
    })
})

frontendProduction.forEach(async file => {
    file.routes.forEach(async route => {
        server.app.get(route, async(request, response) => {
            if (file.auth) {
                if (request.cookies["manageo-auth"]) {
                    let CookieValue = request.cookies["manageo-auth"]
                    server.session.VerifySession(CookieValue).then(() => {
                        response.sendFile(__dirname + "/source/frontend/" + file.file);
                    }).catch(() => {
                        response.redirect("/login")
                    })
                } else {
                    response.redirect("/login")
                }
            } else {
                response.sendFile(__dirname + "/source/frontend/" + file.file);
            }
        })
    })
})

server.app.listen(1000, async() => {
    console.log("[Manageo] Listening on PORT 1000.");
})