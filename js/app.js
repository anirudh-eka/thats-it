function app(p) {
  const toRadian = (deg) => deg * (Math.PI / 180)
  const getX = (radius, degInRad) => radius * Math.cos(degInRad)
  const getY = (radius, degInRad) => radius * Math.sin(degInRad)
  let drawBrokenTexts, updatePeriodPosition, drawQuestionMark;
  let state = {
    drop: false,
    frame: 0,
    periodPosition: {x: 12, y: 65 },
  }

  let COLORS;

  p.setup = () => {
    const canvasBottom = (p.select('#thatsIt').position().y + p.select('#thatsIt').size().height) - p.select('#p5').position().y
    const canvas = p.createCanvas(p.select('#p5').size().width, canvasBottom);
    COLORS = [p.color(255, 140, 0),
                  p.color(231, 0, 0),
                  p.color(255, 239, 0),
                  p.color(0, 129, 31),
                  p.color(0, 68, 255),
                  p.color(118, 0, 137)]

    const periodBottomPosition =  canvasBottom - 13;
    drawBrokenTexts = [
      setupBrokenText(p.select('#myReligion'), canvas.position().y),
      setupBrokenText(p.select('#myCountry'), canvas.position().y),
      setupBrokenText(p.select('#myBlank'), canvas.position().y)
    ]

    updatePeriodPosition = setupPeriodPositionUpdate(state.periodPosition.y, periodBottomPosition)
    drawQuestionMark = setupQuestionMark(state.periodPosition.x)
  }

  p.draw = () => {
    p.background(255, 90);
    drawQuestionMark()
    p.noStroke()

    // setters
    updatePeriodPosition((newY) => {state.periodPosition.y = newY}, state.periodPosition.y, state.drop)

    // listeners
    drawPeriod(state.periodPosition, state.frame)
    drawBrokenTexts.map(f => f(state.periodPosition.y, state.frame))


    state.frame++
  }

  p.mouseWheel = () => state.drop = true
  p.touchEnded = () => state.drop = true

  function setupPeriodPositionUpdate(initialPosition, bottomPosition) {
    const easeOut = (t) => bottomPosition * p.bezierPoint(0, 1, 1, 1, t) + initialPosition
    let t = 0
    return function(updateY, y, drop) {
      if(drop && y < bottomPosition) {
        t = t + 0.002
        updateY(easeOut(t))
      }
    }
  }

  function setupQuestionMark(x) {
    const y = 45
    return function() {
      // p.textSize(55);
      // p.fill('green')
      // p.textAlign(p.CENTER, p.CENTER);
      // p.text("?", x, y)


      p.beginShape();
      p.noFill();
      p.stroke('black')
      p.strokeWeight(4)
      p.vertex(x - 8.5, y - 11)
      p.bezierVertex(x - 9.5, y - 11,
                    x - 10.5, y - 22,
                    x, y - 23.5);

      p.bezierVertex(x + 12, y - 23.5,
                    x + 10, y - 12,
                    x + 10, y - 11);

      p.bezierVertex(x+ 10, y - 8,
                    x + 6, y - 5,
                    x + 1, y - 1);

      p.bezierVertex(x + 0, y,
                     x + 0, y+2,
                     x + 0, y+7);
      p.endShape();

    }
  }

  function setupBrokenText(text, canvasTop) {
    return function(y, frame) {
      if(y >= text.position().y - canvasTop && !text.class().includes('break')) {
        text.class(text.class()+' break')
      }
    }
  }

  function drawPeriod(position, frame) {
    for (i = 0; i < 360; i = i+30) {
      const colorIndex = Math.floor(p.map(i, 0, 360, 0, 6))
      p.fill(COLORS[colorIndex])
      drawCurve(position, i+frame, 7)
    }
  }

  function drawCurve(position, startDegree, radius) {
    const centerX = position.x
    const centerY = position.y

    const x = getX(radius, toRadian(135))
    const y = getY(radius, toRadian(135))
    const getXForInnerCircle = (degree) => centerX + getX(radius, toRadian(degree))
    const getYForInnerCircle = (degree) => centerY + getY(radius*3, toRadian(degree))
    const getXForCircle = (degree) => centerX + getX(radius, toRadian(degree))
    const getYForCircle = (degree) => centerY + getY(radius, toRadian(degree))
    // console.log(PI)
    // const x = getX(radius, toRadian(50))
    // const y = getY(radius, toRadian(50))

    p.beginShape();

    p.vertex(getXForCircle(startDegree),
           getYForCircle(startDegree));
    p.bezierVertex(getXForCircle(startDegree + 15), getYForCircle(startDegree + 15),
                 getXForCircle(startDegree + 30), getYForCircle(startDegree + 30),
                 getXForCircle(startDegree + 45), getYForCircle(startDegree + 45));



    p.bezierVertex(getXForCircle(startDegree + 10), getYForCircle(startDegree + 20),
                 getXForInnerCircle(startDegree + 22.5 - 180), getYForInnerCircle(startDegree + 22.5 - 180),
                 getXForCircle(startDegree), getYForCircle(startDegree));

    p.endShape();
    // circle(getXForInnerCircle(startDegree + 22.5 - 180), getYForInnerCircle(startDegree + 22.5), 10, 10)

    // circle(centerX, centerY, 10, 10)
  }
}

new p5(app,  document.getElementById('p5'));
