## Structure

{
    id: [ number ],
    data: JSONObject 
}

Im folgenden
[ id ]: [ name ]
[ data ]


## Server -> Client Packages

1: General Kenobi
{
    "General Kenobi":true
}

10: Frontend Update
{
    "users": [{"name": string, "uuid": string, "pos":int, "lastseen":number(Optonal)}, ...],
    "achievements": [{"id":string, "name":string, "active":bool}],
    "controller": {"uuid":string, "time",number},
    "profile": {"name": string, "uuid": string, "pos":int},
}


11: Frontend Update (Users)
{
    "users": [{"name": string, "uuid": string, "pos":int, "lastseen":number(Optonal)}, ...]
}

12: Frontend Update (Achievements)
{
    "achievements": [{"id":string, "name":string, "active":bool}],
}

13: Frontend Update (Controller)
{
    "controller": {"uuid":string, "time",number},
}

14: Frontend Update (Profile)
{
    "profile": {"name": string, "uuid": string, "pos":int},
}

### Events

101: Driver Lost Connection
{
    "uuid": string
}

102: Driver Remove
{}

103: Driver Rejoin
{
    "uuid": string
}

104: Stopline Event
{
    "uuid": string
}

105: Youre Driver
{}

## Client -> Server Packages


0: Keyboard update
{"a": true, "s":true, "up":false ...}

2: UUID Welcome
{
    "uuid":string
}

### Error

201: NoFrontend
{}



