const parts = {
    inpNum: document.getElementById("num"),
    timer:null,
    btnStart: document.getElementById("start"),
    btnAuto: document.getElementById("auto"),
    btnStop: document.getElementById("stop"),
    table: document.getElementById("tab")
};

const multiTable = new multiplicationTable(parts);
multiTable.init();