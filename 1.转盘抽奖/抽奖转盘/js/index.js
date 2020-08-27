const parts = {
    panDom : document.getElementsByClassName("pan")[0],
    btnDom : document.getElementsByClassName("btn")[0],
    turnNum : 1 * 360,
    clicked : true,
    panTransition : `all 5s`
}
const lottery = new Lottery(parts);
lottery.init();