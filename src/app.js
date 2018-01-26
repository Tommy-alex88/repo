var firstBall = null;
var secondBall = null;
var canPick = true;
var tempX = null;
var tempY = null;
var temp = null;
var toCheck = false;
var ballsArray = [];
var ballsTable = [];
var score = 0;

var app = new PIXI.Application(500, 500);
document.body.appendChild(app.view);
var gameScene = new PIXI.Container();
app.stage.addChild(gameScene);
var sceneFrame = new PIXI.Sprite.fromImage('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Gold_square.svg/500px-Gold_square.svg.png');
gameScene.addChild(sceneFrame);
const loader = new PIXI.loaders.Loader();
loader
    .add('images/sprites/sprites.json')
    .load(onLoaded);

function onLoaded() {
    score = 0;
    // Выбор 25 шаров разных цветов
    randBall();
    // вывод шаров на экран
    for (var i = 0; i < 5; i++) {
        ballsTable[i] = [];
        for (var j = 0; j < 5; j++) {
            // новый Sprite
            var ball = newBall(i, j);
            ballsTable[i][j] = ball; // обновляем нашу таблицу
            app.stage.addChild(ball);
            animateAtStart(ball);


            console.log(ballsTable[i][j].name + " имеет индексы: " + i + " " + j);
        } // конец цикла по j
        requestAnimationFrame(animate);
    } // конец цикла по i
    checkRowsAndColumns();
    processArray();
}

// функция создания шара с координатами x и y случайного цвета
function newBall(x, y) {
    var sprite = PIXI.Sprite.fromFrame(ballsArray[x * 5 + y]);
    sprite.name = getColor(ballsArray[x * 5 + y]); //Определяем цвет шара по спрайтшиту
    sprite.theValue = 1;
    //TweenMax.to(sprite.position, 0.5, {x: 75*x+100, y: 75*y+100 });
    sprite.position.set(100 + x * 75, 100 + y * 75);
    sprite.buttonMode = true;
    sprite.interactive = true;
    sprite.isSelected = false;
    sprite._anchor.set(0.5);
    sprite.alpha = 1;
    sprite.on('click', onButtonClick);
    sprite.on('removed', fillUpVacancies);
    return sprite;
}

// проверка строк и столбцов на наличие трех и более одноцветных шаров подряд
function checkRowsAndColumns() {

    //console.log("Запуск обработки строк...");
    toCheck = false;
    for (var j = 0; j < 5; j++) {
        var count = 0;
        var color = null;
        var index = 0;
        for (var i = 0; i < 5; i++) {
            if (ballsTable[i][j] !== null && ballsTable[i][j].name === color) {
                count += 1;
                index = i;
                if (count >= 2 && index === 4) {
                    console.log("Есть повторяющиеся шары в конце строки");
                    toCheck = true;
                    for (var m = index - count; m <= index; m++) {
                        if (ballsTable[m][j] !== null) {
                            console.log(ballsTable[m][j].name + " подлежит удалению. Индекс: " + m + " " + j);
                            ballsTable[m][j].theValue = 0;
                        }
                    }
                }
                else {
                    if (count >= 2) {
                        console.log("Есть повторяющиеся шары в строках");
                        toCheck = true;
                        for (m = index - count; m <= index; m++) {
                            if (ballsTable[m][j] !== null) {
                                console.log(ballsTable[m][j].name + " подлежит удалению. Индекс: " + m + " " + j);
                                ballsTable[m][j].theValue = 0;
                            }
                        }
                    }
                }
            }
            else {
                if (ballsTable[i][j] !== null) {
                    color = ballsTable[i][j].name;
                    count = 0;
                }
            }
        }
    }
    console.log("Обработка строк завершена!");

    //console.log("Запуск обработки столбцов...");
    for (i = 0; i < 5; i++) {
        count = 0;
        color = null;
        index = 0;

        for (j = 0; j < 5; j++) {

            if (ballsTable[i][j] !== null && ballsTable[i][j].name === color) {
                count += 1;
                index = j;
                if (count >= 2 && index === 4) {
                    console.log("Есть повторяющиеся шары в конце столбца");
                    toCheck = true;
                    for (m = index - count; m <= index; m++) {
                        if (ballsTable[i][m] !== null) {
                            console.log(ballsTable[i][m].name + " подлежит удалению. Индекс: " + i + " " + m);
                            ballsTable[i][m].theValue = 0;
                        }
                    }
                }
                else {
                    if (count >= 2) {
                        console.log("Есть повторяющиеся шары в столбцах");
                        toCheck = true;
                        for (m = index - count; m <= index; m++) {
                            if (ballsTable[i][m] !== null) {
                                console.log(ballsTable[i][m].name + " подлежит удалению. Индекс: " + i + " " + m);
                                ballsTable[i][m].theValue = 0;
                            }
                        }
                    }
                }
            }
            else {
                if (ballsTable[i][j] !== null) {
                    color = ballsTable[i][j].name;
                    count = 0;
                }
            }
        }
    }
    console.log("Обработка столбцов завершена!");


}

// заполнение вакансий, образованных после "сгорания" шаров
function fillUpVacancies() {

    // вместо таймаута вставить анимацию заполнения
setTimeout(function() {
    console.log("Заполняем вакансии...");
    for (var i = 0; i < 5; i++) {
        var toCreate = 0;
        console.log("В процессе столбец: " + i);
        for (var j = 4; j >= 0; j--) {
            if (j !== 0 && ballsTable[i][j] === null && ballsTable[i][j - 1] === null) {
                console.log("Обрабатываемый индекс: " + j + ". Нет шара ни здесь, ни сверху");
                toCreate++;
            }
            else if (j !== 0 && ballsTable[i][j] === null && ballsTable[i][j - 1] !== null) {
                console.log("Обрабатываемый индекс: " + j + ". Нет шара здесь, зато есть сверху");

                new TweenMax(ballsTable[i][j-1].position, 0.2, {x: (100+75*i), y: (100+75*(j+toCreate))});
                console.log("Обновляем массив", i, j);
                ballsTable[i][j + toCreate] = ballsTable[i][j - 1]; // обновляем наш массив
                ballsTable[i][j - 1] = null; // обнуляем в нашем массиве верхний шар таблицы

                // ballsTable[i][j - 1].position.set(100 + 75 * i, 100 + 75 * (j + toCreate)); // сдвигаем шар в нижнее пустое положение
                // ballsTable[i][j + toCreate] = ballsTable[i][j - 1]; // обновляем наш массив
                // ballsTable[i][j - 1] = null; // обнуляем в нашем массиве верхний шар таблицы
            }
            //если нет самого верхнего шара в таблице
            else if (j === 0 && ballsTable[i][j] === null) {
                console.log("Обрабатываемый индекс: " + j + ". Нет шара в верху таблицы");

                ballsArray = [];
                randBall();

                for (var c = 0; c <= toCreate; c++) {  // создаем шары в количестве toCreate
                    var ball = newBall(i, c);
                    ball.scale.x = 0.75; ball.scale.y = 0.75;


                    new TweenMax(ball.scale, 0.2, {x: 1, y: 1, delay: 0.2,onComplete: lateCheck});
                    app.stage.addChild(ball);

                    ballsTable[i][c] = ball;                   // обновляем нашу таблицу

                    console.log(ballsTable[i][c].name + " " + i + " " + c + " создан");
                }
            }
        }
        console.log("Обработан столбец: " + i);
    }

    function lateCheck() {
        setTimeout(function () {
            checkRowsAndColumns();
            processArray();
        }, 50);
    }
    console.log("закончили");
    toCheck = true;
}, 100);
}

// обработчик события клика по шару
function onButtonClick() {
    if (canPick) {  // можем ли выбрать шар
        if (!this.isSelected) {   // шар не выбран
            this.isSelected = true; // выбираем шар
            this.scale.x = 0.75;  // меняем размер
            this.scale.y = 0.75;
            console.log(this.position.x, this.position.y, this.name, this.theValue);

            if (firstBall == null) { // выбранный шар первый
                firstBall = this;
                console.log(this.name + " - должен быть первым");
            }
            else { // выбранный шар второй
                secondBall = this;
                console.log(this.name + " - должен быть вторым");
                canPick = false; // больше двух шаров не можем выбрать здесь дальше логика по замене шаров
                // если шары рядом, то начинаем их менять местами
                if (((firstBall.position.x === secondBall.position.x && (firstBall.position.y === secondBall.position.y - 75 || firstBall.position.y === secondBall.position.y + 75)) ||
                        (firstBall.position.y === secondBall.position.y && (firstBall.position.x === secondBall.position.x - 75 || firstBall.position.x === secondBall.position.x + 75))) &&
                    (isMoveRight(ballsTable, firstBall, secondBall))) {

                    console.log(firstBall.name, secondBall.name);

                    tempX = firstBall.position.x;
                    tempY = firstBall.position.y;
                    // firstBall.scale.x = 0.75; firstBall.scale.y = 0.75;
                    TweenMax.to(firstBall.position, 0.1, {x: secondBall.position.x, y: secondBall.position.y});
                    TweenMax.to(secondBall.position, 0.1, {x: tempX, y: tempY});
                    // firstBall.position.set(secondBall.position.x, secondBall.position.y);
                    // secondBall.position.set(tempX, tempY);
                    setTimeout(function () {
                        firstBall.scale.x = 1;  // меняем размер первого шара обратно
                        firstBall.scale.y = 1;
                        secondBall.scale.x = 1;  // меняем размер второого шара обратно
                        secondBall.scale.y = 1;
                        firstBall.isSelected = false;
                        secondBall.isSelected = false;
                        // Обновляем таблицу новыми значениями двух шаров и уничтожаем копии
                        ballsTable[(firstBall.position.x - 100) / 75][(firstBall.position.y - 100) / 75] = firstBall;
                        ballsTable[(secondBall.position.x - 100) / 75][(secondBall.position.y - 100) / 75] = secondBall;
                        firstBall = null;
                        secondBall = null;
                        canPick = true;
                        console.log("шары поменял местами");
                        checkRowsAndColumns();
                        processArray();
                    }, 150);

                }
                else {  // если шары не рядом, то возвращаем все как было или ход невозможен
                    console.log("Ход невозможен или не приводит к сгоранию шаров");
                    setTimeout(function () {
                    firstBall.isSelected = false;
                    secondBall.isSelected = false;
                    firstBall.scale.x = 1;  // меняем размер первого шара обратно
                    firstBall.scale.y = 1;
                    secondBall.scale.x = 1;  // меняем размер второого шара обратно
                    secondBall.scale.y = 1;
                    firstBall = null;
                    secondBall = null;
                    canPick = true;
                    }, 300);
                }
            }
        } else {
            this.scale.x = 1;  // меняем размер обратно, если шар уже выбран
            this.scale.y = 1;
            this.isSelected = false; // отмена выбора
            firstBall = null;
        }
    }
}

// функция обработки массива и подготовки его для совершения следующего игрового действия
function processArray() {
    setTimeout(function () {
        //while (toCheck) {
        removeBalls(ballsTable);
        requestAnimationFrame(animate);
        console.log("Надо ли проверять дополнительно?.. ", toCheck);
        // }
        if (!isMovePossible(ballsTable)) {
            console.log("GAME OVER");
        }
    }, 50);
}

// функция удаления шаров на основании проверки массива методом checkRowsAndColumns()
function removeBalls(arg) {

        for ( var i = 0; i < 5; i++) {
        for ( var j = 0; j < 5; j++) {
            if (arg[i][j].theValue === 0) {
                new TweenMax(arg[i][j].scale, 0.05, {x: 0.1, y: 0.1, onComplete: del, onCompleteParams: [arg, i, j]});
            }
        }
    }

    function del(arg, i, j) {
            console.log("Запускаем удаление", i, j);
        app.stage.removeChild(arg[i][j]);
        arg[i][j] = null;
        score = score + 100;
        console.log(score);
    }
}

// поулчение рандомного массива спрайтов
function randBall() {
    while (ballsArray.length < 25) {
        var candidate = Math.floor(Math.random() * 5);
        ballsArray.push(candidate);
    }
}

// проверка хода: если сгорание произойдет - ход возможен, если нет - то замена шаров невозможна
function isMoveRight(table, b1, b2) {
    // моделирование ситуации выполнения хода
    var tempBall1= b1;
    var tempBall2 = b2;
    table[(b1.position.x - 100) / 75][(b1.position.y - 100) / 75] = tempBall2;
    table[(b2.position.x - 100) / 75][(b2.position.y - 100) / 75] = tempBall1;

    checkRowsAndColumns(table); // проводим проверку сгорания после хода
    // возвращаем все как было
    table[(b1.position.x - 100) / 75][(b1.position.y - 100) / 75] = tempBall1;
    table[(b2.position.x - 100) / 75][(b2.position.y - 100) / 75] = tempBall2;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
        table[i][j].theValue = 1;
        }
    }

    // получаем ответ на наш вопрос о сгорании после хода
    return (toCheck);

}

// проверка наличия ходов в gameScene
function isMovePossible(table) {

    for (var i=0; i<4; i++){
        for(var j=0; j<4; j++) {

            var ball1 = table[i][j];
            var ball2 = table[i + 1][j];
            if (isMoveRight(table, ball1, ball2)) {
                console.log("Есть ход по горизонтали");
                return true;
            }
            ball2 = table[i][j + 1];
            if (isMoveRight(table, ball1, ball2)) {
                console.log("Есть ход по вертилкали");
                return true;
            }
        }
    }
    console.log("Ходов больше нет");
    return false;
}
// анимация при первой загрузке таблицы
function animateAtStart(ball){

    ball.scale.x = 0.1; ball.scale.y = 0.1;
    TweenMax.to(ball, 0.3, {rotation:360 * Math.PI / 180});
    TweenMax.to(ball.scale, 0.3, {x: 1, y: 1});
}

// функция для сопоставления цвета шаров с их номером в спрайтшите
function getColor(arr) {
    switch (arr) {
        case (0):
            return "red";
        case (1):
            return "green";
        case (2):
            return "blue";
        case (3):
            return "yellow";
        case (4):
            return "violet";
    }
}

// запрос рендеринга при первой возможности
function animate() {
    requestAnimationFrame(animate);
    app.render();
}