const IUE = (function () {
    let uid = 0;

    //为obj中的所有属性创建代理，为了监听属性是否被修改
    function constructProxy(vm, obj, namespace) { //vm表示IUE对象，obj表示要代理的对象，namespace表示要修改的属性全称
        let proxyObj = null;
        //使用递归代理obj中所有的属性
        if (obj instanceof Array) { //判断对象是否为数组
            proxyObj = new Array(obj.length);
            for (let i = 0; i < obj.length; i++) {
                proxyObj[i] = constructProxy(vm, obj[i], namespace);
            }
            proxyObj[obj.length] = proxyArr(vm, obj, namespace);//将数组最后一项添加为本数组代理
        } else if (obj instanceof Object) { //判断是否为对象
            proxyObj = getterAndSetterProxy(vm, obj, namespace);
        } else { //不是对象和数组类型，不再进行监听
            console.log(namespace + "." + obj + " is not Object or Array");
        }

        return proxyObj;
    }

    //为obj对象中的每个属性创建get和set方法
    function getterAndSetterProxy(vm, obj, namespace) {
        let proxyObj = {};

        for (let prop in obj) {
            const configObj = {//给属性赋值或者取值时触发get和set函数
                configurable: true,
                get() {
                    return obj[prop];
                },
                set(value) {
                    console.log("object");
                    obj[prop] = value;
                }
            }
            Object.defineProperty(proxyObj, prop, configObj);
            if (namespace === "") { //只有data下的属性才能放到vm实例上
                Object.defineProperty(vm, prop, configObj);
            }
            if (obj[prop] instanceof Object) { //是数组或对象
                proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(prop, namespace));
            }
        }

        return proxyObj;
    }

    function getNameSpace(currentProp, currentNamespace) {
        if (currentNamespace == null || currentNamespace == "") {
            return currentProp; //currentNamespace为空表示是data的属性，即第一层属性
        } else if (currentProp == null || currentProp == "") {
            return currentNamespace;
        } else {
            return currentNamespace + "." + currentProp;
        }
    }

    //代理数组
    function proxyArr(vm, arr, namespace) {
        let obj = {
            eleType: "Array",
            toString: function () { //重写toString()
                let result = "";
                for (let i = 0; i < arr.length; i++) {
                    result += arr[i] + ", ";
                }
                return result.substring(0, result.length - 2);
            },
            push() {}, //重写push()
            pop() {}, //重写pop()
            shift() {}, //重写shift()
            unshift() {} //重写unshift()
        };

        rewriteArrayFunc.call(vm, obj, "push", namespace);
        rewriteArrayFunc.call(vm, obj, "pop", namespace);
        rewriteArrayFunc.call(vm, obj, "shift", namespace);
        rewriteArrayFunc.call(vm, obj, "unshift", namespace);
        arr.__proto__ = obj;
        return arr;
    }

    //重写数组中的方法
    function rewriteArrayFunc(obj, func, namespace) {
        Object.defineProperty(obj, func, {
            enumerable:true,
            configurable:true,
            value:function(...args){//此处监听数组的函数，只要调用数组的函数，就会触发
                console.log("array");
                let original = Array.prototype[func];
                const result = original.apply(this, args);
                return result;
            }
        })
    }

    class IUE {
        constructor(options) {
            this.uid = uid++;
            this._isIUE = true; //带有下划线的属性是系统属性，外界不可修改的
            // 初始化data
            if (options && options.data) {
                //为IUE实例的options.data，创建代理
                this._data = constructProxy(this, options.data, "");
            }
            // 初始化created方法
            // 初始化methods
            // 初始化computed
            // 初始化el并挂载
        }
    }

    return IUE;
})();

export default IUE;