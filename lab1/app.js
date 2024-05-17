const processArguments = (args) => {
    if (args.length !== 4) {
        console.log("Неправильна кількість аргументів. Очікувалося 4 аргументи.");
        return null;
    }
    const [value1, type1, value2, type2] = args;
    return [parseFloat(value1), type1, parseFloat(value2), type2];
};

const validateInput = (value1, type1, value2, type2) => {
    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        console.log("Неправильно вказані типи. Будь ласка, перевірте введені типи.");
        return false;
    }

    if (value1 <= 0 || value2 <= 0) {
        console.log("Значення повинні бути додатніми.");
        return false;
    }

    if ((type1 === "hypotenuse" && value1 === value2) || (type2 === "hypotenuse" && value1 === value2)){
        console.log("Гіпотенуза не може бути рівною катету.");
        return false;
    }

    if (type1 === "leg" && type2 === "leg" && (value1 < 1 || value2 < 1)) {
        console.log("Занадто мале значення одного з катетів. Перевірте введені дані.");
        return false;
    }

    if ((type1 === "leg" && type2 === "leg" && (value2 > value1) && (value2 < 1e-5 * value1)) || (type1 === "leg" && type2 === "leg" && (value1 > value2) && (value1 < 1e-5 * value2)) ){
        console.log("Занадто мале значення одного з катетів порівняно з іншим. Перевірте введені дані.");
        return false;
    }

    if (type1 === "hypotenuse" && type2 === "hypotenuse") {
        console.log("Дозволяється лише одне значення гіпотенузи.");
        return false;
    }

    if ((type1 === "adjacent angle" || type1 === "opposite angle" || type1 === "angle") && (value1 <= 0 || value1 >= 90)) {
        console.log(`Кут ${value1} не є валідним гострим кутом.`);
        return false;
    }

    if ((type2 === "adjacent angle" || type2 === "opposite angle" || type2 === "angle") && (value2 <= 0 || value2 >= 90)) {
        console.log(`Кут ${value2} не є валідним гострим кутом.`);
        return false;
    }

    return true;
};

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI);
};

const triangle = (value1, type1, value2, type2) => {
    if (!validateInput(value1, type1, value2, type2)) {
        return "failed";
    }

    let a, b, c, alpha, beta;

    try {
        if (type1 === "leg" && type2 === "leg") {
            a = value1;
            b = value2;
            c = Math.sqrt(a * a + b * b);
            alpha = radiansToDegrees(Math.asin(a / c));
            beta = radiansToDegrees(Math.asin(b / c));
        } else if ((type1 === "leg" && type2 === "hypotenuse") || (type1 === "hypotenuse" && type2 === "leg")) {
            c = type1 === "hypotenuse" ? value1 : value2;
            a = type1 === "leg" ? value1 : value2;
            if (a >= c) {
                console.log("Катет не може бути більшим або рівним гіпотенузі.");
                return "failed";
            }
            b = Math.sqrt(c * c - a * a);
            alpha = radiansToDegrees(Math.asin(a / c));
            beta = radiansToDegrees(Math.asin(b / c));
        } else if ((type1 === "leg" && type2 === "adjacent angle") || (type1 === "adjacent angle" && type2 === "leg")) {
            a = type1 === "leg" ? value1 : value2;
            alpha = type1 === "adjacent angle" ? value1 : value2;
            alpha = degreesToRadians(alpha);
            b = a / Math.tan(alpha);
            c = Math.sqrt(a * a + b * b);
            beta = radiansToDegrees(Math.asin(b / c));
            alpha = radiansToDegrees(alpha);
        } else if ((type1 === "leg" && type2 === "opposite angle") || (type1 === "opposite angle" && type2 === "leg")) {
            a = type1 === "leg" ? value1 : value2;
            beta = type1 === "opposite angle" ? value1 : value2;
            beta = degreesToRadians(beta);
            b = a / Math.tan(beta);
            c = Math.sqrt(a * a + b * b);
            alpha = radiansToDegrees(Math.asin(a / c));
            beta = radiansToDegrees(beta);
        } else if ((type1 === "hypotenuse" && type2 === "angle") || (type1 === "angle" && type2 === "hypotenuse")) {
            c = type1 === "hypotenuse" ? value1 : value2;
            alpha = type1 === "angle" ? value1 : value2;
            alpha = degreesToRadians(alpha);
            a = c * Math.sin(alpha);
            b = Math.sqrt(c * c - a * a);
            beta = radiansToDegrees(Math.asin(b / c));
            alpha = radiansToDegrees(alpha);
        } else {
            console.log("Неправильне поєднання типів.");
            return "failed";
        }

        console.log(`a = ${a}, b = ${b}, c = ${c}, alpha = ${alpha}°, beta = ${beta}°`);
        return "success";
    } catch (error) {
        console.log("Помилка в обчисленнях:", error);
        return "failed";
    }
};

const args = processArguments(process.argv.slice(2));
if (args) {
    const [value1, type1, value2, type2] = args;
    triangle(value1, type1, value2, type2);
}
