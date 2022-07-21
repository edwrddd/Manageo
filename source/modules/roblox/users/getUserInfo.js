exports.run = async(roblox, axios, identifier) => {
    return new Promise(async(resolve, reject) => {
        try {
            let UserId = identifier
            if (typeof(identifier) == "string") {
                UserId = await roblox.getUserId(identifier)
            }

            axios({
                method: "get",
                url: `https://www.roblox.com/users/profile/profileheader-json?userId=${UserId}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(async response => {
                if (response.status == 200) {
                    return resolve(response.data)
                } else {
                    return reject(`An unexpected error occured:: status code ${response.status}`)
                }
            }).catch(async error => {
                return reject(error);
            })
        } catch(error) {
            return reject(error)
        }
    });
}