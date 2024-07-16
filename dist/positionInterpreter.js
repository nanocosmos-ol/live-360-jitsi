//https://5f1x7j2.fe.hhi.de/t1#config.disableAP=true
const internalCallUrl =  "https://5f1x7j2.fe.hhi.de";
const externalCallUrl = "https://jitsi.iventic.com";
const callConfig = "disableAP=true"
const nFields = 5; //how many fields
const offset = -(Math.PI/nFields*4); //in radiant (0...2Pi). spherical rotation and orientation of stream probably don't match. Use offset to adjust fields
const clockwise = true;
let sphericalOrientation = {phi:0, theta:0, radius:0};

window.addEventListener("load", function () {
    document.getElementById("externalCallButton").addEventListener("click", ()=>{window.open(generateUrl());});
    document.getElementById("internalCallButton").addEventListener("click", ()=>{window.open(generateUrl({url:internalCallUrl}));});
});

//The modified videojs-vr.js dispatches an event every time (TM) the viewer changes its direction of view
//The event contains the new view direction formated like sphericalOrientation.
window.addEventListener('sphericalChange', (data) => {sphericalOrientation = data.detail;})

function generateUrl(options ={}){
    let field = calculateField();
    return `${(options.url || externalCallUrl)}/t${field}#config.${callConfig}`
}

function calculateField(){
    //calculate which field the viewer is looking at based on how many fields there are supposed to be
    let angle = 0;
    if(clockwise === false) angle = sphericalOrientation.theta + Math.PI;
    else angle = (sphericalOrientation.theta - Math.PI) * -1;
    let correctedAngle = angle + offset;
    if(correctedAngle < 0) correctedAngle += (2*Math.PI);
    if(correctedAngle > 2*Math.PI) correctedAngle -= 2*Math.PI;
    let selected = Math.min(nFields-1, Math.max(0, Math.floor(((correctedAngle) * nFields) / (2*Math.PI))));
    selected+=1; //because calls are 1 based
    return Number(selected);
}
