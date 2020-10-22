var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var param = {
    arr: [], // 获取到的音频数据
    x: 0.5, // 中心点x轴
    y: 0.7, // 中心点y轴
    color: "rgba(255, 255, 255, 1.0)", // 颜色
    shadowColor: "rgba(255, 255, 0, 1.0)", // 模糊颜色
    colorT: 1, // 颜色透明度
    shadowColorT: 1, // 模糊颜色透明度
    shadowBlur: 48, // 模糊大小
    lineWidth: 4, // 线宽
    range: 100, // 振幅
    spacing: 1, // 间距
    base: true, // 是否有最小高度
    round: false, // 是否启用线条圆角
}

/* 监听配置 */
var myStyle = '';
window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        // 背景图
        if (properties.image) {
            if (properties.image.value) {
                document.body.style.backgroundImage = "url('file:///" + properties.image.value + "')";
            } else {
                document.body.style.backgroundImage = "url('bg.jpg')";
            }
        }
        //频谱图样式
        if (properties.spectrumStyle) {
            
            if (properties.spectrumStyle.value == 1) {
                //条状
                //alert('我是条状的');
                myStyle = 'line';
                //alert('line')

            } else if ((properties.spectrumStyle.value == 2)) {
                //圆形
                // alert('我是圆形的');
                myStyle = 'round';
               // alert('round')

            }
        }
        // 背景填充样式
        if (properties.gackgroundStyle) {
            var style = "cover";
            var repeat = "no-repeat";
            switch (properties.gackgroundStyle.value) {
                case 1: // 填充
                    style = 'cover';
                    break;
                case 2: // 适应
                    style = 'contain';
                    break;
                case 3: // 拉伸
                    style = '100% 100%';
                    break;
                case 4: // 平铺
                    style = 'initial';
                    repeat = 'repeat';
                    break;
                case 5: // 居中
                    style = 'initial';
                    break;
            }
            document.body.style.backgroundSize = style;
            document.body.style.backgroundRepeat = repeat;
        }
        // 颜色
        if (properties.color) {
            param.color = properties.color.value.split(' ').map(function (c) { return Math.ceil(c * 255) });
            ctx.strokeStyle = 'rgba(' + param.color + ',' + param.colorT + ')';
        }
        // 颜色透明度
        if (properties.colorT) {
            param.colorT = properties.colorT.value / 100;
            ctx.strokeStyle = 'rgba(' + param.color + ',' + param.colorT + ')';
        };
        // 模糊颜色
        if (properties.shadowColor) {
            param.shadowColor = properties.shadowColor.value.split(' ').map(function (c) { return Math.ceil(c * 255) });
            ctx.shadowColor = 'rgba(' + param.shadowColor + ',' + param.shadowColorT + ')';
        };
        // 模糊透明度
        if (properties.shadowColorT) {
            param.shadowColorT = properties.shadowColorT.value / 100;
            ctx.shadowColor = 'rgba(' + param.shadowColor + ',' + param.shadowColorT + ')';
        };
        // 模糊大小
        if (properties.shadowBlur) {
            ctx.shadowBlur = param.shadowBlur = properties.shadowBlur.value;
        };
        // 中心点x
        if (properties.cX) {
            param.x = properties.cX.value / 100;
        };
        // 中心点y
        if (properties.cY) {
            param.y = properties.cY.value / 100;
        };
        // 基础高
        if (properties.base) {
            param.base = properties.base.value;
        };
        // 线宽
        if (properties.lineWidth) {
            ctx.lineWidth = param.lineWidth = properties.lineWidth.value;
        };
        // 幅度
        if (properties.range) {
            param.range = properties.range.value;
        };
        // 间距
        if (properties.spacing) {
            param.spacing = properties.spacing.value;
        };
        // 圆角
        if (properties.round) {
            param.round = properties.round.value;
            if (properties.round.value) {
                ctx.lineCap = "round";
            } else {
                ctx.lineCap = "butt";
            }
        };
    }

}


window.wallpaperRegisterAudioListener && window.wallpaperRegisterAudioListener(wallpaperAudioListener);

function wallpaperAudioListener(audioArray) {
    refresh(audioArray)
}


setTimeout(function resize() {
    if (myStyle == 'line') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    } else if(myStyle == 'round'){
        canvas.width = 500;
        canvas.height = 500;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }else{
        alert(1);
    }

    ctx.shadowBlur = param.shadowBlur;
    ctx.shadowColor = param.shadowColor;
    ctx.strokeStyle = param.color;
    ctx.lineWidth = param.lineWidth;

    if (param.round) {
        ctx.lineCap = "round";
    } else {
        ctx.lineCap = "butt";
    }
},1000);



function style(audioArray) {
    var audioArray = audioArray || [];
    var centerX = canvas.width * param.x;
    var centerY = canvas.height * param.y;

    param.arr = [];

    /**
    *   备注
    *   画矩形 是从给出的坐标往右开始画
    *   画线条 是从给出的坐标往左右两边画
    *   所以在计算x坐标时 需要加上线宽的一半使其成为中心点
    */

    // 左
    for (var i = 0; i < audioArray.length; i++) {
        var height = audioArray[i] ? audioArray[i] : 0;
        height = height * param.range;
        if (param.base) height++;

        var x = (i + 1) * (param.lineWidth + param.spacing);

        param.arr.push({
            x: centerX - x + param.spacing / 2 + param.lineWidth / 2,
            y1: centerY - height / 2,
            y2: centerY + height / 2
        });
    }

    // 右
    for (var i = 0; i < audioArray.length; i++) {
        var height = audioArray[i] ? audioArray[i] : 0;
        height = height * param.range;
        if (param.base) height++;

        var x = (i + 1) * (param.lineWidth + param.spacing);

        param.arr.push({
            x: centerX + x - param.lineWidth - param.spacing / 2 + param.lineWidth / 2,
            y1: centerY - height / 2,
            y2: centerY + height / 2
        });
    }
}
function drawRound(audioArray) {
    //清空圆形区域
    ctx.clearRect(0, 0, 500,  500);
    /// alert('begin');


    // document.write(canvas.width);
    // document.write(canvas.height);

    // document.write('<span>');
    //将128个音频指令的数字塞入360的数组中
    var output = [];
    output.length = 360;
    var output_k = 0;
    for (output_index = 0; output_index < 360; output_index++) {
        output[output_index] = audioArray[(output_k++) % 128];
        // document.write(output[output_index].toFixed(4)
        //     + "; ");

    }
    //  alert('before draw');
    //画圆（迫真）
    for (var i = 0; i < 360; i++) {
        //Note1:加号右边：坐标与绘图的起始点坐标x y值一致
        //Note2:加号左边：左边为半径基础上的坐标偏移比例||乘号右边为半径；
        //Note3: value（半径增量）+ x(实际半径)
        //  var value = 5;
        var initValue = output[i].toFixed(4) * 1000; //根据频域长度确定半径增益 
        var value = parseInt(initValue);
        var tip = document.getElementById('tip');
        //tip.innerHTML = value;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(120, 115);
        ctx.lineTo(Math.cos((i * 1) / 180 * Math.PI) * (95 + value) + 120, (-Math.sin((i * 1) / 180 * Math.PI) * (95 + value) + 115));
        ctx.stroke();
        //绘制右边
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(120, 115);
        ctx.lineTo(Math.sin((i * 1) / 180 * Math.PI) * (95 + value) + 120, (-Math.cos((i * 1) / 180 * Math.PI) * (95 + value) + 115));
        ctx.stroke();
        //绘制上边
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(120, 115);
        ctx.lineTo(-Math.cos((i * 1) / 180 * Math.PI) * (95 + value) + 120, (Math.sin((i * 1) / 180 * Math.PI) * (95 + value) + 115));
        ctx.stroke();
        //绘制下边
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(120, 115);
        ctx.lineTo(-Math.sin((i * 1) / 180 * Math.PI) * (95 + value) + 120, (Math.cos((i * 1) / 180 * Math.PI) * (95 + value) + 115));
        ctx.stroke();

        //ctx.closePath(); //结束这次的绘制，等待下次执行
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 画线
    ctx.beginPath();
    for (var i = 0; i < param.arr.length; i++) {
        ctx.moveTo(param.arr[i].x, param.arr[i].y1);
        ctx.lineTo(param.arr[i].x, param.arr[i].y2);
    };
    ctx.stroke();
    ctx.closePath();
}

function refresh(audioArray) {
    if (myStyle == 'line') {
        style(audioArray);
        draw();
    } else {
        drawRound(audioArray);
    }

}
