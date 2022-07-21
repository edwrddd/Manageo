exports.run = async(roblox, axios, identifier) => {
    return new Promise(async(resolve, reject) => {
        try {
            let UserId = identifier
            if (typeof(identifier) == "string") {
                UserId = await roblox.getUserId(identifier);
            }

            axios({
                method: "get",
                url: `https://groups.roblox.com/v2/users/${UserId}/groups/roles`,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async response => {
                if (response.status == 200) {
                    return resolve(response.data.data)
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