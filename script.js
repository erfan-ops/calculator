class Calculator {
    constructor () {
        this.mainInput = document.getElementById("mainInput");
        this.ops = ["+", "-"];
        this.result = "";
        this.radFlag = false;
        this.radFlagButton = document.getElementById("RFB");
        this.logt = Math.log10;
        this.lo = "";
        this.lang = document.getElementsByTagName("html")[0].getAttribute("lang");
        this.com = (1000).toLocaleString(this.lang)[1];
        this.facts = [];
        this.percents = [];
        this.sec1 = document.getElementById("s1");
        this.sec2 = document.getElementById("s2");
        this.sec2.hidden = true;
    }
    
    addNum (num2) {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        if (this.mainInput.value[this.mainInput.value.length-1] === "+" && num2 === "+") {return;}
        else if (this.isDigit(num2) && (/\d+$/.test(this.mainInput.value) && this.mainInput.value.match(/\d+$/)[0][0] === "0")) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + num2;
            this.result = this.result.slice(0, -1) + num2;
        }
        else if (num2 === "-" && this.mainInput.value[this.mainInput.value.length - 1] === "-") {
            this.mainInput.value = this.mainInput.value + num2;
            this.result += "(" + num2;
        }
        else if (this.isDigit(num2) && ")eπ%".includes(this.mainInput.value[this.mainInput.value.length - 1])){
            this.mainInput.value = this.mainInput.value + "×" + num2;
            this.result += "*" + num2;
        }
        else{
            this.mainInput.value = this.mainInput.value + num2;
            this.result += num2;
        }
        this.mainInput.value = this.addComma(this.mainInput.value);
    }

    addMathDiv () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";return;}
        if (this.mainInput.value === "" || this.mainInput.value[this.mainInput.value.length-1] === "÷") {return;}
        else if ("×-+".includes(this.mainInput.value[this.mainInput.value.length-1])) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + "÷";
            this.result = this.result.slice(0, -1) + "/";
            return
        }
        else {
            this.mainInput.value = this.mainInput.value + "÷";
            this.result += "/";
        }
    }

    addMathMul () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";return;}
        if (this.mainInput.value === "" || this.mainInput.value[this.mainInput.value.length-1] === "×") {return;}
        else if ("-+÷".includes(this.mainInput.value[this.mainInput.value.length-1])) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + "×";
            this.result = this.result.slice(0, -1) + "*";
            return
        }
        else {
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*";
        }
    }

    clearf () {
        this.mainInput.value = "";
        this.result = "";
    }

    evalfn () {
        let exp = this.result;
        if (this.isDigit(exp) && (exp !== String(this.roundFloat(Math.E)) && exp !== String(this.roundFloat(Math.PI))) && this.lo !== "") {
            exp += this.lo;
        }
    
        let p1len = exp.length - exp.replace(/[(]/g, "").length;
        let p2len = exp.length - exp.replace(/[)]/g, "").length;

        this.facts.forEach(elm => exp = exp.replace(elm+"!", `this.factorial(${elm})`))
        this.percents.forEach(elm => exp = exp.replace(elm+"%", `(${elm}/100)`))
    
        if(p1len > p2len){
            exp += ")".repeat(p1len-p2len);
        }

        this.calc(exp);
    }

    calc (exp) {
        let x = this.findLastOperationIndex();
        if (x !== -1) {
            let t = exp.slice(x+1, exp.length);
            let p1len = t.length - t.replace(/[(]/g, "").length;
            let p2len = t.length - t.replace(/[)]/g, "").length;
            t = t.slice(0, t.length - (p2len-p1len))
            this.lo = exp[x] + eval(t);
        }
        let result = String(this.roundFloat(eval(exp)));
        if (result === "NaN") {
            alert("Error");
            return;
        }
        this.result = result;
        this.mainInput.value = this.addComma(this.result);
    }

    addComma (str, sep=this.com) {
        str = str.replaceAll(sep, "");
        let numbers = str.match(/-*\d+(\.\d+)?/g);
        if (numbers === null) {return str;}
        let decimals = numbers.map((num) => {if (/\d+\.\d+/.test(num)) {return num.slice(num.indexOf("."), num.length);}});
        let result = numbers.map((num) => Number(num).toLocaleString(this.lang));
        if (result.includes("NaN")) {result.splice(result.indexOf("NaN"), 1);}
        result = result.map((num) => num.replace(",", sep));
        let answer = str;
        if (decimals[0] !== undefined) {
            var j = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].includes(".")) {result[i] = result[i].slice(0, result[i].indexOf(".")) + decimals[j];j++;}
                answer = answer.replace(numbers[i], result[i]);
            }
        }
        else {
            for (let i = 0; i < result.length; i++) {
                answer = answer.replace(numbers[i], result[i]);
            }
        }
        return answer;
    }

    findLastOperationIndex () {
        let x = this.result.lastIndexOf("*");
        let y = this.result.lastIndexOf("+");
        let i = this.result.lastIndexOf("-");
        let j = this.result.lastIndexOf("/");
        if(x < y){x = y;}
        if(x < i){x = i;}
        if(x < j){x = j;}
        return x;
    }

    roundFloat (x, dp=15) {
        return +parseFloat(x).toFixed(dp);
    }

    addDecimalPoint () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        let x = this.findLastOperationIndex();
        let temp = this.mainInput.value.slice(x + 1, this.mainInput.value.length);
        if(")eπ".includes(temp[temp.length - 1])){
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*"
        }
        if(temp === "" || "()eπ".includes(temp[temp.length - 1])){
            this.mainInput.value = this.mainInput.value + "0.";
            this.result += "0."
        }
        else if(!(temp.includes(".")) && this.isDigit(temp[temp.length - 1])){
            this.mainInput.value = this.mainInput.value + ".";
            this.result += "."
        }
    }

    bs () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";return;}
        if (!this.mainInput.value) {return;}
        if (this.mainInput.value[this.mainInput.value.length - 1] === "e") {
            this.mainInput.value = this.mainInput.value.slice(0, -1);
            let EIndex = this.result.lastIndexOf(this.roundFloat(Math.E));
            this.result = this.result.slice(0, (EIndex));
        }
        else if (this.mainInput.value[this.mainInput.value.length - 1] === "π") {
            this.mainInput.value = this.mainInput.value.slice(0, -1);
            let PIIndex = this.result.lastIndexOf(this.roundFloat(Math.PI));
            var x = 0;
            this.result = this.result.slice(0, (PIIndex));
        }
        else if (this.result.slice(-2, this.result.length) === "**" || this.mainInput.value[this.mainInput.value.length-1] === "-") {
            this.result = this.result.slice(0, -2);
            this.mainInput.value = this.mainInput.value.slice(0, -1);
        } else if (!("abcdefghijklmnopqrstuvwxyz∛".includes(this.mainInput.value.toLowerCase()[this.mainInput.value.length - 1]))) {
            this.mainInput.value = this.mainInput.value.slice(0, -1);
            this.result = this.result.slice(0, -1);
        } else {
            while ("abcdefghijklmnopqrstuvwxyz∛".includes(this.mainInput.value.toLowerCase()[this.mainInput.value.length - 1]) && this.mainInput.value) {
                this.mainInput.value = this.mainInput.value.slice(0, -1);
            }
            while ("abcdefghijklmnopqrstuvwxyz.".includes(this.result.toLowerCase()[this.result.length - 1]) && this.result) {
                this.result = this.result.slice(0, -1);
            }
        }
        this.mainInput.value = this.addComma(this.mainInput.value);
    }

    addClosingParentheses () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";return;}
        let temp = String(this.mainInput.value);
        let p1len = temp.length - temp.replace(/[(]/g, "").length;
        let p2len = temp.length - temp.replace(/[)]/g, "").length;
        let tempLastIndex = temp[temp.length - 1];
    
        if(p1len > p2len && this.isDigit(tempLastIndex, "eπ)!") && !".^+-×÷".includes(tempLastIndex)){
            this.mainInput.value = temp + ")";
            this.result += ")";
        }
    }

    addOpeningParentheses () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        if(this.mainInput.value[this.mainInput.value.length-1] !== "."){
            this.mainInput.value = this.mainInput.value + "(";
            this.result += "(";
        }
    }

    isDigit (x, exclusions = "eπ") {
        if (exclusions.includes(x)) {
            return true;
        } else {
            return /^-*\d+\.?(\.\d+)?$/.test(x);
        }
        
    }

    logf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Log(";
        this.result += "this.logt(";
    }

    lnf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = mainInput.value + "ln(";
        this.result += "Math.log(";
    }

    addE () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "e";
        this.result += String(this.roundFloat(Math.E));
        Math.asin
    }

    needMultiplySign (chars = "0123456789)eπ.%") {
        if (chars.includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*";
        }
    }

    addPi () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "π";
        this.result += String(this.roundFloat(Math.PI));
    }

    power () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        if ("0123456789)πe".includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value + "^";
            this.result += "**";
        }
    }

    squareRoot () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "√(";
        this.result += "Math.sqrt(";
    }

    cubeRoot () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "∛(";
        this.result += "Math.cbrt(";
    }

    absf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "abs(";
        this.result += "Math.abs(";
    }

    toFlag (x) {
        return x/180*Math.PI;
    }

    toFlag2 (x) {
        return x*180/Math.PI;
    }

    radFlagChange () {
        this.radFlag = !this.radFlag;
        if (this.radFlag) {
            this.toFlag = function (x) {
                return x;
            }
            this.toFlag2 = function (x) {
                return x;
            }
            this.radFlagButton.innerHTML = "Rad";
        } else {
            this.toFlag = this.radians;
            this.toFlag2 = this.degrees;
            this.radFlagButton.innerHTML = "Deg";
        }
    }

    sinf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "sin(";
        this.result += "this.sin(";
    }

    sin (x) {
        x = this.toFlag(x);
        return Math.sin(x);
    }

    asinf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "asin(";
        this.result += "this.asin(";
    }

    asin (x) {
        x = Math.asin(x);
        return this.toFlag2(x);
    }

    sinhf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "sinh(";
        this.result += "Math.sinh(";
    }

    asinhf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "asinh(";
        this.result += "Math.asinh(";
    }

    cosf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cos(";
        this.result += "this.cos(";
    }

    cos (x) {
        x = this.toFlag(x);
        return Math.cos(x);
    }

    acosf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acos(";
        this.result += "this.acos(";
    }

    acos (x) {
        x = Math.acos(x);
        return this.toFlag2(x);
    }

    coshf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cosh(";
        this.result += "Math.cosh(";
    }

    acoshf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acosh(";
        this.result += "Math.acosh(";
    }

    tanf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "tan(";
        this.result += "this.tan(";
    }

    tan (x) {
        x = this.toFlag(x);
        return Math.tan(x);
    }

    atanf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "atan(";
        this.result += "this.atan(";
    }

    atan (x) {
        x = Math.atan(x);
        return this.toFlag2(x);
    }

    tanhf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "tanh(";
        this.result += "Math.tanh(";
    }

    atanhf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "atanh(";
        this.result += "Math.atanh(";
    }

    cotf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cot(";
        this.result += "this.cot(";
    }

    cot (x) {
        this.toFlag(x);
        return Math.cos(x) / Math.sin(x);
    }

    acotf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acot(";
        this.result += "this.acot(";
    }

    acot (x) {
        x = this.atan(1/x);
        return this.toFlag2(x);
    }

    cothf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "coth(";
        this.result += "this.coth(";
    }

    coth (x) {
        return 1/Math.tanh(x);
    }

    acothf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acoth(";
        this.result += "this.acoth(";
    }

    acoth (x) {
        return Math.atanh(1/x);
    }

    radians (x) {
        return x/180*Math.PI;
    }

    Rad () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Rad(";
        this.result += "this.radians(";
    }

    degrees (x) {
        return x/Math.PI*180
    }

    Deg () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Deg(";
        this.result += "this.degrees(";
    }

    getExpBefore () {
        let t = this.result.match(/\d+\)+$/g);
        if (t[0] === undefined) {return;}
        t = t[0];
        var opReached = 0;
        var p2len = t.length - t.replace(/[)]/g, "").length;
        for (var i = this.result.indexOf(t); opReached < p2len; i--) {
            if (opReached === p2len) {break;}
            if (this.result[i] === "(") {opReached++;continue;}
        }
        i++;
        var elm2 = this.result.slice(i, this.result.indexOf(t)+t.length);
        var j = this.result.indexOf(elm2)-1;
        while (j > 0) {
            if (this.result[j] && /\w|\./.test(this.result[j])) {j--;continue;}
            j++;
            break;
        }
        t = this.result.slice(j, this.result.indexOf(t)+t.length);
        return t;
    }

    factorial (x) {
        if (x === 0) {
            return 1;
        }
        let result = x
        for (let i = 2; i < x; i++) {
            result *= i;
        }
        return result;
    }

    addFactorial () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";return;}
        if (/\.\d+$/.test(this.mainInput.value)) {
            alert("can't get the factorial of a floating point number");
        }
        else if (/\d+$/.test(this.mainInput.value)) {
            this.facts.push(this.mainInput.value.match(/\d+$/));
            this.mainInput.value = this.mainInput.value + "!";
            this.result += "!";
        }
        else {
            let t = this.getExpBefore();
            if (/\d+\.\d+/.test(String(this.roundFloat(eval(t))))) {
                alert("can't get the factorial of a floating point number");
                return;
            }
            else {
                this.mainInput.value = this.mainInput.value + "!";
                this.result += "!";
                this.facts.push(t);
            }
        }
    }

    addPercent () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        if (/-*\d+\.?(\.\d+)?$/.test(this.mainInput.value)) {
            this.percents.push(this.mainInput.value.match(/\d+\.?(\.\d+)?$/)[0]);
        }
        else {
            let t = this.getExpBefore();
            this.percents.push(t);
        }
        this.mainInput.value = this.mainInput.value + "%";
        this.result += "%";
    }

    changeFunctions () {
        if (this.sec1.hidden) {
            this.sec1.hidden = false;
            this.sec2.hidden = true;
        } else {
            this.sec1.hidden = true;
            this.sec2.hidden = false;
        }
    }
}

const cal = new Calculator();
keyPressSound = document.getElementById("kps");

window.addEventListener("keydown", function (event) {
    keyPressSound.play();
    if (event.defaultPrevented) {
        return;
    }
    let nums = "0123456789+-".split("");
    nums.forEach(num => {if (event.key === num) {cal.addNum(num);}});
    switch (event.key.toLocaleLowerCase()) {
        case "enter":
            cal.evalfn();
            break;
        case "=":
            cal.evalfn();
            break;
        case "c":
            cal.clearf();
            break;
        case ".":
            cal.addDecimalPoint();
            break;
        case "*":
            cal.addNum("×");
            break;
        case "/":
            cal.addNum("÷");
            break;
        case "(":
            cal.addOpeningParentheses();
            break;
        case ")":
            cal.addClosingParentheses();
            break;
        case "backspace":
            cal.bs();
            break;
        case "e":
            cal.addE();
            break;
        case "^":
            cal.power();
            break;
        case "!":
            cal.addFactorial();
            break;
        default:
            return;
    }
    event.preventDefault();
}, true);