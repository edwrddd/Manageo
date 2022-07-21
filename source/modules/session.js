const crypto = require("crypto");
const moment = require("moment");
const cron = require("cron");

class session {
    constructor() {
        this._cache = []
        return this
    }

    CreateSession(Account, Extended) {
        return new Promise(async(resolve, reject) => {
            if (!Account) { reject() }
            if (Account.SessionLimit) {
                let ToDelete = []
                for (let AuthSession in this._cache) {
                    let CurrentSession = this._cache[AuthSession]
                    if (CurrentSession.AccountId === Account.AccountId) {
                        ToDelete.push(AuthSession)
                    }
                }

                for (let Index in ToDelete) {
                    let Value = ToDelete[Index] - Index
                    this._cache.splice(Value, 1)
                }
            }

            let NewSessionId = crypto.randomBytes(32).toString("hex")
            let NewSessionLength = (Extended && (1000 * 60 * 30) || (1000 * 60 * 10))
            let NewSessionExpiration = Date.now() + NewSessionLength
            let NewSessionExpirationDate = moment(new Date()).add((Extended && 30 || 10), "m").toDate()

            let NewSession = {
                AccountId: Account.AccountId,
                SessionId: NewSessionId,
                Expiration: NewSessionExpiration
            }

            new cron.CronJob(NewSessionExpirationDate, async() => {
                for (let AuthSession in this._cache) {
                    let CurrentSession = this._cache[AuthSession]
                    if (CurrentSession.SessionId === NewSessionId) {
                        this._cache.splice(AuthSession, 1)
                        break;
                    }
                }
            }, null, true)

            this._cache.push(NewSession)
            return resolve(NewSessionId)
        })
    }

    VerifySession(SessionId) {
        return new Promise(async(resolve, reject) => {
            if (!SessionId) { reject() }
            for (let AuthSession in this._cache) {
                let CurrentSession = this._cache[AuthSession]
                if (CurrentSession.SessionId === SessionId) {
                    if (Date.now() < CurrentSession.Expiration) {
                        return resolve(CurrentSession)
                    } else{
                        this._cache.splice(AuthSession, 1);
                        return reject()
                    }
                }
            }

            return reject();
        })
    }

    EndSession(SessionId) {
        return new Promise(async(resolve, reject) => {
            if (!SessionId) { reject() }
            for (let AuthSession in this._cache) {
                let CurrentSession = this._cache[AuthSession]
                if (CurrentSession.SessionId === SessionId) {
                    this._cache.splice(AuthSession, 1);
                    return resolve();
                }
            }

            return reject();
        })
    }

    EndAllSessions(Account) {
        return new Promise(async(resolve, reject) => {
            let ToDelete = []
            for (let AuthSession in this._cache) {
                let CurrentSession = this._cache[AuthSession]
                if (CurrentSession.AccountId === Account.AccountId) {
                    ToDelete.push(AuthSession)
                }
            }

            for (let Index in ToDelete) {
                let Value = ToDelete[Index] - Index
                this._cache.splice(Value, 1)
            }
            return resolve()
        })
    }
}

module.exports = session