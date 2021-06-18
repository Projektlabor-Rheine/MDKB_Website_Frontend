

// Helper-method to check if a variable is a positive integer
var isPositiveInt = num => num === parseInt(num,10) && num >= 0;
// Helper-method to check if a variable is an array
var isArray = pkt => typeof pkt === "object" && pkt.constructor.name === "Array";
// Helper-method to check if a variable is an object
var isObject = pkt => typeof pkt === "object" && pkt.constructor.name === "Object";


//Global Vars
var countdowntimer;
var countdowntime;
var getPiStatus;

var mName;
var mUuid;
var mPos;


function consti(getpistatus){
    getPiStatus = getpistatus;
}


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
        for (const element of users){
            let snakeitem = userutils._genSnakeItem(element.pos, element.name, element.uuid, element.color);
            if (element.uuid == mUuid)
                snakeitem.classList.add("bg-ats-green");
            
            queue.append(snakeitem);

        }


    },


    isUuidValid: (uuid) => {
        var queue = $("#snakeholder");
        
        for(const element of queue.children()){
            
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
        if(!isArray(users))
            return false;

        let poses = []
        let uuids = []
        
        
        for (const element of users) {
            // Calculates if the user is valid
            // Checks if...
            let validUser =
                // UUID is given as a string
                typeof element.uuid === "string" &&
                // UUID exists only once
                !(element.uuid in uuids) &&
                // Position is given as a number
                isPositiveInt(element.pos)
                // Position is only given once
                !(element.pos in poses) &&
                // Name is given
                typeof element.name === "string" &&
                // Connection status is given
                typeof element.connected === "boolean" &&
                // If disconnected, timer is given
                (!element.connected) ? isPositiveInt(element.timer) : true &&
                // The color of the player is given
                isPositiveInt(element.color);

            // Checks if the user is invalid
            if(!validUser)
                return false;
            
            // Registers the uuid and position as taken
            uuids.push(element.uuid);
            poses.push(element.pos);
        }
        
        return true;
    },

    _intToHexColor(num){
        var raw = num.toString(16);
        raw+="0".repeat(6-raw.length);
        return raw;
    },

    /**
     * Generates a new snake-item with the given parameters
     * @param {Int} pos 
     * @param {String} name 
     * @returns {HTMLElement} that contains the fully combined data
     */
    _genSnakeItem: (pos, name, uuid, color) => {
        var wrapper = document.createElement("div");
        wrapper.classList = "oneitem bg-blue-200 rounded-md m-2 p-4";
        wrapper.style = "border: 0.2em solid #" + userutils._intToHexColor(color);
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
            holder.append(achieveutils._genAchieveItem(achieve.name, achieve.id, achieve.active, achieve.code));
        }


    },

    _achieveValid: (achieves) => {
        let ids = [];
        
        for (const element of achieves) {
            
            // If the achievement is valid
            // Checks if
            let valid = 
                // Name is given
                typeof element.name === "string" &&
                // Unlock-state is given
                typeof element.active === "boolean" &&
                // Id is given
                isPositiveInt(element.id) && 
                // Id is not duplicated
                !(element.id in ids) &&
                // If active, the code is given
                (element.active ? (typeof element.code === "string") : true);

            // Checks if the achievement is invalid
            if(!valid)
                return false;

            // Appends the new id
            ids.push(element.id);
        }
        
        return true;
    },

    _genAchieveItem: (name, id, active, code) => {
        //HTML Object
        var wrapper = document.createElement("div");
        wrapper.classList.add("achieve_item");
        var img = document.createElement("img");
        img.classList.add("rounded-md");
        img.src = httpserver+`achievements/access/${(active ? code : "default" )}`;
        let h4 = document.createElement("h4");

        //Active or not Appending Data
        if (active) {
            let a = document.createElement("a");
            a.textContent = name;
            a.href = httpserver+`achievements/unlock/${code}`;
            a.target = "_blank";
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

    //playtime: 3000*60,

    controllerUpdate: (controller) => {
        
        //Valid check
        if(!controllerutils._controllerValid(controller))
            return
        
        //Changes lol
        let conttime = $("#controllertime");
        
        conttime.text(controllerutils._timeItem(controller.time));
        
        let keyEnable = false;
        //Enable/Disable Keyboard packages
        if (mUuid == controller.uuid) {
            keyEnable = true;
        }

        
        //Start counter
        countdowntime = controller.time;
        controllerutils.startCountdown();
        
        return keyEnable;

    },

    _controllerValid: (controller) => {
        
        // Calculates if the given controller is valid
        // Checks if...
        return (
            // The controller is given given as a valid object
            isObject(controller) && 
            // UUID is given as a string
            typeof controller.uuid === "string" &&
            // Time is given
            isPositiveInt(controller.time) &&
            // UUID exists
            userutils.isUuidValid(controller.uuid));
    },

    _timeItem: (starttime) => {
        //Berechnet die Zeit die noch verbleibt bis es einen Controllerwechesel gibt
        let unixtimeleft = starttime - Date.now()
        let timeleft = new Date(unixtimeleft);
        
        // Clamp
        if (unixtimeleft <= 0){
            //Timer stoppen
            clearInterval(countdowntimer);
            return "0 min 0 s";
        }
        
        return `${timeleft.getMinutes()} min ${timeleft.getSeconds()} s`;
    },

    _countdown: (starttime) => {
        $("#controllertime").text(controllerutils._timeItem(starttime));
    },

    startCountdown: () => {
        if(getPiStatus()){
            clearInterval(countdowntimer);
            countdowntimer = setInterval(controllerutils._countdown, 1000, countdowntime);
        }
    },

    stopCountdown: () => {
        clearInterval(countdowntimer);
    }

}

const profileutils = {


    userUpdate: (user) => {
        // Checks if the received users are valid
        if (!profileutils._userValid(user))
            return;
        
        // Gets the queue
        var queue = $("#snakeholder");
        
        //Color profile
        for (const snakeitem of queue.children()){
            if(snakeitem.getAttribute("data-uuid") == user.uuid){
                snakeitem.classList.add("bg-ats-green");
            }
        }

        mUuid = user.uuid;
        mName = user.name;
        mPos = user.pos;

        profileutils.setUUIDCookie(user.uuid);

    },


    /**
     * Checks if the received users are valid
     * @param {User[]} users 
     * @returns true/false if the received users are valid
     */
    _userValid: (user) => {
        
        // Calculates if the given profile is valid
        // Checks if...
        return (
            // The profile is even given as a valid profile
            isObject(user) &&
            // UUID is given
            typeof user.uuid === "string" &&
            // UUID is valid
            userutils.isUuidValid(user.uuid) && 
            // Position is given
            isPositiveInt(user.pos) &&
            // Name is given
            typeof user.name === "string" &&
            // Color is given
            isPositiveInt(user.color));
    },


    setUUIDCookie: (uuid) => {
        var d = new Date();
        d.setTime(d.getTime() + (30*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "session=" + uuid + ";" + expires + "";
    }


}




export {controllerutils, userutils, achieveutils, profileutils, countdowntimer, consti}
