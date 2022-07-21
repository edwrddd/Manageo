exports.run = async(roblox, axios) => {
    return new Promise(async(resolve, reject) => {
        try {
            let AuthToken = await roblox.getAuthToken();
            axios({
                method: "get",
                url: "https://users.roblox.com/v1/users/authenticated",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": roblox._options.AccountCookie,
                    "x-csrf-token": AuthToken
                }
            }).then(async response => {
                if (response.status == 200) {
                    let UserInfo = await roblox.getUserInfo(response.data.id)
                    return resolve(UserInfo)
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