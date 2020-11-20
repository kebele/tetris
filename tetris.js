//canvas yükleme
const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');
//sabitler
const ROW = 30;
const COL = COLUMN = 15;
const SQ = squareSize = 20;
const VACANT = 'WHITE'; // boş karelerin rengi

//1
//kare çizme
/* 
ctx.fillStyle = 'red'; //renk
ctx.fillRect(0,0,50,50); //x koordinat, y koord., genişlik, yükseklik
//ctx.fillStyle = 'green';
//ctx.fillRect(150, 200, 50, 50); 
ctx.strokeStyle = 'BLACK';// border rengi
ctx.strokeRect(0,0,50,50); */
//border boyutları, fillRect ile aynı olursa çerçeve olur

/* bunların hepsini bir function içine alırsak yeniden kullanabiliriz. functionparametrelerine x, y, color koyarsak tam esnek yeniden kullanılabilir olur 

function draw(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,50,50);
    ctx.strokeStyle = 'GRAY';
    ctx.strokeRect(x,y,50,50);
}

//draw(100, 200,'green');

squareSize şeklinde yaparsak bu functionu tam kullanabileceğimiz şekilde ve kolay okunur olur, yani px tipinde x ve y koord larını sq şeklinde yapıyoruz böylelikle
*/

function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
    ctx.strokeStyle = 'GRAY';
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ)
}

//drawSquare(3,4,'green');

//2
//board u çizme
/* board bir array, square lerden oluşan bir array 20 row ve 10 column dan oluşacak, yukarıda tanımlı zaten bu yüzden for loop ile çizilecek */
//boradu yaptık
let board = [];
for ( r = 0; r < ROW; r++){
    board[r] = [];
    for( c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

//yaptığımız board u çizdiriyoruz
function drawBoard(){
    for ( r = 0; r < ROW; r++){
        //board[r] = [];
        for( c = 0; c < COL; c++){
            //board[r][c] = VACANT;
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

//3
//parçaları ve renklerini hazırlama
/* öncelikle piece oluşturmalıyız */

//3A
/* burada Piece adında bir constructor yapıyoruz 
constructorların isimlerinin ilk harfi genellikle büyük yapılır
tetromino dediğimiz şey tetris parçaları z, s, ı, t vb

yani mesela z şeklinin alabileceği tüm olası şekillerin olduğu array tetromino demek
bu parçalar ayrı bir array de olacak PIECES[] içinde hem isimleri hem renkleri ile olacak
bu constructor ın görevi teTromino nun ismini ve rengini verdiğimizde kullanılabilecek şekilde nesne oluşturmak
buna göre mesela teTromino Z gelecek bunun rengi red
tetrominoN ddiğimiz şey bu tetrominoların farklı şekillleri var döndürülebiliyorlaar buradaki N o tetriminonun kaçıncı şeklinde olacağı, 0 demek, 0. indis değeri yani ilk şeklinde olacak, Z ise Z şeklinde T ise T şeklinde
active Tetromino ise o anda üzerinde işlem yaptığımız tetromino ve activeTerominoN ise o anda işlem yaptığımız tetrominon işlem yaptığımız andaki indisindeki değeri
this.x
this.y
ise o terominon bulunduğu koordinatı gösteriyor, hareket bunların value sini yani 0 değerini değiştirerek olacak
*/
function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; //ilk patternden başlayacak
    this.activeTetromino = this.tetromino[this.tetrominoN];
    //oyun anında oynadığımız tatromino hali
    //parçaları kontrol edebilmemiz için başlangıç koord. lazım
    this.x = 3;//pozisyon, koordinat
    this.y = -2;// pozisyon
}

//3B
/* tetromino şekilleri ve renklerini tutan 3A da bahsettiğimiz array */
const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'brown'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange'],
    [U, 'lime'],
    [SS, 'aqua'],
    [OB, 'gray'],
    [H, 'indigo']
];
//parçayı başlatmak
/* burada hazırladığımız constructor functionunu kullanarak bir tetromino nesnesi üretiyoruz
let p = new Piece () diyerek p adında bir nesneyi Piece constructoru kullanarak yap diyoruz, constructorun ihtiyaç duyduğu ki parametre vardı,
birincisi tetromino
onu PIECES [] e git orada 0.indisteki 0. value yi al diyoruz bu Z
ikincisi color
bunuda yine PIECES [] e git orada 0. indisteki 1. value yi al diyoruz, oda renk zaten
let p = new Piece (PIECES[0][0], PIECES[0][1]);
böylelikle PIECES teki ilk elemanı nesne haline getiiryoruz. Bu nesnenin diğer özellikleri constructor içinde var zaten mesela hangi şekilde olacağı, bulunacağı yer 

  */
  

//3C
//burada bir parça çizdirmek
/* burada artık ekrana çizdirme kısmı
burada da mantık şöyle diyelim Z tetromino çizdireceğiz
const Z = [
    [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
]
Z nin bütün olası hallerini içweren bir array
let piece = Z[0];
mesela normal Z formunu çizdirmek istiyoruz
const pieceColor = "orange" rengi belirledik

for(r = 0; r < piece.length; r++){
    //burada dediğimiz şey r yani row 0 dan başlayacak Z[0]ın uzunluğu 3, r 3 ten küçük oldukça r yi bir arttıracak her döngüde bu sefer birde c ye bakacak yani column
    for(c = 0; c < piece.length; c++){
        //aynı şekilde column da 0 dan başlayacak c < piece.lengt yani 3 ten küçük oldukça 1 arttıracak ve aşağıdaki if i çalışıracak
        if(piece[r][c]){
            drawSquare(c,r,pieceColor);
            //yani piece[r][c] Z[0] arayında değeri 1 ise true ise orayı turuncuya boyayacak sonra for dönmeye devem eceke 0 yani false olduğunda atlayacak 1 yani true bulduğunda boyayacak, bu şekilde döngü bitene kadar devam edecek, döngü bittiğinde Z formu oluşur.
        }
    }
}
bunu bu şekilde her bir durum için ayrı ayrı yapacağımıza prototype kullanıyoruz ve Piece constructor una draw adında bir metod ekliyoruz
bu metod kendisine gelen tetrimino ve renk bilgisine göre ekrana terimino yu çizdiriyor
 */

 //let p = new Piece (PIECES[0][0], PIECES[0][1]);

/* Piece.prototype.draw = function(){
    for (r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //sadece dolu squares çizilecek
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, this.color);
            }
        }
    }
}
 */
//let x = new Piece (PIECES[2][0], PIECES[2][1]);
//p.draw();

//3D
/* aşağıya hareket için prototype yaptık*/

/* Piece.prototype.moveDown =  function(){
    this.y++;
    this.draw();
} */

//aşağıya hareketin function u her saniye aşağı hareket etmesi için
/* function drop(){
    p.moveDown();
    requestAnimationFrame(drop);
}
drop(); */
//aşağıya kadar boyayarak gider
//burada her saniye aşağı inmesi inerkende yukarıdan silinmesi lazım
//bunu zaman ile kontrol etmemiz lazım önce sonrada her aşağı inişte yukarıyı silmek lazım, yani vacant haline getirmek
/* let dropStart = Date.now();
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }    
    requestAnimationFrame(drop);
}
drop(); */
//bu hali ile saniyede 1 aşağı iniyor ama yukarıyı silmiyor
let dropStart = Date.now();
//9 adımdaki requestAnimationFrame ile ilgili update yapacağız
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
    //9. adımla ilgili
    //gameOver = true olduğunda requestAnimationFrame i durduracak, yani oyun bitecek
    //buradan sonra yeniden pPiece.prototype.lock a geri dönüp piece leri lock layacağız
    //requestAnimationFrame(drop);
}
//drop();

//üst tarafı silmesi
//bunun içib aşağı doğru draw prorotype ına benzer undraw prototype ı yapmamız gerekiyor, draw prototype ı temelde renge boyuyordu bu ise aynı kareleri vacant a boyayacak, sonrada noveDown functionu update edeceğiz yani functiona unDraw eleyeceğiz

/* Piece.prototype.unDraw = function(){
    for (r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //sadece dolu squares çizilecek
            if(this.activeTetromino[r][c]){
                drawSquare(this.x+c, this.y + r, VACANT);
            }
        }
    }
} */

// aşağıya hereket için updated moveDown prototype functionu
/* Piece.prototype.moveDown =  function(){
    this.unDraw();
    this.y++;
    this.draw();
} 

toplu durması için aşağı aldım
*/

//3E
/* 
BU NOKTAYA KADAR YAPTIĞIMIZ ŞEYLER
CANVASI OLUŞTURDUK
SQUARE OLUŞTURDUK
SQUARE ÇİZECEK FUNCTION YAPTIK
BOARD OLUŞTURDUK
BOARD ÇİZECEK FUNCTION YAPTIK
TETROMİNOLARIN ŞEKİLLERİNİ BELİRLEYEN ARRAY YAPTIK
TETROMİNO YAPACAK CONSTRUCTOR YAPTIK
BU CONSTRUCTOR A DRAW ADINDA BİR METHOD EKLEDİK
CONSTRUCTOR İLE YAPTIĞIMIZ NESNEYİ BOARD A ÇİZECEK FUNCTION
AŞAĞIYA DOĞRU HAREKETİ SAĞLAMAK İÇİN PIECE E moveDown METHODU EKLEDİK
HER SANİYE AŞAĞI HAREKETTE ÜST TARAFIDA SİLMESİ İÇN PİECE E unDraw METHODU EKLEDİK
ASAĞI HAREKET İÇİN moveDown METHODUNU 
    this.unDraw();
    this.y++;
    this.draw();
şeklinde güncelledik
aslında draw() ve unDraw() ile yaptığımız temelde kareleri piece rengini veya vacant a boyamaktan ibaret, bunu tek bir function halinede getirebiliriz
*/

//3F
/* draw() ve unDraw() ları yani prototype ile Piece constructor una eklediğimiz metodları tek bir metod haline getirebiliriz böyle daha iyi olur,
çünkü sonuçta bu ikli function da boyama yapıyor draw tetrominonun rengine boyuyor, unDraw ise VACANT boyuyor
Piece.prototype.fill(){
    xxxxxx
    xxxx
    xxx
} 
ekleriz buradaki fill in parametresi color olur
daha sonra 
Piece.prototype.draw= function (){
    this.fill(this.color);
}
Piece.prototype.unDraw =  function (){
    this.color(VACANT);
}

şeklinde methodları düzenleriz.


*/
//NETİCEDE...

//MOVE DOWN ı buraya aldım toplu dursun diye

/* Piece.prototype.moveDown =  function(){
    this.unDraw();
    this.y++;
    this.draw();
} */

Piece.prototype.moveDown =  function(){
    //6 adımdan gelen update ile collision detection yapacağız
    if(!this.collision(0,1, this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        //we lock the piece and generate a new one
        /* 8 adımdaki randomPiece() sonrası update
        */
        //9. adımdaki bordda lockladığımız squareleri burada kullanmamız gerekli
        this.lock();
        p = randomPiece();
        /* sürekli yeni şekiller geliyor ancak lock square olmuyor yani üst üste durmuyorlar hepsi tabana kadar iniyor */
    }
    
}

//fill function

Piece.prototype.fill = function(color){
    for (r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //sadece dolu squares çizilecek
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function(){
    this.fill(this.color);
}

Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

drop();

//4A
/* move right
moveDown prototype ını alıp right olarak değiştireceğiz */

/* Piece.prototype.moveRight =  function(){
    this.unDraw();
    this.x++;
    this.draw();
}
 */

 Piece.prototype.moveRight =  function(){
    //6 adımdan gelen update ile collision detection yapacağız
    if(!this.collision(1,0, this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }    
}


//4B move left

Piece.prototype.moveLeft =  function(){
    //6 adımdan gelen update ile collision detection yapacağız
    if(!this.collision(-1,0, this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

//4C rotate
/*  rotate için tetriminoN kullanacağız, tetrimino bir arraydi, içerisinde ilgili parçanın alabileceği şekilleri gösteren matris vardı, tetrimino iste o şekillerin her biri, burada bize indis lazım, bunuda şöyle yapacağız,
tetriminoN başlangıçta 0 yani ilk indis burada indisi bir tane arttıracağızburada sıkıntı yok ancak 4 tane veya kaç tane tetrimino varsa sonuncudan sonra tekrar ilk indise dönmesini istiyoruzbunuda kalan ile yapacağız, tetriminoN e 1 ekleyeceğiz ve toplam tetrimino sayısına böleceğiz kalan bizim indisimiz olacak, son tatriminoda kalan 0 olacağından ilk indise yani 0 aulaşacağız, brriliant
ayrıca her dönüşte activeTetriminoyu da update etmemiz gerekiyor
*/
/* Piece.prototype.rotate =  function(){
    this.unDraw();
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
} */

Piece.prototype.rotate =  function(){
    //6 adımdan gelen update ile collision detection yapacağız
    let nextPattern = this.tetromino[(this.tetrominoN + 1)% this.tetromino.length];
    let kick = 0;

    if(this.collision(0,0,nextPattern)){
        if(this.x > COLUMN/2){
            //burası sağ duvar
            kick = -1;
            //piece sola hareket etmeli
        } else {
            //burası sol duvar
            kick = 1;
            //piece sağa hareket etmeli
        }
    }

    //if(!this.collision(0,0,nextPattern)){
      //  this.unDraw();
       // this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        // this.activeTetromino = this.tetromino[this.tetrominoN];
        // this.draw();
    //}

    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        //(0+1)%4 =>1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw;
    }
}

//9
/* 
square Lock olayı
yani piece ler tabana kadar inmeyecek inen indiği son yerde lock olacak sonraki piece onun üstünde duracak oda lock olacak vb.
bunuda prototype ile çözeceğiz, bunuda for döngüleri ile yapacağız
*/

let score = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for( c = 0; c <this.activeTetromino.length; c++){
            //VACANT squareleri atlayacak
            if(!this.activeTetromino[r][c]){
                continue;
            }
            //piece to lock on top = game over
            if(this.y + r < 0){
                //stop request animation framework
                alert("Game Over!");
                gameOver = true;
                break;
                //buradan sonra drop function u update etmeliyiz
            }
            //we lock the piece
            board[this.y + r][this.x + c] = this.color;
            //buradan yeniden moveDown a gideceğiz
        }
    }
    //remove full rows
    for( r = 0; r < ROW; r++){
        let isFullrow = true;
        for( c = 0; c < COLUMN; c++){
            isFullrow = isFullrow && (board[r][c] != VACANT);
        }
        if(isFullrow){
            //bütün satır dolu ise
            //üstteki satırı bir aşağı getireceğiz
            for ( y = r; y > 1; y--){
                for( c=0; c <COLUMN; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            //en üstteki row da aşağı gelecek
            for(c=0; c < COLUMN; c++){
                board[0][c] = VACANT;
            }
            //scoru arttıracağız
            score += 10;

        }
    }
    //update the board
    drawBoard();
    //update the score
    scoreElement.innerHTML = score;
}


//5
//parçaları kontrol etme
/* addEventListener ile yapacağız 
burada bir problem olarak date.now eklemez isek her harekette daha hızlı aşağı iner, dropStart = Date.now() ile sğ sol yaptığımı sürece aşağı inmesini durduruyoruz
*/
document.addEventListener("keydown", CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38){
        p.rotate();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

//6
/* collision detection
yani sağ sol duvara değmesi konusu 
bunu da Piece constructor una method ekleyerek yapacağız
burada herhangibir hareket çizilmeden önce haraketin mümkün olup olmadığının sorgulaması yapılmalı
eğer herhangiri tarafta bir collision varsa hareket o tarafa yapılamamalı, yoksa devam etmeli, burada parçalar 3 yöne hareket edebildiği için sol, sağ ve aşağı, 3 yönde collision detection yapılamlı
sol ve sağ için x+1, x-1, aşağı için y+1 kontrolu yapılmalı
bunu for loop ile yapacağız
*/

Piece.prototype.collision = function(x,y,piece){
    for(r=0; r < piece.length; r++){
        for(c=0; c < piece.length; c++){
            if(!piece[r][c]){
                continue;
                //yani square boş ise devam
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            //şartlar
            if(newX < 0 || newX >= COLUMN || newY >= ROW ){
                return true;
                /* ilk şart sol tarafta collision
                ikincisi sağ taraftan collision, 3. şart ise aşağıdan collision
                return true yani collision var */
            }
           // skip newY < 0; board[-1] will crush our game
             if(newY <0 ){
                 continue;
             }
            /* boarddaki locked piece leri kontrol etme */
            if(board[newY][newX] != VACANT){
                return true;
                //collision var
            }
        }
    }
    return false;
    //yani collision yok
    //buradan sonra movement functionslarımızı update etmeliyiz
}

//8
/* random function
random piece üretme 
bundan sonra moveDown function ı update etmeliyiz*/

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length)
    //0 - 6 arası yani PIECES.length arası random sayı üretir
    return new Piece(PIECES[r][0], PIECES[r][1])
}

/*
let p = new Piece (PIECES[0][0], PIECES[0][1]);
şu ana kadar çalıştırmak için kullandığımız ifadeyi değiştiryoruz, önceden denemek için kullanıyorduk hep Z geliyordu şimdi bu random olacak
*/

let p = randomPiece();