export default {
    "port": 8080,
    "logger": {
        "enable": false,
        "appenders": [
            {
                "backups": 4,
                "type": "file",
                "category": "normal",
                "maxLogSize": 10485760,
                "filename": "error.log"
            }
        ]
    }
}