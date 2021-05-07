

let sock = new WebSocket("ws://localhost:8080");


sock.onopen = function (event) {
    sock.send("Here's some text that the server is urgently awaiting!");
}

sock.onmessage = function (event) {
    msg = JSON.parse(event.data)
    console.log(msg);

    usersUpdate(msg.data.users)


}



