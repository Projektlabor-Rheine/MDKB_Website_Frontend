

//Global Vars
var countdowntimer;


// Contains user-stuff.
const userutils = {

    /**
     * Updates all users to the frontend
     * @param {User[]} users
     */
    usersUpdate: (users) => {
        // Checks if the received users are valid
        if (!userutils._usersValid(users))
            return;

        
        // Gets the queue
        var queue = $("#snakeholder");
        
        // Removes all users
        queue.empty();


        // Inserts the received ones
        for (const element of users)
            queue.append(userutils._genSnakeItem(element.pos, element.name, element.uuid));
    },


    isUuidValid: (uuid) => {
        var queue = $("#snakeholder");

        for(element of queue.children()){
            if(element.getAttribute("data-uuid") == uuid)
                return true;
        }

        return false;

    },


    /**
     * Checks if the received users are valid
     * @param {User[]} users 
     * @returns true/false if the received users are valid
     */
    _usersValid: (users) => {
        let poses = []
        let uuids = []
        
        
        try {
            for (const element of users) {
                //All names are strings?
                if( typeof element.uuid != "string")
                    return false;
                
                if (uuids.includes(element.uuid))
                    return false;
                
                uuids.push(element.uuid);
                //All pos are int
                if (typeof element.pos != "number")
                    return false;

                if (poses.includes(element.pos))
                    return false;

                poses.push(element.pos);
                //All names are string
                if (typeof element.name != "string")
                    return false;
            }
        } catch(e) {
            console.error(`Exception in _usersValid: {e}`);
            return false;
        }

        return true;
    },

    /**
     * Generates a new snake-item with the given parameters
     * @param {Int} pos 
     * @param {String} name 
     * @returns {HTMLElement} that contains the fully combined data
     */
    _genSnakeItem: (pos, name, uuid) => {
        var wrapper = document.createElement("div");
        wrapper.classList = "oneitem bg-blue-200 rounded-md m-2 p-4";
        var text = document.createElement("p");
        text.classList = "text-left";
        let posElm = document.createElement("span");
        posElm.classList = "text-red-700 p-2 text-3xl align-middle";
        let nameElm = document.createElement("span");
        nameElm.classList = "align-middle ml-4 text-xl";

        // Appends the data
        posElm.textContent = pos;
        nameElm.textContent = name;
        //Append UUID
        wrapper.setAttribute("data-UUID", uuid);

    
        // Combines the elements
        text.appendChild(posElm);
        text.appendChild(nameElm);
        wrapper.appendChild(text);

        return wrapper;
    }
}


const achieveutils = {

    achieveUpdate: (achieves) => {
        if (!achieveutils._achieveValid(achieves)){
            return;
        }


        // Gets the queue
        var holder = $("#achieveholder");

        // Removes all users
        holder.empty();
        
        for (const achieve of achieves){
            holder.append(achieveutils._genAchieveItem(achieve.name, achieve.id, achieve.active));
        }


    },

    _achieveValid: (achieves) => {
        let ids = [];
        
        try {
            for (const element of achieves) {
                //All ids are strings?
                if( typeof element.id != "string")
                    return false;
                
                if (ids.includes(element.id))
                    return false;
                
                ids.push(element.id);

                //All names are string
                if (typeof element.name != "string")
                    return false;

                //All active are bools
                if (typeof element.active != "boolean")
                    return false;
            }
        } catch(e) {
            console.error(`Exception in achieveValid: ${e}`);
            return false;
        }

        return true;
    },

    _genAchieveItem: (name, id, active) => {
        //HTML Object
        var wrapper = document.createElement("div");
        wrapper.classList.add("achieve_item");
        var img = document.createElement("img");
        img.classList.add("rounded-md");
        img.src = "img/rickqr.png";
        let h4 = document.createElement("h4");

        //Active or not Appending Data
        if (active) {
            let a = document.createElement("a");
            a.textContent = name;
            a.href = "#";
            h4.appendChild(a);
        }else {
            h4.textContent = name;
            wrapper.classList.add("opacity-50");
        }
    
        // Combines the elements
        wrapper.appendChild(img);
        wrapper.appendChild(h4);

        return wrapper;
    }


}

const controllerutils = {

    playtime: 3000*60,

    controllerUpdate: (controller) => {
        
        //Valid check
        if(!controllerutils._controllerValid(controller))
            return
        
        //Changes lol
        let conttime = $("#controllertime");
        console.log(controller);
        conttime.text(controllerutils._timeItem(controller.time));
        
        
        //Start counter
        clearInterval(countdowntimer);
        countdowntimer = setInterval(controllerutils._countdown, 1000, controller.time);
        

    },

    _controllerValid: (controller) => {
        
        try {
            //uuid is string
            if( typeof controller.uuid != "string")
                return false;
            
            //time is number
            if (typeof controller.time != "number")
                return false;

            //Is uuid valid
            if (!userutils.isUuidValid(controller.uuid))
                return false;
            
        } catch(e) {
            console.error(`Exception in achieveValid: ${e}`);
            return false;
        }

        return true;
    },

    _timeItem: (starttime) => {
        timeleft = new Date(starttime + controllerutils.playtime - Date.now());
        
        return `${timeleft.getMinutes()} min ${timeleft.getSeconds()} s`;
    },

    _countdown: (starttime) => {
        $("#controllertime").text(controllerutils._timeItem(starttime));
    } 

}

/**
 * If a game-sync packet get's received
 * @param {Packet} packet 
 */
function onPacketSync(packet) {

    
    // Checks if the packet contains the users
    if ("users" in packet){
        userutils.usersUpdate(packet.users);
    }
    if ("achievements" in packet){
        achieveutils.achieveUpdate(packet.achievements);
    }
    if ("controller" in packet){ // Has to be executed after users
        controllerutils.controllerUpdate(packet.controller);
    }
    if ("profile" in packet){

    }
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
var caccon = new CACConnection(url, onPacketSync);


start();