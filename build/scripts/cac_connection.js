class CACConnection{

    keyboard = {
        "w": false,
        "a": false,
        "s": false,
        "d": false,
        "up": false,
        "down": false,
        "right": false,
        "left": false, 
    }

    /**
     * 
     * @param {String} url the url of the access-point on the cac-server 
     */
    constructor(url,onGameSync, onEventHandler){
        this.url = url;
        this.onGameSync = onGameSync;
        this.onEventHandler = onEventHandler;
    }

    /**
     * Starts the connection to the backend-server. Automatically performs restart on disconnect
     */
    startConnection(){
        console.log("Starting to connect...");
        try {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = (evt) => this._onConnect(evt);
            this.socket.onclose = (evt) => this._onDisconnect(evt);
            this.socket.onmessage = (evt) => this._onPacketReceived(evt);
            
        } catch(e){
            console.log("Error: "+e);
        }
    }

    /**
     * Event handler for the connect event
     */
    _onConnect(_){

        $("#inlineventholder").animate({opacity: 0}, 200, "swing");


        // if (uuid == "") {
        //     this.socket.send("Hello there");
        // }else {
        //     this.socket.send(this.createPackage(2, {"uuid": uuid}))
        // }

    }

    /**
     * Event handler for the disconnect event
     */
    _onDisconnect(_){

        // Restarts the connection
        setTimeout(this.startConnection.bind(this), 2000);

        // Log
        console.log("Disconnected");

    }

    /**
     * Event handler for the packet-receive event
     */
    _onPacketReceived(evt) {
        try {
            // Parses the packet
            var pkt = JSON.parse(evt.data);
            
            // Checks if the packet is a game-sync packet (Init, achievement, controller or players)
            if (pkt.id >= 10 && pkt.id <= 19){
                // Execute the callback
                this.onGameSync(pkt);
                return;
            }

            // Checks for an Event Package
            if (pkt.id >= 100 && pkt.id <= 200){
                this.onEventHandler(pkt);
                return;
            }
    
            // Checks the exact packet-id NOT USED YET
            switch (pkt.id){
                case 1:
                    throw "GeneralKenobiException"
                    break;
            }
        } catch (e) {
            // Log
            console.error(e);
            console.log("Exception while parsing packet. Ignoring...");
            return;
        }

    }

    createPackage(_id, _data){
        return JSON.stringify({id: _id, data: _data});
    }

    keyboardUpdate(isdown, key){
        if(isdown){
            this.keyboard[key] = true;
        }else {
            this.keyboard[key] = false;
        }

        this.socket.send(this.createPackage(0, this.keyboard));
    }
}