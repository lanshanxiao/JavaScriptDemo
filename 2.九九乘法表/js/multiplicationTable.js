class multiplicationTable{
    constructor(parts){
        this.inpNum = parts.inpNum;
        this.timer = parts.timer;
        this.btnStart = parts.btnStart,
        this.btnAuto = parts.btnAuto,
        this.btnStop = parts.btnStop,
        this.table = parts.table
    }
    startResult(){
        this.btnStart.addEventListener("click", ()=>{
            this.generateResult();
        });
    }
    generateResult(){
        if(!this.inpNum.value || isNaN(this.inpNum.value)){
            alert("请输入数字");
            this.inpNum.value = "";
            this.inpNum.focus();
        }
        let str = "";
        for(let i = 1; i <= this.inpNum.value; i++){
            str += "<tr>";
            for(let j = 1; j <= i; j++){
                str += `<td>${i} * ${j} = `+ i*j +`</td>`;
            }
            str += "</tr>";
        }
        this.table.innerHTML = str;
    }
    autoResult(){
        this.btnAuto.addEventListener("click", ()=>{
            if(this.timer){
                return;
            }
            let num = 0;
            this.timer = setInterval(()=>{
                this.inpNum.value = num++;
                this.generateResult();
            }, 1000);
        });
    }
    stopResult(){
        this.btnStop.addEventListener("click", ()=>{
            clearInterval(this.timer);
        });
    }
    init(){
        this.startResult();
        this.autoResult();
        this.stopResult();
    }
}