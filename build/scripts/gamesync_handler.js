

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
            queue.append(userutils._genSnakeItem(element.pos, element.name, element.uuid));
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
            console.error(`Exception in _usersValid: ${e}`);
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
        let timeleft = new Date(starttime + controllerutils.playtime - Date.now());
        
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
        
        try {
            //uuid is string
            if( typeof user.uuid != "string")
                return false;

            //uuid valid
            if(!userutils.isUuidValid(user.uuid))
                return false
            
            //pos is int
            if (typeof user.pos != "number")
                return false;

            //name is string
            if (typeof user.name != "string")
                return false;
            
        } catch(e) {
            console.error(`Exception in _userValid: {e}`);
            return false;
        }

        return true;
    },


    setUUIDCookie: (uuid) => {
        var d = new Date();
        d.setTime(d.getTime() + (30*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "uuid=" + uuid + ";" + expires + ";path=/";
    }


}


export {controllerutils, userutils, achieveutils, profileutils, mName, mUuid, mPos}
