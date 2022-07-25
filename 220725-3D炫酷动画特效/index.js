var boxBg = ['#f44336', '#e91e63', '#9c27b0',
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
    '#00bcd4', '#009688', '#4caf50', '#8bc34a',
    '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    '#ff5722', '#795548', '#564545', '#607d8b',
    '#405d6b', '#9e9e9e', '#70737d', '#389fa0',
    '#38a05e', '#b3c981', '#76a803', '#fecf43',
    '#e2785f'];	//box背景色
var bodyBg = ['#F7E8ED', '#F2D9E6', '#ECC6DE', '#E0ECF5',
    '#DDF4DE', '#F0F1D5', '#EEDECD', '#B8E6B3', '#ABE3D8',
    '#E0E1F5', '#F7E8ED', '#F2D9E6', '#E0ECF5', '#DDF4DE',
    '#F0F1D5', '#EEDECD', '#B8E6B3', '#ABE3D8', '#DFD1F0',
    '#6161616'];	//body背景色

//下(0)左(1)上(2)右(3)
var rot = ['rotateX(-180deg)', 'rotateY(-180deg)', 'rotateX(180deg)', 'rotateY(180deg)'];


// 设置style
var style = document.createElement("style");
var styleStr = "";

for (var i = 0; i < boxBg.length; i++) {
    styleStr += `.box:nth-child(${i + 1}) div{
        background: ${boxBg[i]} url(images/${i + 1}.png) no-repeat center;
    }`
}

style.innerHTML = styleStr;
document.head.appendChild(style);



var content = document.getElementById('content');
var boxs = document.querySelectorAll('.box');

boxs.forEach(function (box) {
    box.onmouseenter = function (ev) {
        // console.log(getDir(ev, this))
        var dir = getDeg(ev, this);
        console.log(dir)
        this.style.transform = 'translateZ(150px) ' + rot[dir];
        document.body.style.background = bodyBg[Math.round(Math.random() * (bodyBg.length - 1))];
    };
    box.onmouseleave = function () {
        this.style.transform = '';
    };
});


function getDeg(eventObject, dom) {
    var l = dom.getBoundingClientRect().left;
    var t = dom.getBoundingClientRect().top;
    var w = dom.offsetWidth;
    var h = dom.offsetHeight;

    var x = eventObject.clientX - l - w / 2;
    var y = eventObject.clientY - t - h / 2;

    var deg = Math.atan2(y, x) / (Math.PI / 180);

    return ((Math.round((deg + 180) / 90) + 3) % 4);
}

document.onmousemove = function (ev) {
    console.log(ev.clientX);
    /*
        
                        -4
                        -3
                        -2
                        -1
        -4  -3  -2  -1  0   1   2   3   4 
                        1
                        2
                        3
                        4


     */
    let x = (0.5 - ev.clientY / window.innerHeight) * 15;    //0~1 -0.5~0.5
    let y = (ev.clientX / window.innerWidth - 0.5) * 15;    //0~1 -0.5~0.5
    console.log("x: ", x, "y:", y);
    content.style.transform = 'perspective(1000px) rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
}

