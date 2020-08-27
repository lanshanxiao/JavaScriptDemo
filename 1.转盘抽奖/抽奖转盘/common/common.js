class Common{
    constructor(){}
    static getRandom(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}