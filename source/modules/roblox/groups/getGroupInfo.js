const { response } = require("express")

exports.run = async(roblox, axios, identifier) => {
    return new Promise(async(resolve, reject) => {
        try {
            axios({
                method: "get",
                url: `https://groups.roblox.com/v1/groups/${identifier}`,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async response => {
                if (response.status == 200) {
                    return resolve(response.data)
                } else {
                    return reject(`An unexpected error occured:: status code ${response.status}`)
                }
            }).catch(async error => {
                return reject(error)
            })
        } catch(error) {
            return reject(error)
        }
    })
}