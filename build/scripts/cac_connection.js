class CACConnection{

    /**
     * 
     * @param {String} url the url of the access-point on the cac-server 
     */
    constructor(url,onGameSync){
        this.url = url;
        this.onGameSync = onGameSync;
    }

    /**
     * Starts the connection to the backend-server. Automatically performs restart on disconnect
     */
    startConnection(){
        this.socket = new WebSocket(this.url);
        this.socket.onopen = this._onConnect;
        this.socket.onclose = this._onDisconnect;
        this.socket.onmessage = this._onPacketReceived;
    }

    /**
     * Event handler for the connect event
     */
    _onConnect(_){
        // TODO: Debug, remove
        this.send("Here's some text that the server is urgently awaiting!");
    }

    /**
     * Event handler for the disconnect event
     */
    _onDisconnect(_){
        // Restarts the connection
        this.startConnection();

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
                caccon.onGameSync(pkt.data); //ARSCH SO aber this geht nich
                return;
            }
    
            // Checks the exact packet-id
            switch (pkt.id){
                case 0:
                    break;
            }
        } catch (e) {
            // Log
            console.error(evt);
            console.log("Exception while parsing packet. Ignoring...");
            return;
        }

    }
}