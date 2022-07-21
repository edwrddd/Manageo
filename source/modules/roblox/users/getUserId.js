exports.run = async(roblox, axios, identifier) => {
    return new Promise(async(resolve, reject) => {
        axios({
            method: "post",
            url: "https://users.roblox.com/v1/usernames/users",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "usernames": [identifier],
                "excludeBannedUsers": true
            }
        }).then(async response => {
            if (response.status == 200) {
                if (response.data.data) {
                    let loadedUserData = response.data.data[0].id;
                    return resolve(loadedUserData)
                }
            } else {
                return reject(`An unexpected error occured:: status code ${response.status}`)
            }
        }).catch(async error => {
            return reject(error)
        })
    })
}