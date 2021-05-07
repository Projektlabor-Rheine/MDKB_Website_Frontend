

let sock = new WebSocket("ws://localhost:8080");


sock.onopen = function (event) {
    sock.send("Here's some text that the server is urgently awaiting!");
}

sock.onmessage = function (event) {
    console.log(event.data);
    console.log(JSON.parse(event.data));
}



