

// Contains user-stuff.
const userutils = {

    /**
     * Updates all users to the frontend
     * @param {User[]} users
     */
    _usersUpdate: (users) => {
        // Checks if the received users are valid
        if (!userutils.usersValid(users))
            return;
        
        // Gets the queue
        var queue = $("#snakeholder");

        // Removes all users
        queue.empty();


        // Inserts the received ones
        for (const element of users)
            queue.append(_genSnakeItem(element.pos, element.name));
    },


    /**
     * Checks if the received users are valid
     * @param {User[]} users 
     * @returns true/false if the received users are valid
     */
    _usersValid: (users) => {
        let poses = []
        let uuids = []
        
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

        return true;
    },

    /**
     * Generates a new snake-item with the given parameters
     * @param {Int} pos 
     * @param {String} name 
     * @returns {HTMLElement} that contains the fully combined data
     */
    _genSnakeItem: (pos, name) => {
        var wrapper = document.createElement("div");
        wrapper.classList.add("oneitem bg-blue-200 rounded-md m-2 p-4");
        var text = document.createElement("p");
        text.classList.add("text-left");
        let posElm = document.createElement("span");
        posElm.classList.add("text-red-700 p-2 text-3xl align-middle");
        let nameElm = document.createElement("span");
        nameElm.classList.add("align-middle ml-4 text-xl");

        // Appends the data
        posElm.textContent = pos;
        nameElm.textContent = name;
    
        // Combines the elements
        text.appendChild(pos);
        text.appendChild(name);
        wrapper.appendChild(text);

        return wrapper;
    }
}

/**
 * Call this function, once the user has accepted the cookie-agreement and wants to start the main service (connection etc.)
 */
function start(){
    caccon.startConnection();
}

/**
 * If a game-sync packet get's received
 * @param {Packet} packet 
 */
function onPacketSync(packet) {
    
    // Checks if the packet contains the users
    if ("users" in data){
        userutils.usersUpdate(data.users);
    }
    // Continue...

}





// Webserver-address
// TODO: Change to real one
const url = "ws://localhost/ws/connect";

// Connection to the backend-server
var caccon = new CACConnection(url, userutils.onPacketSync);