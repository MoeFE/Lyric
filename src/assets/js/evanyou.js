;
!(function () {
  const style = `
  .evanyou {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: -1;
  }
  @media (max-width: 768px) {
    .evanyou { display: none; }
  }
  `

  const s = document.createElement('style')
  s.innerHTML = style
  document.head.appendChild(s)

  let c = document.createElement('canvas')
  c.className = 'evanyou'
  document.body.appendChild(c)

  var x = c.getContext('2d'),
    pr = window.devicePixelRatio,
    w = window.innerWidth,
    h = window.innerHeight,
    f = 90,
    q,
    m = Math,
    r = 0,
    u = m.PI * 2,
    v = m.cos,
    z = m.random

  c.width = w * pr
  c.height = h * pr
  x.scale(pr, pr)
  x.globalAlpha = 0.6

  function i () {
    x.clearRect(0, 0, w, h)
    q = [{
      x: 0,
      y: h * 0.7 + f
    }, {
      x: 0,
      y: h * 0.7 - f
    }]
    while (q[1].x < w + f) d(q[0], q[1])
  }

  function d (i, j) {
    x.beginPath()
    x.moveTo(i.x, i.y)
    x.lineTo(j.x, j.y)
    var k = j.x + (z() * 2 - 0.25) * f,
      n = y(j.y)
    x.lineTo(k, n)
    x.closePath()
    r -= u / -50
    x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
    x.fill()
    q[0] = q[1]
    q[1] = {
      x: k,
      y: n
    }
  }

  function y (p) {
    var t = p + (z() * 2 - 1.1) * f
    return (t > h || t < 0) ? y(p) : t
  }
  document.onclick = i
  document.ontouchstart = i
  window.onresize = e => {
    c.width = window.innerWidth
    c.height = window.innerHeight
    i()
  }
  i()
})()
