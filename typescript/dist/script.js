"use strict";
class Calculator {
    constructor() {
        this.mainInput = document.getElementById("mainInput");
        this.result = "";
        this.radFlag = false;
        this.radFlagButton = document.getElementById("rfg");
        this.logt = Math.log10;
        this.lo = "";
        this.lang = document.getElementsByTagName("html")[0].getAttribute("lang");
        this.com = "";
        this.facts = [];
        this.percents = [];
        this.sec1 = document.getElementById("s1");
        this.sec2 = document.getElementById("s2");
        this.bar = document.getElementById("sideBar");
        this.barBtn = document.getElementById("bar");
        this.barClose = document.getElementById("barclose");
        this.barIsVisible = false;
        this.swapBtn = document.getElementById("swap");
    }
    init() {
        this.sec2.hidden = true;
        this.barClose.style.display = "none";
        this.bar.style.left = "-300px";
        this.com = (1000).toLocaleString(this.lang)[1];
    }
    addNum(num2) {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        if (this.mainInput.value[this.mainInput.value.length - 1] === "+" && num2 === "+") {
            return;
        }
        else if (this.isDigit(num2) && (/\d+$/.test(this.mainInput.value) && this.mainInput.value.match(/\d+$/)[0][0] === "0")) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + num2;
            this.result = this.result.slice(0, -1) + num2;
        }
        else if (num2 === "-" && this.mainInput.value[this.mainInput.value.length - 1] === "-") {
            this.mainInput.value = this.mainInput.value + num2;
            this.result += "(" + num2;
        }
        else if (this.isDigit(num2) && ")eπ%".includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value + "×" + num2;
            this.result += "*" + num2;
        }
        else {
            this.mainInput.value = this.mainInput.value + num2;
            this.result += num2;
        }
        this.mainInput.value = this.addComma(this.mainInput.value);
    }
    addMathDiv() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
            return;
        }
        if (this.mainInput.value === "" || this.mainInput.value[this.mainInput.value.length - 1] === "÷") {
            return;
        }
        else if ("×-+".includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + "÷";
            this.result = this.result.slice(0, -1) + "/";
            return;
        }
        else {
            this.mainInput.value = this.mainInput.value + "÷";
            this.result += "/";
        }
    }
    addMathMul() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
            return;
        }
        if (this.mainInput.value === "" || this.mainInput.value[this.mainInput.value.length - 1] === "×") {
            return;
        }
        else if ("-+÷".includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value.slice(0, -1) + "×";
            this.result = this.result.slice(0, -1) + "*";
            return;
        }
        else {
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*";
        }
    }
    clearf() {
        this.mainInput.value = "";
        this.result = "";
        this.lo = "";
        this.facts = [];
        this.percents = [];
    }
    evalfn(str = this.result) {
        if (str === "") {
            alert("Error");
            return;
        }
        let exp = str;
        if (this.isDigit(exp) && (exp !== String(this.roundFloat(Math.E)) && exp !== String(this.roundFloat(Math.PI))) && this.lo !== "") {
            exp += this.lo;
        }
        this.facts.forEach(elm => exp = exp.replace(elm + "!", `this.factorial(${elm})`));
        this.percents.forEach(elm => exp = exp.replace(elm + "%", `(${elm}/100)`));
        const p1len = exp.length - exp.replace(/[(]/g, "").length;
        const p2len = exp.length - exp.replace(/[)]/g, "").length;
        if (p1len > p2len) {
            exp += ")".repeat(p1len - p2len);
        }
        this.calc(exp);
    }
    calc(exp) {
        const x = this.findLastOperationIndex(exp);
        var op = exp[x];
        if (exp[x + 1] === "*") {
            op = "**";
        }
        if (x !== -1) {
            let t = exp.slice(x + op.length, exp.length);
            const p1len = t.length - t.replace(/[(]/g, "").length;
            const p2len = t.length - t.replace(/[)]/g, "").length;
            t = t.slice(0, t.length - (p2len - p1len));
            this.lo = op + eval(t);
        }
        let result = String(this.roundFloat(eval(exp)));
        if (result === "NaN") {
            alert("Error");
            return;
        }
        this.result = result;
        this.mainInput.value = this.addComma(this.result);
    }
    replaceAll(str, searchValue, repaceValue) {
        str.split("").forEach(elm => {
            if (elm === searchValue) {
                str = str.slice(0, str.indexOf(elm)) + repaceValue + str.slice(str.indexOf(elm) + 1, str.length);
            }
        });
        return str;
    }
    addComma(str, sep = this.com) {
        str = this.replaceAll(str, sep, "");
        const numbers = str.match(/-*\d+(\.\d+)?/g);
        if (numbers === null) {
            return str;
        }
        const decimals = numbers.map((num) => { if (/\d+\.\d+/.test(num)) {
            return num.slice(num.indexOf("."), num.length);
        } });
        let result = numbers.map((num) => Number(num).toLocaleString(this.lang));
        if (result.includes("NaN")) {
            result.splice(result.indexOf("NaN"), 1);
        }
        result = result.map((num) => num.replace(",", sep));
        let answer = str;
        if (decimals[0] !== undefined) {
            var j = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].includes(".")) {
                    result[i] = result[i].slice(0, result[i].indexOf(".")) + decimals[j];
                    j++;
                }
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
    findLastOperationIndex(exp = this.result) {
        let x = exp.lastIndexOf("*");
        const y = exp.lastIndexOf("+");
        const i = exp.lastIndexOf("-");
        const j = exp.lastIndexOf("/");
        const a = exp.lastIndexOf("**");
        if (x < y) {
            x = y;
        }
        if (x < i) {
            x = i;
        }
        if (x < j) {
            x = j;
        }
        if (x - 1 === a) {
            x = a;
        }
        return x;
    }
    roundFloat(x, dp = 15) {
        return +parseFloat(String(x)).toFixed(dp);
    }
    addDecimalPoint() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        const x = this.findLastOperationIndex();
        const temp = this.mainInput.value.slice(x + 1, this.mainInput.value.length);
        if (")eπ".includes(temp[temp.length - 1])) {
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*";
        }
        if (temp === "" || "()eπ".includes(temp[temp.length - 1])) {
            this.mainInput.value = this.mainInput.value + "0.";
            this.result += "0.";
        }
        else if (!(temp.includes(".")) && this.isDigit(temp[temp.length - 1])) {
            this.mainInput.value = this.mainInput.value + ".";
            this.result += ".";
        }
    }
    bs() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
            return;
        }
        if (!this.mainInput.value) {
            return;
        }
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
        else if (this.result.slice(-2, this.result.length) === "**" || this.mainInput.value[this.mainInput.value.length - 1] === "-") {
            this.result = this.result.slice(0, -2);
            this.mainInput.value = this.mainInput.value.slice(0, -1);
        }
        else if (!("abcdefghijklmnopqrstuvwxyz∛".includes(this.mainInput.value.toLowerCase()[this.mainInput.value.length - 1]))) {
            this.mainInput.value = this.mainInput.value.slice(0, -1);
            this.result = this.result.slice(0, -1);
        }
        else {
            while ("abcdefghijklmnopqrstuvwxyz∛".includes(this.mainInput.value.toLowerCase()[this.mainInput.value.length - 1]) && this.mainInput.value) {
                this.mainInput.value = this.mainInput.value.slice(0, -1);
            }
            while ("abcdefghijklmnopqrstuvwxyz.".includes(this.result.toLowerCase()[this.result.length - 1]) && this.result) {
                this.result = this.result.slice(0, -1);
            }
        }
        this.mainInput.value = this.addComma(this.mainInput.value);
    }
    addClosingParentheses() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
            return;
        }
        const temp = String(this.mainInput.value);
        const p1len = temp.length - temp.replace(/[(]/g, "").length;
        const p2len = temp.length - temp.replace(/[)]/g, "").length;
        const tempLastIndex = temp[temp.length - 1];
        if (p1len > p2len && this.isDigit(tempLastIndex, "eπ)!") && !".^+-×÷".includes(tempLastIndex)) {
            this.mainInput.value = temp + ")";
            this.result += ")";
        }
    }
    addOpeningParentheses() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        if (this.mainInput.value[this.mainInput.value.length - 1] !== ".") {
            this.mainInput.value = this.mainInput.value + "(";
            this.result += "(";
        }
    }
    isDigit(x, exclusions = "eπ") {
        if (exclusions.includes(x)) {
            return true;
        }
        else {
            return /^-*\d+\.?(\.\d+)?$/.test(x);
        }
    }
    logf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Log(";
        this.result += "this.logt(";
    }
    lnf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "ln(";
        this.result += "Math.log(";
    }
    addE() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "e";
        this.result += String(this.roundFloat(Math.E));
        Math.asin;
    }
    needMultiplySign(chars = "0123456789)eπ.%") {
        if (chars.includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value + "×";
            this.result += "*";
        }
    }
    addPi() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "π";
        this.result += String(this.roundFloat(Math.PI));
    }
    power() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        if ("0123456789)πe".includes(this.mainInput.value[this.mainInput.value.length - 1])) {
            this.mainInput.value = this.mainInput.value + "^";
            this.result += "**";
        }
    }
    squareRoot() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "√(";
        this.result += "Math.sqrt(";
    }
    cubeRoot() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "∛(";
        this.result += "Math.cbrt(";
    }
    absf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "abs(";
        this.result += "Math.abs(";
    }
    toFlag(x) {
        return x / 180 * Math.PI;
    }
    toFlag2(x) {
        return x * 180 / Math.PI;
    }
    radFlagChange() {
        this.radFlag = !this.radFlag;
        if (this.radFlag) {
            this.toFlag = function (x) {
                return x;
            };
            this.toFlag2 = function (x) {
                return x;
            };
            this.radFlagButton.innerHTML = "Rad";
        }
        else {
            this.toFlag = this.radians;
            this.toFlag2 = this.degrees;
            this.radFlagButton.innerHTML = "Deg";
        }
    }
    sinf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "sin(";
        this.result += "this.sin(";
    }
    sin(x) {
        x = this.toFlag(x);
        return Math.sin(x);
    }
    asinf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "asin(";
        this.result += "this.asin(";
    }
    asin(x) {
        x = Math.asin(x);
        return this.toFlag2(x);
    }
    sinhf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "sinh(";
        this.result += "Math.sinh(";
    }
    asinhf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "asinh(";
        this.result += "Math.asinh(";
    }
    cosf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cos(";
        this.result += "this.cos(";
    }
    cos(x) {
        x = this.toFlag(x);
        return Math.cos(x);
    }
    acosf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acos(";
        this.result += "this.acos(";
    }
    acos(x) {
        x = Math.acos(x);
        return this.toFlag2(x);
    }
    coshf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cosh(";
        this.result += "Math.cosh(";
    }
    acoshf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acosh(";
        this.result += "Math.acosh(";
    }
    tanf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "tan(";
        this.result += "this.tan(";
    }
    tan(x) {
        x = this.toFlag(x);
        return Math.tan(x);
    }
    atanf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "atan(";
        this.result += "this.atan(";
    }
    atan(x) {
        x = Math.atan(x);
        return this.toFlag2(x);
    }
    tanhf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "tanh(";
        this.result += "Math.tanh(";
    }
    atanhf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "atanh(";
        this.result += "Math.atanh(";
    }
    cotf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "cot(";
        this.result += "this.cot(";
    }
    cot(x) {
        this.toFlag(x);
        return Math.cos(x) / Math.sin(x);
    }
    acotf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acot(";
        this.result += "this.acot(";
    }
    acot(x) {
        x = this.atan(1 / x);
        return this.toFlag2(x);
    }
    cothf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "coth(";
        this.result += "this.coth(";
    }
    coth(x) {
        return 1 / Math.tanh(x);
    }
    acothf() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "acoth(";
        this.result += "this.acoth(";
    }
    acoth(x) {
        return Math.atanh(1 / x);
    }
    radians(x) {
        return x / 180 * Math.PI;
    }
    Rad() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Rad(";
        this.result += "this.radians(";
    }
    degrees(x) {
        return x / Math.PI * 180;
    }
    Deg() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        this.needMultiplySign();
        this.mainInput.value = this.mainInput.value + "Deg(";
        this.result += "this.degrees(";
    }
    getExpBefore() {
        let t = this.result.match(/\d+\)+$/g);
        if (t[0] === undefined) {
            return;
        }
        let t2 = t[0];
        var opReached = 0;
        const p2len = t2.length - t2.replace(/[)]/g, "").length;
        for (var i = this.result.indexOf(t2); opReached < p2len; i--) {
            if (opReached === p2len) {
                break;
            }
            if (this.result[i] === "(") {
                opReached++;
                continue;
            }
        }
        i++;
        const elm2 = this.result.slice(i, this.result.indexOf(t2) + t2.length);
        var j = this.result.indexOf(elm2) - 1;
        while (j > 0) {
            if (this.result[j] && /\w|\./.test(this.result[j])) {
                j--;
                continue;
            }
            break;
        }
        j++;
        let t3 = this.result.slice(j, this.result.indexOf(t2) + t2.length);
        return t3;
    }
    factorial(x) {
        if (x === 0) {
            return 1;
        }
        let result = x;
        for (let i = 2; i < x; i++) {
            result *= i;
        }
        return result;
    }
    addFactorial() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
            return;
        }
        if (/\.\d+$/.test(this.mainInput.value)) {
            alert("can't get the factorial of a floating point number");
        }
        else if (/\d+$/.test(this.mainInput.value)) {
            this.facts.push(this.mainInput.value.match(/\d+$/));
            this.mainInput.value = this.mainInput.value + "!";
            this.result += "!";
        }
        else {
            const t = this.getExpBefore();
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
    addPercent() {
        if (this.mainInput.value === "Infinity") {
            this.mainInput.value = "";
            this.result = "";
        }
        if (/-*\d+\.?(\.\d+)?$/.test(this.mainInput.value)) {
            this.percents.push(this.mainInput.value.match(/\d+\.?(\.\d+)?$/)[0]);
        }
        else {
            const t = this.getExpBefore();
            this.percents.push(t);
        }
        this.mainInput.value = this.mainInput.value + "%";
        this.result += "%";
    }
    changeFunctions() {
        if (this.sec1.hidden) {
            this.sec1.hidden = false;
            this.sec2.hidden = true;
        }
        else {
            this.sec1.hidden = true;
            this.sec2.hidden = false;
        }
    }
    showBar() {
        this.bar.style.left = "0";
        if (window.innerHeight < window.innerWidth) {
            this.barBtn.style.display = "none";
        }
        this.barIsVisible = true;
        this.barClose.style.animation = "fadeIn 0.5s ease";
        this.barClose.style.opacity = "1";
        this.barClose.style.display = "block";
    }
    hideBar() {
        this.bar.style.left = "-300px";
        this.barBtn.style.display = "block";
        this.barIsVisible = false;
        this.barClose.style.animation = "fadeOut 0.5s ease";
        this.barClose.style.opacity = "0";
        this.barClose.style.display = "none";
    }
    barEsc() {
        if (this.barIsVisible) {
            this.hideBar();
        }
        else {
            this.showBar();
        }
    }
}
const cal = new Calculator();
cal.init();
var keyPressSound = document.getElementById("kps");
var options = document.getElementById("sel");
var fontOptions = document.getElementById("sel2");
function changeKeyboardSound() {
    var selectedValue = options.selectedIndex;
    if (selectedValue !== -1) {
        keyPressSound.src = `sounds/keypress${selectedValue}.wav`;
        keyPressSound.load();
    }
}
function changeFont() {
    var selectedValue = fontOptions.options[fontOptions.selectedIndex].value;
    if (fontOptions.selectedIndex === -1 || selectedValue === "sans-serif") {
        document.querySelectorAll('*').forEach(elm => { elm.style.fontFamily = 'sans-serif, serif'; });
    }
    else if (selectedValue === "serif") {
        document.querySelectorAll('*').forEach(elm => { elm.style.fontFamily = 'serif, sans-serif'; });
    }
    else {
        document.querySelectorAll('*').forEach(elm => { elm.style.fontFamily = `${selectedValue}, sans-serif, serif`; });
    }
}
window.addEventListener("keydown", function (event) {
    if (keyPressSound.readyState) {
        keyPressSound.pause();
        keyPressSound.currentTime = 0;
        keyPressSound.play();
    }
    if (event.defaultPrevented) {
        return;
    }
    let nums = "0123456789+-".split("");
    nums.forEach(num => { if (event.key === num) {
        cal.addNum(num);
    } });
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
                }
                catch (_a) {
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
//# sourceMappingURL=script.js.map