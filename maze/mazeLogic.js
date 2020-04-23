function getParameters() {

    var getParametersString = window.location.search.substr(1);
    var getParameters = getParametersString.split("=");
    
    return getParameters;

}

function initMaze() {   

    if(getParameters()[0] == "hostId") {

        var multiPlayerId = getParameters()[1];


    } else
    if(getParameters()[0] == "mazeData") {

        var encodedMazeData = getParameters()[1];
        var mazeDataJson = LZString.decompressFromUTF16(decodeURIComponent(encodedMazeData));
    
        importMaze(mazeDataJson);

    } else {

        getDemoMode();

        createMaze();

        exportMaze();
    
    }
    
    getBlackTrace();

    rowPosition = 1;
    colPosition = 1;

    currentCell = document.getElementById("cell_" + rowPosition + "_" + colPosition);
    currentCell.style.backgroundColor = backgroundColorPosition;

    if (demoMode == false) {
    
        document.getElementById("maze").style.visibility = "hidden";

        document.getElementById("notice").innerHTML = "Maze is ready. <br />Press <i>Enter</i> to start.<br />Press <i>Esc</i> to show settings and help.</div>";

        if (stopWatchActive == true) {
            stopWatchActive = false;
            stopStopWatch();
        }

    }
    
    if (explorerMode == true) {

        revealNeighbourWalls(1, 1);

    }

    setTableSize();
}

function importMaze(mazeDataJson) {

    var borders = [];
    var cellIndex = 0;
    
    var currentCell;

    var mazeData; 

    mazeData = JSON.parse(mazeDataJson);

    console.log(mazeData);
  
    mazeWidth = mazeData.width;
    mazeHeight = mazeData.height;
    demoMode = mazeData.demoMode;
    blackTrace = mazeData.blackTrace;
    explorerMode = mazeData.explorerMode;
    noDetours = mazeData.noDetours;
    simpleMode = mazeData.simpleMode;

    document.getElementById("mazeWidth").value = mazeWidth;
    document.getElementById("mazeHeight").value = mazeHeight;
    document.getElementById("demoMode").checked = demoMode;
    document.getElementById("blackTrace").checked = blackTrace;
    document.getElementById("explorerMode").checked = explorerMode;
    document.getElementById("noDetours").checked = noDetours;
    document.getElementById("simpleMode").checked = simpleMode;

    createBlankMaze();

    for (var i = 0; i < mazeData.borders.length; i += 2) {
    
        borders.push([mazeData.borders.charAt(i), mazeData.borders.charAt(i + 1)])

    }   

    for (rowIndex = 1; rowIndex <= (mazeHeight); rowIndex++) {

        for (colIndex = 1; colIndex <= (mazeWidth); colIndex++) {

            currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
            currentCell.setAttribute("occupied", "true");
            // right border set?
            if (borders[cellIndex][0] != "x") {

                currentCell.style.borderRight = "none";

                // also set left border of next cell
                if (colIndex < mazeWidth) {
                    
                    document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1)).style.borderLeft = "none";

                }

            };

            // bottom border set?
            if (borders[cellIndex][1] != "x") {

                currentCell.style.borderBottom = "none";
                // also set top border of next cell to top
                if (rowIndex < mazeHeight) {
                    
                    document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex).style.borderTop = "none";

                }

            };
    
            cellIndex++;

        }
    
    }

}

function exportMaze() {

    var table = document.getElementById("maze");
    var mazeBorders = "";
    var currentCell;

    for (rowIndex = 1; rowIndex <= (mazeHeight); rowIndex++) {

        for (colIndex = 1; colIndex <= (mazeWidth); colIndex++) {

        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
        
            if (currentCell.style.borderRight != "") {
                mazeBorders += ("r");
            } else {
                mazeBorders += ("x");
            }
            if (currentCell.style.borderBottom != "") {
                mazeBorders += ("b");
            } else {
                mazeBorders += ("x");
            }
        }

    }

    var mazeData = {
        "width": mazeWidth,
        "height": mazeHeight,
        "borders": mazeBorders,
        "demoMode": demoMode,
        "simpleMode": simpleMode,
        "explorerMode": explorerMode,
        "noDetours": noDetours,
        "blackTrace": blackTrace
    };

    var mazeDataJson = JSON.stringify(mazeData);

    localStorage.setItem("compressedMazeData",LZString.compressToUTF16(mazeDataJson));

    shareUrl = window.location + "?mazeData=" + localStorage.getItem("compressedMazeData");
    document.getElementById("mazeDataJson").value = mazeDataJson;
    document.getElementById("shareMazeData").setAttribute("href", shareUrl);
    
}

function createMaze() {

    mazeHeight = document.getElementById("mazeHeight").value;
    mazeWidth = document.getElementById("mazeWidth").value;

    noDetours = document.getElementById("noDetours").checked;
    simpleMode = document.getElementById("simpleMode").checked;
    explorerMode = document.getElementById("explorerMode").checked;

    if (simpleMode == true) {

        validExits = ["right", "bottom"];

    } else {

        validExits = ["right", "bottom", "left", "top"];

    }

    createBlankMaze();

    startAtRow = 1;
    startAtCol = 1;

    // add main route that leads to the goal (with little detours)
    addRoute(startAtRow, startAtCol, false);

    // follow main route and, if empty cells are available, create additional detours
    if (!noDetours) {

        for (n = 1; n < (mazeWidth * mazeHeight) - 1; n++) {

            var currentCell = document.getElementById("cell_" + startAtRow + "_" + startAtCol);
            
            if (currentCell.getAttribute("occupied") == "true") {
    
                addRoute(startAtRow, startAtCol, true);
    
            }
    
            if (startAtCol == mazeWidth) {
                
                startAtRow++;
                startAtCol = 1;
    
            } else {
    
                startAtCol++;
    
            }
    
        }

    }

}

function getNextExits(rowIndex, colIndex, createDetour) {

    var nextExits = [];

    for (i = 0; i < validExits.length; i++) {

        switch(validExits[i]) {

            case "right":
                // if this is a detour call (no route to exit), ignore right movement
                // // when this would lead to the exit
                if (createDetour == true && colIndex + 1 == mazeWidth && rowIndex == mazeHeight) {

                    nextPossibleCell == null;

                } else {

                    nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1));

                }
                
                break;

            case "left":
                nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex - 1));
                break;

            case "bottom":
                // if this is a detour call (no route to exit), ignore bottom movement
                // when this would lead to the exit
                if (createDetour == true && colIndex == mazeWidth && rowIndex + 1 == mazeHeight) {

                    nextPossibleCell == null;

                } else {

                    nextPossibleCell = document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex);

                }
                break;

            case "top":
                nextPossibleCell = document.getElementById("cell_" + (rowIndex - 1) + "_" + colIndex);
                break;

        }
        
        if (nextPossibleCell != null) {

            if (nextPossibleCell.getAttribute("occupied") != "true") {
                
                for (t = 0; t < remainingExits[validExits[i]]; t++) {

                    nextExits.push(validExits[i]);

                }

            }

        } 

    }

    
    return nextExits;
}

function addRoute(startAtRow, startAtCol, createDetour) {

    remainingExits = {"right": mazeWidth, "bottom": mazeHeight, "left": 0, "top": 0};
    var nextExits = [];
    var lastCells= [];

    var rowIndex = startAtRow;
    var colIndex = startAtCol;
    
    var currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

    var exit;

    var lastExit;

    var exitIndex;

    var loop = 0;
    var loopFuse = 0;
    var maxLoops = 4 * mazeWidth * mazeHeight;

    var nextPossibleCell;

    while (loop < ((mazeWidth * mazeHeight) - 1)) {

        loopFuse++;

        if (loopFuse >= maxLoops) {break;}

        nextExits = getNextExits(rowIndex, colIndex, createDetour);

        if (nextExits.length == 0) {

            if (createDetour == true) {

                return false;

            } else {
                
                lastCells.splice(lastCells.length - 1, 1);

                rowIndex = lastCells[lastCells.length - 1][0];
                colIndex = lastCells[lastCells.length - 1][1];
                currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

                continue;
            
            }

        }
        
        if (currentCell == null) {continue;}

        // get random exit
        exitIndex = Math.floor(Math.random() * Math.floor(nextExits.length));
        exit = nextExits[exitIndex];

        // remove border according to current exit
        currentCell.style["border-"+exit] = "none";
        
        // based on random exit, move coordinates to next cell
        // but dont actually select next cell!
        switch(exit) {

            case "right":

                colIndex = colIndex + 1;
                remainingExits.left++;
                remainingExits.right--;
                break;

            case "bottom":

                rowIndex = rowIndex + 1;
                remainingExits.top++;
                remainingExits.bottom--;
                break;

            case "left":

                colIndex = colIndex - 1;
                remainingExits.left--;
                remainingExits.right++;
                break;

            case "top":

                rowIndex = rowIndex - 1;
                remainingExits.top--;
                remainingExits.bottom++;
                break;
                
        }

        // first add new coordinates to route
        lastCells.push([rowIndex, colIndex]);

        // now jump to next cell
        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

        // and set opposite borders based on exit from the last cell
        switch(exit) {

            case "right":

                currentCell.style["border-left"] = "none";
                break;

            case "bottom":

                currentCell.style["border-top"] = "none";
                break;

            case "left":

                currentCell.style["border-right"] = "none";
                break;

            case "top":

                currentCell.style["border-bottom"] = "none";
                break;

        }

        if (rowIndex == mazeHeight && colIndex == mazeWidth) {

            break;

        }

        currentCell.style.backgroundColor = backgroundColorRoute;
        currentCell.setAttribute("occupied", "true");

        lastExit = exit;

        loop++;

    }

}

function createBlankMaze() {

    var rowIndex, colIndex;

    var table = document.getElementById("maze");
    table.innerHTML = "";
    var tbody = document.createElement("tbody");

    for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {

        var row = document.createElement("tr");
        row.setAttribute("id", "row_" + rowIndex);

        for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {

            var col = document.createElement("td");
            //var colContent = document.createTextNode("");
            //col.appendChild(colContent);

            col.style.backgroundColor = "rgb(255,255,255)";

            if ((rowIndex == 1 && colIndex == 1)) {
                col.style.backgroundColor = backgroundColorRoute;
                col.setAttribute("occupied", "true");

            }
            if ((rowIndex == mazeHeight && colIndex == mazeWidth)) {
                col.style.backgroundColor = backgroundColorExit;
            }

            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);

            if (explorerMode == true) {
                col.classList.add("invisibleWall");
            }
            row.appendChild(col);

        }

        tbody.appendChild(row);

    }
    
    table.appendChild(tbody);

}

function setTableSize() {

    var table = document.getElementById("maze");

    // var availableWidth = window.innerWidth - 40;
    // var availableHeight = window.innerHeight - 40;

    // var minCellWidth = 25;
    // var minCellHeight = 25;
    
    // // 1.000 pixel / 30 cells - 30 cells + 2 px border -> cell width
    // var cellWidth = (availableWidth / mazeWidth) - (mazeWidth * 2);
    // var cellHeight= (availableHeight / mazeHeight) - (mazeHeight * 2);

    // // greater value wins, of course, now we have an even dimension
    // // to build quadratic cells
    // var cellDimension = (cellWidth >= cellHeight) ? cellWidth : cellHeight;
    
    // // first set table width / height
    // console.log(mazeWidth);
    // console.log(mazeHeight);
    // console.log(cellDimension);
    // table.style.width = mazeWidth * cellDimension;
    // table.style.height = mazeHeight * cellDimension;

    // if maze width and height are the same (quadratic)
    // and available width > height, fill up 
    if (mazeWidth == mazeHeight) {

        var cellWidth = window.innerWidth / mazeWidth;
        var cellHeight = (window.innerHeight - 40) / mazeHeight;
        
        if (cellWidth < cellHeight) {

            var tableDimension = cellWidth * mazeWidth - 40;
    
        } else {
            
            var tableDimension = cellHeight * mazeHeight - 40;
            
        }

        table.style.width = tableDimension;
        table.style.height = tableDimension;

        table.style.marginLeft = Math.round((window.innerWidth - tableDimension) / 2) + "px";
        table.style.marginRight = table.style.marginLeft;

        
    } else {

        table.style.width = window.innerWidth - 40 - (mazeWidth * 2);
        table.style.height = window.innerHeight - 40 - (mazeHeight * 2);

    }

}

function changeDimensions(keyCode) {

    var rePaint = false;

    if ([73,74,75,76,79,85].includes(keyCode)) {
        rePaint = true;
    }
    switch (keyCode) {

        // i pressed
        case 73: 
            document.getElementById("mazeHeight").value++;
            mazeHeight = document.getElementById("mazeHeight").value;
            break;
        // k pressed
        case 75: 
            if (document.getElementById("mazeHeight").value > 1) {
                document.getElementById("mazeHeight").value--;
            } else {
                rePaint = false;
            }
            mazeHeight = document.getElementById("mazeHeight").value;
            break;

        // j pressed
        case 76: 
            document.getElementById("mazeWidth").value++;
            mazeWidth = document.getElementById("mazeWidth").value;
            break;
        // l pressed
        case 74: 
            if (document.getElementById("mazeWidth").value > 1) {
                document.getElementById("mazeWidth").value--;
            } else {
                rePaint = false;
            }
            mazeWidth = document.getElementById("mazeWidth").value;
            break;

        // u pressed
        case 79: 
            document.getElementById("mazeWidth").value++;
            document.getElementById("mazeHeight").value++;
            mazeWidth = document.getElementById("mazeWidth").value;
            mazeHeight = document.getElementById("mazeHeight").value;
            break;
        // o pressed
        case 85: 
            if (document.getElementById("mazeWidth").value > 1 &&
             document.getElementById("mazeHeight").value > 1) {
                document.getElementById("mazeWidth").value--;
                document.getElementById("mazeHeight").value--;
            } else {
                rePaint = false;
            }
            mazeWidth = document.getElementById("mazeWidth").value;
            mazeHeight = document.getElementById("mazeHeight").value;
            break;

    }

    if (rePaint == true) {
        
        initMaze();

    }

}