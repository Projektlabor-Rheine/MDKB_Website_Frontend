
const cacserver = "http://localhost:80/";


// Helper-method to check if a variable is a positive integer
var isPositiveInt = num => num === parseInt(num,10) && num >= 0;
// Helper-method to check if a variable is an array
var isArray = pkt => typeof pkt === "object" && pkt.constructor.name === "Array";
// Helper-method to check if a variable is an object
var isObject = pkt => typeof pkt === "object" && pkt.constructor.name === "Object";

//Global Vars
var countdowntimer;

var mName;
var mUuid;
var mPos;

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
            queue.append(userutils._genSnakeItem(element));
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

    /**
     * Generates a new snake-item with the given parameters
     * @param {Object} profile the profile of the player
     */
    _genSnakeItem: (profile) => {
        var wrapper = document.createElement("div");
        wrapper.classList = "oneitem bg-blue-200 rounded-md m-2 p-4";
        var text = document.createElement("p");
        text.classList = "text-left";
        let posElm = document.createElement("span");
        posElm.classList = "text-red-700 p-2 text-3xl align-middle";
        let nameElm = document.createElement("span");
        nameElm.classList = "align-middle ml-4 text-xl";

        // TODO 1: Integrate color into profile of the user (profile.color)

        // Appends the data
        posElm.textContent = profile.pos;
        nameElm.textContent = profile.name;

        //Append UUID
        wrapper.setAttribute("data-UUID", profile.uuid);
    
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
            console.log("Achievements are invalid");
            return;
        }
        // Gets the queue
        var holder = $("#achieveholder");

        // Removes all achievements
        holder.empty();
        
        // Appends the new achievements
        for (const achieve of achieves)
            holder.append(achieveutils._genAchieveItem(achieve));


    },

    _achieveValid: (achieves) => {
        // Checks if the given object is an array
        if(!isArray(achieves))
            return false;

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

    _genAchieveItem: (achievement) => {

        // TODO 2: Integrate the real path's to the qr-code and webpage

        //HTML Object
        var wrapper = document.createElement("div");
        wrapper.classList.add("achieve_item");
        var img = document.createElement("img");
        img.classList.add("rounded-md");
        img.src = cacserver+`achievements/access/${(achievement.active ? achievement.code : "default" )}`;
        let h4 = document.createElement("h4");

        //Active or not Appending Data
        if (achievement.active) {
            let a = document.createElement("a");
            a.textContent = achievement.name;
            a.target = "_blank";
            a.href = cacserver+`achievements/unlock/${achievement.code}`;
            h4.appendChild(a);
        }else {
            h4.textContent = achievement.name;
            wrapper.classList.add("opacity-50");
        }
    
        // Combines the elements
        wrapper.appendChild(img);
        wrapper.appendChild(h4);

        return wrapper;
    }
}

const controllerutils = {

    // TODO 3: outsource into external config file
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
        var timeleft = new Date(starttime + controllerutils.playtime - Date.now());
        
        return `${timeleft.getMinutes()} min ${timeleft.getSeconds()} s`;
    },

    _countdown: (starttime) => {
        $("#controllertime").text(controllerutils._timeItem(starttime));
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
        for (var snakeitem of queue.children()){
            if(snakeitem.getAttribute("data-uuid") === user.uuid){
                snakeitem.classList.add("bg-ats-green");
            }
        }

        mUuid = user.uuid;
        mName = user.name;
        mPos = user.pos;
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
}


export {controllerutils, userutils, achieveutils, profileutils, mName, mUuid, mPos}
