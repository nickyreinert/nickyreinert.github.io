function getDemoMode() {

    demoMode = document.getElementById("demoMode").checked;

    if (demoMode == false) {

        document.getElementById("notice").innerHTML = "Please wait";
        hideResults();
        
    } else {

        document.getElementById("maze").style.visibility = "visible";
        stopStopWatch();

    }

}

function getBlackTrace() {

    blackTrace = document.getElementById("blackTrace").checked;

    if (blackTrace == true) {

        backgroundColorTrace = "rgb(0,0,0)";

    } else {

        backgroundColorTrace = "rgb(200, 200, 200)";
        
    }

}