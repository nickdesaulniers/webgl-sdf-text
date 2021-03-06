// See also:
// https://github.com/libgdx/libgdx/blob/master/extensions/gdx-tools/src/com/badlogic/gdx/tools/distancefield/DistanceFieldGenerator.java

function getASmallCanvasCtx() {
    var canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 50;
    return canvas.getContext('2d');
};

// gets an index into a linear array
function getIndex (x, y, width) {
    return (x + y * width) * 4;
};

// http://homepages.inf.ed.ac.uk/rbf/HIPR2/distance.htm
// http://homepages.inf.ed.ac.uk/rbf/HIPR2/metric.htm
function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.sqrt(Math.pow(y2 - y1, 2)));
};

function isInside(rgba) {
    // Not checking alpha
    return (rgba & 0x80808000) != 0;
};

// returns the four subsequent elements as a 32b int
function readPixel(imgData, index) {
    return ((imgData.data[index    ] << 24) | 0) +
           ((imgData.data[index + 1] << 16) | 0) +
           ((imgData.data[index + 2] << 8)  | 0) +
             imgData.data[index + 3];
};

function writePixel(imgData, index, val) {
    imgData.data[index    ] = (val & 0xFF000000) >>> 24;
    imgData.data[index + 1] = (val & 0x00FF0000) >>> 16;
    imgData.data[index + 2] = (val & 0x0000FF00) >>> 8;
    imgData.data[index + 3] = (val & 0x000000FF);
};

// http://thomasdiewald.com/blog/?p=1994
function distanceTransform(imgData) {

    // A pass on the input first to detect if a pixel is "in" or "out."
    for (var y = 0; y < imgData.height; ++y) {
        for (var x = 0; x < imgData.width; ++x) {
            var currentIndex = getIndex(x, y, imgData.width);
            var inside = isInside(readPixel(imgData, currentIndex));
            writePixel(imgData, currentIndex, inside ? 0xFF0000FF : 0x00FF00FF);
        }
    }

    // Now we can create our distance maps

    // Second Pass
    /*for (y = imgData.height - 1; y > 0; --y) {
        for (x = imgData.width - 1; x > 0; --x) {
            var currentIndex = getIndex(x, y, imgData.width);
            var currentValue = imgData.data[currentIndex];

            var distanceToRight = euclideanDistance(x, y, x + 1, y);
            var distanceToBottom = euclideanDistance(x, y, x, y + 1);
            var distanceToBottomLeft = euclideanDistance(x, y, x - 1, y + 1);
            var distanceToBottomRight = euclideanDistance(x, y, x + 1, y + 1);

            var smallest = Math.min(distanceToRight, distanceToBottom, distanceToBottomLeft, distanceToBottomRight);

            imgData.data[currentIndex] = smallest;
        }
    }*/
};

var ctx = getASmallCanvasCtx();
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.font = '16pt Arial';
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(ctx.canvas.width / 3, ctx.canvas.height / 3, ctx.canvas.width / 3, ctx.canvas.height / 3);
//ctx.fillText('hello world', 0, 10);

var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
distanceTransform(imgData);
var ctx2 = getASmallCanvasCtx();
ctx2.putImageData(imgData, 0, 0);

document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(ctx.canvas);
    document.body.appendChild(ctx2.canvas);
});