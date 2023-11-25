//15_Puzzle.js
//Class: CSE 264 - Fall 2022
//Author: Shuang Lin

//Program //////////////////////////////////////////////////
let board = document.createElement("table");
board.id = "Board";
let cells = [];
let winningCells = [];
let turns = 0;

//intializes game board
initialize();
initializeWinning(winningCells);

//Listen for clicks on buttons (initializes board by reset)
document.getElementById("Button_Reset").addEventListener("click", 
reset);

document.getElementById("Button_Scramble").addEventListener("click", 
scramble);

//Listen for clicks on cells 
board.addEventListener("click", function(event){
    let cell = event.target.closest("td");
    if(cell){
        turns++;
        //check for empty cell and move clicked cell
        if(check(cell) == 1){
            checkWin();
        }
    }
});

//Functions ////////////////////////////////////////////////

function initialize(){

    let cellCount = 1;

    for(let i = 1; i <= 4; i++){
        cells[i] = board.insertRow();
        
        for(let j = 1; j <= 4; j++){
            cells[i][j] = cells[i].insertCell();
            cells[i][j].className = "Cell"
    
            if(cellCount == 16){
                cells[i][j].appendChild(document.createTextNode(""));
                cells[i][j].id = "Empty_Cell"
            }
            else{
                cells[i][j].appendChild(document.createTextNode(cellCount));
            }
            cellCount++;
        }
    }
    document.getElementById("Game_Board").appendChild(board);
}

function initializeWinning(winningCells){

    let cellCount = 1;

    for(let i = 1; i <= 4; i++){
        winningCells[i] = [];
        for(let j = 1; j <= 4; j++){
    
            if(cellCount == 16){
                winningCells[i][j] = "";
            }
            else{
                winningCells[i][j] = cellCount;
            }
            cellCount++;
        }
    }
    return winningCells;
}

function identifyEmptyCell(){
    for(let i = 1; i <= 4; i++){
        for(let j = 1; j <= 4; j++){
            if(cells[i][j].innerHTML == ""){
                cells[i][j].id = "Empty_Cell";
            }
            else{
                cells[i][j].id = "Cell";
            }
        }
    }
}

function check(cell){

    identifyEmptyCell();

    //8 Directions (indexes for 5674*0321)
    const deltaRow = [0, 1, 1, 1, 0, -1, -1, -1];
    const deltaColumn = [1, 1, 0, -1, -1, -1, 0, 1];
    let row = cell.parentElement;
    let coordRow = row.rowIndex;
    let coordCol = cell.cellIndex;

    //find empty cell based on 8 directions
    for(let i = 0; i < 7; i += 2){

        //check if coordinates exceeds board size
        coordRow += deltaRow[i];
        coordCol += deltaColumn[i];
        if((coordRow > 3) || (coordRow < 0)){
            //reset coordinates
            coordRow = row.rowIndex;
            coordCol = cell.cellIndex;
        }
        if((coordCol > 3) || (coordCol < 0)){
            //reset coordinates
            coordRow = row.rowIndex;
            coordCol = cell.cellIndex;
        }

        //get cell and check if empty
        cellItem = document.getElementById('Board').rows[coordRow].cells[coordCol];
        if(cellItem.id == "Empty_Cell"){
            //switch clicked cell and empty cell
            switchCell(cell, cellItem);
            return 1;
        }
        
        //reset coordinates back to clicked cell
        coordRow = row.rowIndex;
        coordCol = cell.cellIndex;
    }
    return 0;
}

function switchCell(cell, cellTarget){

    let row = cell.parentElement;
    let rowTarget = cellTarget.parentElement;
    
    //switch original and target
    let temp = cell.innerHTML;
    cell.innerHTML = cellTarget.innerHTML;
    cellTarget.innerHTML = temp;

    identifyEmptyCell();
}

function reset(){
    board.id = "Board";
    board.className = "";
    turns = 0;
    let cellCount = 1;
    for(let i = 1; i <= 4; i++){
        for(let j = 1; j <= 4; j++){
            cells[i][j].innerHTML = cellCount;

            if(cellCount == 16){
                cells[i][j].innerHTML = "";
            }

            cellCount++;
        }
    }
    identifyEmptyCell();
}

function scramble(){

    reset();

    //simulate clicking on random coords
    let scrambleAmt = 1000;
    let count = 0;
    i = 4;
    j = 4;
    while(count < scrambleAmt){
        randomi = Math.floor(Math.random() * i) + 1;
        i--;
        randomj = Math.floor(Math.random() * j) + 1;
        j--;

        cells[randomi][randomj].click();
        turns = 0; //reset turns from simulated clicks
        
        if(i == 1 || j == 1){
            i = 4;
            j = 4;
        }
        count++;
    }
}

function checkWin(){

    if(turns > 1){
        //check empty cell firt
        if(cells[4][4].id != "Empty_Cell"){
            return 0;
        }

        //check every cell
        let count = 1;
        for(let i = 1; i <= 4; i++){
            for(let j = 1; j <= 4; j++){
                if(cells[i][j].innerHTML == count.toString()){
                    count++;
                }
            }
        }
        if(count == 16){
            board.className = "Win_Board";
        }
    }
    return 0;
}