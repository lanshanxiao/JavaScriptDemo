/**
 * 代码的可维护性，复用性
 * 1. 变量的语义化，
 * 2. 全局变量的污染
 * 3. 模块化  封装思想 设计模式
 */
class Lottery{
    constructor(parts){
        this.panDom = parts.panDom;
        this.btnDom = parts.btnDom;
        this.turnNum = parts.turnNum;
        this.clicked = parts.clicked;
        this.panTransition = parts.panTransition;
        this.randomNum = parts.randomNum;
        this.panDom = parts.panDom;
    }
    static getRandom(){
        return Math.floor(Math.random() * 360);
    }
    clickBtn(){
        this.btnDom.addEventListener("click", ()=>{
            if(this.clicked){
                this.randomNum = Common.getRandom(0, 360);
                this.degNum = this.turnNum + this.randomNum;
                this.panDom.style.transform = `rotate(${this.degNum}deg)`;
                console.log(this.randomNum);
                this.panDom.style.transition = this.panTransition;
                this.clicked = false;
            }
        });
    }
    rotateEnd(){
        this.panDom.addEventListener("transitionend", ()=>{
            this.panDom.style.transform = `rotate(${this.randomNum}deg)`;
            this.panDom.style.transition = "none";
            this.clicked = true;
            this.judgeWinner(this.randomNum);
        });
    }
    judgeWinner(randomNum){
        let str = "";
        console.log(randomNum)
        switch(true){
            case randomNum >= 180 && randomNum < 225:
                str = "一等";
                break;
            case randomNum >= 0 && randomNum < 45:
                str = "二等";
                break;
            case (randomNum >= 90 && randomNum < 135) || (randomNum >= 270 && randomNum < 315):
                str = "三等";
                break;
            case (randomNum >= 45 && randomNum < 90) || (randomNum >= 135 && randomNum < 180) || (randomNum >= 225 && randomNum < 270) || (randomNum >= 315 && randomNum <= 360):
                    str = "四等";
                    break;
            default:
                str = "谢谢参与";

        }
        alert(`恭喜获得${str}奖`);
    }
    init(){
        this.clickBtn();
        this.rotateEnd();
    }
}