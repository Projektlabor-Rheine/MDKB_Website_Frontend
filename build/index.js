
import {controllerutils, userutils, achieveutils, profileutils} from "./scripts/gamesync_handler.js";

import {StoplineEvent, DriverLostConnEvent, DriverRejoin, DriverRemove, YoureDriver} from "./scripts/gameevent_handler.js"

// Globel Vars
var keyEnable = false;

const eventcalllist = {
    101: new DriverLostConnEvent(),
    102: new DriverRemove(),
    103: new DriverRejoin(3000),
    104: new StoplineEvent(5000),
    105: new YoureDriver(3000),
}

const keydecoder = {
    "w": "w",
    "a": "a",
    "s": "s",
    "d": "d",
    "ArrowUp": "up",
    "ArrowDown": "down",
    "ArrowRight": "right",
    "ArrowLeft": "left", 
}


function getUUIDCookie(){
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (const cookie of ca) {
        if(cookie.trim().indexOf("uuid") == 0){
            return cookie.split("=")[1];
        }
    }
    return "";
}

/**
 * If a game-sync packet get's received
 * @param {Packet} packet 
 */
function onPacketSync(packet) {

    // Checks if the packet contains the users (Heißt jetzt Players Noah ist schuld)
    if ("players" in packet.data){
        userutils.usersUpdate(packet.data.players);
    }
    if ("achievements" in packet.data){
        achieveutils.achieveUpdate(packet.data.achievements);
    }
    if ("profile" in packet.data){ // Has to be executed after users
        profileutils.userUpdate(packet.data.profile);
    }
    if ("controller" in packet.data){ // Has to be executed after users
        keyEnable = controllerutils.controllerUpdate(packet.data.controller);
    }
    
}


function onEvent(packet) {
    if ( packet.id in eventcalllist)
        eventcalllist[packet.id].callEvent(packet.data);
}




// Connection to the backend-server
var caccon = new CACConnection(wsserver + "ws/connect", onPacketSync, onEvent);

//Keyboard input 
window.addEventListener("keydown", (ev) => {
    if ( ev.key in keydecoder && keyEnable && !ev.repeat)
        caccon.keyboardUpdate(true, keydecoder[ev.key]);
});
window.addEventListener("keyup", (ev) => {
    if ( ev.key in keydecoder && keyEnable && !ev.repeat)
        caccon.keyboardUpdate(false, keydecoder[ev.key]);
});


//Test
caccon.startConnection(getUUIDCookie());

//let stoplinee = new StoplineEvent(5000);

//stoplinee.callEvent({});

//onEvent({typid: 104, data: {uuid: "Harald"}});

