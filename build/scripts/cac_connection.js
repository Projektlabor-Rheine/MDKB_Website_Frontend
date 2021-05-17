class CACConnection{

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
        this.socket = new WebSocket(this.url);
        this.socket.onopen = (evt) => this._onConnect(evt);
        this.socket.onclose = (evt) => this._onDisconnect(evt);
        this.socket.onmessage = (evt) => this._onPacketReceived(evt);
    }

    /**
     * Event handler for the connect event
     */
    _onConnect(_){
        // TODO: Debug, remove
        this.socket.send("Here's some text that the server is urgently awaiting!");
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
                case 0:
                    break;
            }
        } catch (e) {
            // Log
            console.error(e);
            console.log("Exception while parsing packet. Ignoring...");
            return;
        }

    }
}