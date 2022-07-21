exports.run = async(server, request, response, next) => {
    let cookie = await server.session.CreateSession({
        "AccountId": "abcabc",
        "SessionLimit": false
    }, false)
    response.cookie("manageo-auth", cookie, {maxAge: 1000 * 60 * 30})
    response.status(200).json({success: true, message: null})
}