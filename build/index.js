
import {controllerutils, userutils, achieveutils, profileutils, mName, mUuid, mPos} from "./scripts/gamesync_handler.js";

import {StoplineEvent} from "./scripts/gameevent_handler.js"


const eventcalllist = {
    104: new StoplineEvent(5000),
}


/**
 * If a game-sync packet get's received
 * @param {Packet} packet 
 */
function onPacketSync(packet) {

    // Checks if the packet contains the users
    if ("users" in packet){
        userutils.usersUpdate(packet.data.users);
    }
    if ("achievements" in packet){
        achieveutils.achieveUpdate(packet.data.achievements);
    }
    if ("controller" in packet){ // Has to be executed after users
        controllerutils.controllerUpdate(packet.data.controller);
    }
    if ("profile" in packet){ // Has to be executed after users
        profileutils.userUpdate(packet.data.profile);
    }
}


function onEvent(packet) {
    if ( packet.typid in eventcalllist)
        eventcalllist[packet.typid].callEvent(packet.data);

}



/**
 * Call this function, once the user has accepted the cookie-agreement and wants to start the main service (connection etc.)
 */
function start(){
    caccon.startConnection();
}

// Webserver-address
// TODO: Change to real one
const url = "ws://localhost:8080";

// Connection to the backend-server
var caccon = new CACConnection(url, onPacketSync, onEvent);


//start();


//Test

//let stoplinee = new StoplineEvent(5000);

//stoplinee.callEvent({});

onEvent({typid: 104, data: {uuid: "Harald"}});

