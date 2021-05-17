
import {userutils} from "./gamesync_handler.js";


class Event {

    #timer;

    #inlineHolder = "#inlineventholder";

    constructor(timeout){
        if (timeout === null){
            this.timeout = 5000; //Default timeout
        } else {
            this.timeout = timeout;
        }
        this.event_msg = "Abstract lol"
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
        if(!this._isEventValid(data)){
            return;
        }

        let inlineHolder = $(this.#inlineHolder);
        inlineHolder.text(this.event_msg);

        this.showEvent();
        
        
        this.#timer = setTimeout(() => {this.hideEvent();}, this.timeout);
    }

    hideEvent() {
        $(this.#inlineHolder).animate({opacity: 0}, 200, "swing");
    }

    showEvent() {
        $(this.#inlineHolder).animate({opacity: 1}, 200, "swing");
    }

}



class StoplineEvent extends Event {

    constructor (timeout){
        super(timeout);
        this.event_msg = "Ende Bro, weiter nich ;)";
    }

}





export {StoplineEvent}
