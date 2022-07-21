exports.run = async(roblox, axios) => {
    return new Promise(async(resolve, reject) => {
        if (roblox._cache.token) {
            let currentDate = Date.now()
            if (currentDate - roblox._cache.token.timestamp  < (10 * 60 * 1000)) {
                return resolve(roblox._cache.token.value)
            }
        }

        axios({
            method: "post",
            url: "https://auth.roblox.com/v2/logout",
            headers: {
                "Content-Type": "application/json",
                "Cookie": roblox._options.AccountCookie
            }
        }).then(async response => {
            roblox._cache.token = {
                timestamp: Date.now(),
                value: response.headers["x-csrf-token"]
            }
            return resolve(roblox._cache.token.value)
        }).catch(async error => {
            let response = error.response
            roblox._cache.token = {
                timestamp: Date.now(),
                value: response.headers["x-csrf-token"]
            }
            return resolve(roblox._cache.token.value)
        })
    })
}