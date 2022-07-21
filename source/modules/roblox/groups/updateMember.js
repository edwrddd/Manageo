exports.run = async(roblox, axios, identifier, target, final) => {
    return new Promise(async(resolve, reject) => {
        try {
            let GroupId = identifier
            let UserId = target
            let RoleId = await roblox.getGroupRoleId(GroupId, final)
            if (typeof(target) == "string") {
                UserId = await roblox.getUserId(target)
            }

            let AuthToken = await roblox.getAuthToken()
            axios({
                method: "patch",
                url: `https://groups.roblox.com/v1/groups/${GroupId}/users/${UserId}`,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": roblox._options.AccountCookie,
                    "x-csrf-token": AuthToken
                },
                data: {
                    "roleId": RoleId
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