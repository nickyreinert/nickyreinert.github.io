function initEvents() {


    addEventListener('input', function (e) {

        if (e.target.classList.contains("settings") == true) {

            exportMaze();
        }
        
    });

    document.getElementById("hostMultiPlayerSession").onclick = function(e) {

        hostMultiPlayerSession();

    }

    document.getElementById("importMazeData").onclick = function(e) {

        importMaze();
        
    }

    document.getElementById("showSettings").onclick = function(e) {

        toggleSettings();

        e.preventDefault();
    }

    document.getElementById("demoMode").onclick = function() {
        demoMode = this.checked;
        if (demoMode == true) {
            document.getElementById("maze").style.visibility = "visible";
        }
    }

    document.getElementById("importMazeData").onclick = function() {
    
        var mazeDataJson = document.getElementById("importMazeData").value;
        importMaze(mazeDataJson);
    
    }

}

