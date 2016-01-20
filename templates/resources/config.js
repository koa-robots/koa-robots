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
    }
}
