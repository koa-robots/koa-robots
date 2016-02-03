export default {
    "port" : 8080,
    "logger" : {
        "appenders" : [
            {
                "backups" : 4,
                "type" : "file",
                "category" : "error",
                "maxLogSize" : 10485760,
                "filename" : "error.log"
            },
            {
                "backups" : 4,
                "type" : "file",
                "category" : "access",
                "maxLogSize" : 10485760,
                "filename" : "access.log"
            }
        ]
    },
    "render" : {
        max : 100,
        cache : false
    },
    "session" : {
        "ttl" : 30 * 60 * 1000
    },
    "signedCookieKeys" : ["koa-robots"]
}
