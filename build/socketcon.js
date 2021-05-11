

let sock = new WebSocket("ws://localhost:8080");


sock.onopen = function (event) {
    sock.send("Here's some text that the server is urgently awaiting!");
}

sock.onmessage = function (event) {
    try {
        msg = JSON.parse(event.data);
    } catch (Exception) {
        console.log("Exception while parsing");
        return;
    }

    // Alle 10er sind frontendupdates
    if (msg.typid >= 10 && msg.typid <= 19){
        frontendUpdate(msg.data)
        return;
    }

    switch (msg.typid){
        case 101:
            //Driver Lost Connection
            break;



    }

    


}



