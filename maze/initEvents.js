function initEvents() {

    document.getElementById("demoMode").onclick = function() {
        demoMode = this.checked;
        if (demoMode == true) {
            document.getElementById("maze").style.visibility = "visible";
        }
    }


}