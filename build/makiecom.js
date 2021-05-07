

var glusers = [{name:"Harald der Haarige", uuid:"42", pos:0}, {name:"Hansi Hinterseer", uuid:"452", pos:2}]



//Requeieres a users array
function usersUpdate(users){
    if (!usersValid(users))
        return;
    
    $("#snakeholder").empty();


    for (const element of users) {
        
        $("#snakeholder").append(genSnakeItem(element.pos, element.name));
    }

    

}


function usersValid(users){
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
}

function genSnakeItem(pos, name){
    return `<div class="oneitem bg-blue-200 rounded-md m-2 p-4">\
<p class="text-left">\
<span class="text-red-700 p-2 text-3xl align-middle">${pos}.</span>\
<span class="align-middle ml-4 text-xl">${name}</span>\
</p></div>`
}

//usersUpdate(glusers);
