

// wss://meet.jit.si/xmpp-websocket?room=sto-khun-ghar


const domain = 'meet.jit.si';
const options = {
    roomName: 'MakieDerKiller',
    parentNode: document.querySelector('#meet'),
    userInfo: {
        displayName: 'Meeehdi Doe'
    },
    configOverwrite: { 
        disableProfile: true,
        enableCalendarIntegration: false,
        prejoinPageEnabled: false,
        toolbarButtons: [],
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableProfile: true,
        hideLobbyButton: true,

    }
};
// const api = new JitsiMeetExternalAPI(domain, options);

// api.addListener("videoConferenceJoined", videoJoined);


function videoJoined(event){
    //console.log("Video Joined");

    partis = api.getParticipantsInfo();

    for (const user of partis) {
        if (user.displayName == "Reinhold Messner"){
            api.pinParticipant(user.participantId);
        }
    }

    //console.log(partis);

    //api.pinParticipant("99b1d359");

}


