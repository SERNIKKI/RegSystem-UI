'use strict'

const watermark = {}

const setWatermark = (str) => {
  const id = '7.432756475.689573874'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  const can = document.createElement('canvas')
  console.log()
  can.width = 290
  can.height = 240
  const cans = can.getContext('2d')
  cans.rotate(-15 * Math.PI / 180)
  cans.font = '16px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.40)'

  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  // cans.fillText(str, 1, can.height / 1.8)

  var chr = str.split("");
  var temp = "";
  var row = [];


  for (var a = 0; a < chr.length; a++) {
    if (cans.measureText(temp).width < 90 + 5 * a) {
      ;
    } else {
      row.push(temp);
      temp = "";
    }
    temp += chr[a];
  }

  row.push(temp);

  for (var b = 0; b < row.length; b++) {
    cans.fillText(row[b], 2, 200 + (b + 1) * 20);
  }

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth - 20 + 'px'
  div.style.height = document.documentElement.clientHeight - 20 + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

// 在watermark.js文件中
const outWatermark = (id) => {
  if (document.getElementById(id) !== null) {
    const div = document.getElementById(id)
    div.style.display = 'none'
  }
}

watermark.out = () => {
  const str = '7.432756475.689573874'
  outWatermark(str)
}

export default watermark
