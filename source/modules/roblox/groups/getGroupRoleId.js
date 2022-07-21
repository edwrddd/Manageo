exports.run = async(roblox, axios, identifier, final) => {
    return new Promise(async(resolve, reject) => {
        try {
            let groupRoles = await roblox.getGroupRoles(identifier)
            for (let roleIndex in groupRoles.roles) {
                let currentRole = groupRoles.roles[roleIndex]
                let comparison = ""
                if (typeof(final) == "string") { comparison = "name" }
                    else { comparison = "rank" }

                if (currentRole[comparison] == final) {
                    return resolve(currentRole.id)
                } else if (roleIndex == groupRoles.roles.length - 1) {
                    return reject()
                }
            }
        } catch(error) {
            return reject(error)
        }
    })
}