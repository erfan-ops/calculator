// im implementing my own BigInt type so it can be used in old javascript versions
/*
class BigNumber {
    value: string = "";
    constructor(value: number | string) {
        this.value = String(value);
    }

    toStr (x :number | BigNumber | string): string {
        if (x instanceof BigNumber) {
            return x.value
        }
        else {
            return String(x);
        }
    }

    toInt (x :number | BigNumber | string): number {
        if (x instanceof BigNumber) {
            return Number(x.value);
        }
        else {
            return Number(x);
        }
    }


    add (x: number | BigNumber | string): BigNumber {
        var n2 = this.toStr(x);
        var result: string = this.value.slice(0, this.value.length-n2.length) + "0".repeat(n2.length);
        var l = n2.length;
        if (n2.length > this.value.length) {
            var l = this.value.length
            var result: string = n2.slice(0, n2.length-this.value.length) + "0".repeat(this.value.length);
        }
        for (let i = 1; i <= l; i++) {
            let n: string = String(Number(n2[n2.length-i]) + Number(this.value[this.value.length-i]));
            for (let j = 1; j <= n.length; j++) {
                let s: string = String(Number(n[n.length-j]) + Number(result[result.length-i]));
                result = result.slice(0, result.length-j-i+1) + s + result.slice(result.length-j-i+2, result.length);
            }
        }
        return new BigNumber(result);
    }

    subtract(x: number | BigNumber | string): BigNumber {

    }


    mul (x: number | BigNumber | string): BigNumber {
        var n2 = Number(x);
        var result: BigNumber = new BigNumber(this.value);
        for (var i = 1; i < n2; i++) {
            result.add(this.value);
        }

        return result;
    }
}
*/


class Calculator {
    mainInput = document.getElementById("mainInput") as HTMLInputElement;
    result = "";
    radFlag = false;
    radFlagButton = document.getElementById("rfg")!;
    logt = Math.log10;
    lo = "";
    lang = document.getElementsByTagName("html")[0].getAttribute("lang")!;
    com: string = "";
    facts = [];
    percents = [];
    sec1 = document.getElementById("s1")!;
    sec2 = document.getElementById("s2")!;
    bar = document.getElementById("sideBar")!;
    barBtn = document.getElementById("bar")!;
    barClose = document.getElementById("barclose")!;
    barIsVisible = false;
    swapBtn = document.getElementById("swap")!;

    init(): void {
        this.sec2.hidden = true;
        this.barClose.style.display = "none";
        this.bar.style.left = "-300px"
        this.com = (1000).toLocaleString(this.lang)[1]
    }

    addNum (num2: string) {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        if (this.mainInput.value[this.mainInput.value.length-1] === "+" && num2 === "+") {return;}
        else if (this.isDigit(num2) && (/\d+$/.test(this.mainInput.value) && this.mainInput.value.match(/\d+$/)![0][0] === "0")) {
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
        this.lo = "";
        this.facts = [];
        this.percents = [];
    }

    evalfn (str = this.result) {
        if (str === "") {
            alert("Error");
            return;}
        
        let exp = str;
        if (this.isDigit(exp) && (exp !== String(this.roundFloat(Math.E)) && exp !== String(this.roundFloat(Math.PI))) && this.lo !== "") {
            exp += this.lo;
        }

        this.facts.forEach(elm => exp = exp.replace(elm+"!", `this.factorial(${elm})`))
        this.percents.forEach(elm => exp = exp.replace(elm+"%", `(${elm}/100)`))

        const p1len = exp.length - exp.replace(/[(]/g, "").length;
        const p2len = exp.length - exp.replace(/[)]/g, "").length;
    
        if(p1len > p2len) {
            exp += ")".repeat(p1len-p2len);
        }

        this.calc(exp);
    }

    calc (exp: string) {
        const x = this.findLastOperationIndex(exp);
        var op = exp[x];
        if (exp[x+1] === "*") {op = "**";}
            if (x !== -1) {
            let t = exp.slice(x+op.length, exp.length);
            const p1len = t.length - t.replace(/[(]/g, "").length;
            const p2len = t.length - t.replace(/[)]/g, "").length;
            t = t.slice(0, t.length - (p2len-p1len));
            this.lo = op + eval(t);
        }
        let result = String(this.roundFloat(eval(exp)));
        if (result === "NaN") {
            alert("Error");
            return;
        }
        if (Number(result) > Number.MAX_SAFE_INTEGER) {
            result = String(BigInt(result));
        }
        this.result = result;
        this.mainInput.value = this.addComma(this.result);
    }

    // uncomment if using js<2021 is necessary
    // replaceAll(str: string, searchValue: string, repaceValue: string) {
    //     str.split("").forEach(elm => {
    //         if (elm === searchValue) {
    //             str = str.slice(0, str.indexOf(elm)) + repaceValue + str.slice(str.indexOf(elm)+1, str.length);
    //         }
    //     });

    //     return str;
    // }

    addComma (str: string, sep=this.com) {
        //str = this.replaceAll(str, sep, "");
        str = str.replaceAll(sep, "");
        const numbers = str.match(/-*\d+(\.\d+)?/g);
        if (numbers === null) {return str;}
        const decimals = numbers.map((num: any) => {if (/\d+\.\d+/.test(num as string)) {return num.slice((num as string).indexOf("."), (num as string).length);}});
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

    findLastOperationIndex (exp = this.result) {
        let x = exp.lastIndexOf("*");
        const y = exp.lastIndexOf("+");
        const i = exp.lastIndexOf("-");
        const j = exp.lastIndexOf("/");
        const a = exp.lastIndexOf("^");
        if (x < y) {x = y;}
        if (x < i) {x = i;}
        if (x < j) {x = j;}
        if (x-1 < a) {x = a;}
        return x;
    }

    roundFloat (x: number, dp=15) {
        return +parseFloat(String(x)).toFixed(dp);
    }

    addDecimalPoint () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        const x = this.findLastOperationIndex(this.mainInput.value);
        const temp = this.mainInput.value.slice(x+1, this.mainInput.value.length);
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
            const EIndex = this.result.lastIndexOf(String(this.roundFloat(Math.E)));
            this.result = this.result.slice(0, (EIndex));
        }
        else if (this.mainInput.value[this.mainInput.value.length - 1] === "π") {
            this.mainInput.value = this.mainInput.value.slice(0, -1);
            const PIIndex = this.result.lastIndexOf(String(this.roundFloat(Math.PI)));
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
        const temp = String(this.mainInput.value);
        const p1len = temp.length - temp.replace(/[(]/g, "").length;
        const p2len = temp.length - temp.replace(/[)]/g, "").length;
        const tempLastIndex = temp[temp.length - 1];
    
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

    isDigit (x: string, exclusions = "eπ") {
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
        this.mainInput.value = this.mainInput.value + "ln(";
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

    toFlag (x: number) {
        return x/180*Math.PI;
    }

    toFlag2 (x: number) {
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

    sin (x: number) {
        x = this.toFlag(x);
        return Math.sin(x);
    }

    asinf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "asin(";
        this.result += "this.asin(";
    }

    asin (x: number) {
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

    cos (x: number) {
        x = this.toFlag(x);
        return Math.cos(x);
    }

    acosf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acos(";
        this.result += "this.acos(";
    }

    acos (x: number) {
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

    tan (x: number) {
        x = this.toFlag(x);
        return Math.tan(x);
    }

    atanf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "atan(";
        this.result += "this.atan(";
    }

    atan (x: number) {
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

    cot (x: number) {
        this.toFlag(x);
        return Math.cos(x) / Math.sin(x);
    }

    acotf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acot(";
        this.result += "this.acot(";
    }

    acot (x: number) {
        x = this.atan(1/x);
        return this.toFlag2(x);
    }

    cothf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "coth(";
        this.result += "this.coth(";
    }

    coth (x: number) {
        return 1/Math.tanh(x);
    }

    acothf () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acoth(";
        this.result += "this.acoth(";
    }

    acoth (x: number) {
        return Math.atanh(1/x);
    }

    radians (x: number) {
        return x/180*Math.PI;
    }

    Rad () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Rad(";
        this.result += "this.radians(";
    }

    degrees (x: number) {
        return x/Math.PI*180
    }

    Deg () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Deg(";
        this.result += "this.degrees(";
    }

    getExpBefore () {
        let t = this.result.match(/\d+\)+$/g)!;
        if (t[0] === undefined) {return;}
        let t2 = t[0];
        var opReached = 0;
        const p2len = t2.length - t2.replace(/[)]/g, "").length;
        for (var i = this.result.indexOf(t2); opReached < p2len; i--) {
            if (opReached === p2len) {break;}
            if (this.result[i] === "(") {opReached++;continue;}
        }
        i++;
        const elm2 = this.result.slice(i, this.result.indexOf(t2)+t2.length);
        var j = this.result.indexOf(elm2)-1;
        while (j > 0) {
            if (this.result[j] && /\w|\./.test(this.result[j])) {j--;continue;}
            break;
        }
        j++;
        let t3 = this.result.slice(j, this.result.indexOf(t2)+t2.length);
        return t3;
    }

    factorial (x: number) {
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
            this.facts.push(this.mainInput.value.match(/\d+$/) as never);
            this.mainInput.value = this.mainInput.value + "!";
            this.result += "!";
        }
        // else if (/\d+\!$/.test(this.mainInput.value)) {
        //     this.facts.push(this.mainInput.value.match(/\d+\!$/));
        //     this.mainInput.value = this.mainInput.value + "!";
        //     this.result += "!";
        // }
        else {
            const t = this.getExpBefore();
            if (/\d+\.\d+/.test(String(this.roundFloat(eval(t!))))) {
                alert("can't get the factorial of a floating point number");
                return;
            }
            else {
                this.mainInput.value = this.mainInput.value + "!";
                this.result += "!";
                this.facts.push(t as never);
            }
        }
    }

    addPercent () {
        if (this.mainInput.value === "Infinity") {this.mainInput.value = "";this.result = "";}
        if (/-*\d+\.?(\.\d+)?$/.test(this.mainInput.value)) {
            this.percents.push(this.mainInput.value.match(/\d+\.?(\.\d+)?$/)![0] as never);
        }
        else {
            const t = this.getExpBefore();
            this.percents.push(t as never);
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

    showBar () {
        this.bar.style.left = "0";
        if(window.innerHeight < window.innerWidth){
            this.barBtn.style.display = "none";
        }        
        this.barIsVisible = true;
        this.barClose.style.animation = "fadeIn 0.5s ease"
        this.barClose.style.opacity = "1";
        this.barClose.style.display = "block";
    }

    hideBar () {
        this.bar.style.left = "-300px";
        this.barBtn.style.display = "block";
        this.barIsVisible = false;
        this.barClose.style.animation = "fadeOut 0.5s ease"
        this.barClose.style.opacity = "0";
        this.barClose.style.display = "none";
    }

    barEsc () {
        if (this.barIsVisible) {
            this.hideBar();
        } else {
            this.showBar();
        }
    }
}

const cal = new Calculator();
cal.init();


window.addEventListener("keydown", function (event) {
    if (ui.keyPressSound.readyState && ui.selectedKPSvalue !== 0) {
        ui.keyPressSound.pause();
        ui.keyPressSound.currentTime = 0;
        ui.keyPressSound.play();
    }
    if (event.defaultPrevented) {
        return;
    }
    let nums = "0123456789+-".split("");
    nums.forEach(num => {if (event.key === num) {cal.addNum(num);}});

    if (event.ctrlKey) {
        switch (event.key.toLocaleLowerCase()) {
            case "c":
                var copyText = cal.mainInput.value;
                this.navigator.clipboard.writeText(copyText);
                return;
            case "x":
                var copyText = cal.mainInput.value;
                this.navigator.clipboard.writeText(copyText);
                cal.clearf();
                break;
            case "v":
                try {
                    let t = String(this.navigator.clipboard.readText());
                    cal.evalfn(t);
                } catch {
                    this.alert("can't calculate");
                }
                break;
        }
    }
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
            cal.addMathMul();
            break;
        case "/":
            cal.addMathDiv();
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
        case "%":
            cal.addPercent();
            break;
        case "escape":
            cal.barEsc();
            break;
        case "arrowleft":
            cal.changeFunctions();
            break;
        case "arrowright":
            cal.changeFunctions();
            break;
        default:
            return;
    }
    event.preventDefault();
}, true);


class UI {
    isDay: boolean = true;
    themeBtn: HTMLButtonElement = document.getElementById("theme") as HTMLButtonElement;
    options = document.getElementById("sel") as HTMLSelectElement;
    keyPressSound = document.getElementById("kps") as HTMLAudioElement;
    fontOptions = document.getElementById("sel2") as HTMLSelectElement;
    daCookieString = document.cookie;
    cookies: Array<string> = document.cookie.split("|");
    selectedKPSvalue: number = 0;

    init () {
        if (this.cookies[0] === "night") {
            this.setNightTheme();
        }
        if (this.cookies[1] === undefined) {
            this.cookies[1] = "sans-serif, serif";
        }
        
        document.querySelectorAll('*').forEach(elm => {(elm as HTMLElement).style.fontFamily = this.cookies[1];});
        this.fix_cookies();
    }

    changeTheme() {
        if (this.isDay) {
            this.setNightTheme();
        }
        else {
            this.setDayTheme();
        }
    }

    fix_cookies() {
        this.daCookieString = "";
        this.cookies.forEach(cookie => {this.daCookieString = `${this.daCookieString}${cookie}|`;});
        document.cookie = this.daCookieString;
        
    }

    setDayTheme() {
        this.isDay = true;
        this.themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>'
        document.documentElement.style.setProperty('--primaryColor', '#573300');
        document.documentElement.style.setProperty('--secondaryColor', '#c99d61');
        document.documentElement.style.setProperty('--color3', '#402500');
        document.documentElement.style.setProperty('--color4', '#472300');
        this.cookies[0] = "day";
        this.fix_cookies();
    }


    setNightTheme() {
        this.isDay = false;
        this.themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>'
        document.documentElement.style.setProperty('--primaryColor', '#48b4e9');
        document.documentElement.style.setProperty('--secondaryColor', '#072556');
        document.documentElement.style.setProperty('--color3', '#2894c9');
        document.documentElement.style.setProperty('--color4', '#b8dcff');
        this.cookies[0] = "night";
        this.fix_cookies();
        
    }

    changeKeyboardSound () {
        this.selectedKPSvalue = this.options.selectedIndex;
        if (this.selectedKPSvalue !== 0) {
            this.keyPressSound.src = `sounds/keypress${this.selectedKPSvalue}.wav`;
            this.keyPressSound.load();
        }
    }
    
    changeFont () {
        var selectedValue = this.fontOptions.options[this.fontOptions.selectedIndex].value;
        var font = "";
        if (this.fontOptions.selectedIndex === -1  || selectedValue === "sans-serif") {
            font = 'sans-serif, serif';
        } else if (selectedValue === "serif") {
            font = 'serif, sans-serif';
        } else {
            font = `${selectedValue}, sans-serif, serif`;
        }

        document.querySelectorAll('*').forEach(elm => {(elm as HTMLElement).style.fontFamily = font;});
        this.cookies[1] = font;
        this.fix_cookies();
        console.log(font);
    }
}

const ui: UI = new UI();
ui.init();
