
import {userutils} from "./gamesync_handler.js";

let stopTimer = 0;

function setTimer(timer){
    stopTimer = timer;
}


class Event {

    _timer;

    _inlineHolder = "#inlineventholder";

    /**
     * 
     * @param {number} timeout 
     * 
     * timeout < 0 until hidden
     * timeout = 0 no time
     * timeout > 0 expected behaviour
     * 
     */
    constructor(timeout, validate){
        if (timeout === null){
            this.timeout = 5000; //Default timeout
        } else {
            this.timeout = timeout;
        }
        this.event_msg = "Abstract lol"
        this.validate = validate
    }

    _isEventValid(data) {
        try {
            //valid semantics
            if( typeof data.uuid != "string")
                return false;
            
            //valid uuid
            if(!userutils.isUuidValid(data.uuid))
                return false;
                
            
            return true;
        } catch(e) {
            console.error(`Exception in _isEventValid of ${this.constructor.name}: ${e}`);
            return false;
        }

    }

    callEvent(data) {
        if(this.validate) {
            if(!this._isEventValid(data)){
                return;
            }
        }

        let inlineHolder = $(this._inlineHolder);
        inlineHolder.text(this.event_msg);

        if (this.timeout != 0)
            this.showEvent();
        
        if (this.timeout > 0)
            this._timer = setTimeout(() => {this.hideEvent();}, this.timeout);
    }

    hideEvent() {
        $(this._inlineHolder).animate({opacity: 0}, 200, "swing");
    }

    showEvent() {
        $(this._inlineHolder).animate({opacity: 1}, 200, "swing");
    }

}



class StoplineEvent extends Event {

    constructor (timeout){
        super(timeout, true);
        this.event_msg = "Ende Bro, weiter nich ;)";
    }

}



class DriverLostConnEvent extends Event {

    constructor (){
        super(-1, true);
        this.event_msg = "Driver Lost Connection";
    }

    callEvent(data) {
        stopTimer();
        super.callEvent(data);
    }

}

class DriverRemove extends Event{

    constructor (){
        super(0, false);
        this.event_msg = "";
    }

    callEvent(data) {
        this.hideEvent();
    }

}

class DriverRejoin extends Event {
    constructor (timeout){
        super(timeout, true);
        this.event_msg = "Driver Rejoined";
    }
}

class YoureDriver extends Event {

    constructor (timeout){
        super(timeout, false);
        this.event_msg = "Du bist jetzt Fahrer!";
    }
    

}



export {StoplineEvent, DriverLostConnEvent, DriverRemove, DriverRejoin, YoureDriver, setTimer}
