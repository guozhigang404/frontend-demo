
function Gauss(imageObj, container, blur) {
    if(! imageObj instanceof Image) {
        throw new TypeError(imageObj + " 不是一个Image对象");
    }
    if(! container instanceof HTMLElement) {
        throw new TypeError(container + " 不是一个dom对象");
    }
    this.imageObj = imageObj;
    this.container = container;
    this.blur = blur || 200;
}

Gauss.prototype.gaussBlur = function(imgData) {
    let pixes = imgData.data;
    let width = imgData.width;
    let height = imgData.height;
    let gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        i, j, k, len;

    let radius = 10;
    let sigma = 5;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;

    }
    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                    //r,g,b,a 四个一组
                    i = (y * width + k) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
            // pixes[i + 3] = a ;
        }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;
                if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                    i = (k * width + x) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
        }
    }
    //end
    return imgData;
}

Gauss.prototype.blurImg = function () {
    let canvas = document.createElement('canvas');
    canvas.width = this.blur || 200;
    canvas.height = this.blur || 200;
    let context = canvas.getContext('2d');
    context.drawImage(this.imageObj, 0, 0, this.imageObj.width,
        this.imageObj.height, 0, 0, canvas.width, canvas.height);
    let imgData = context.getImageData(0, 0, 50, 50);
    let gaussData = this.gaussBlur(imgData);
    context.putImageData(gaussData, 0, 0);
    let imgSrc = canvas.toDataURL();

    this.container.style.backgroundImage = 'url(' + imgSrc + ')';
}



