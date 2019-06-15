function app(p) {
  const toRadian = (deg) => deg * (Math.PI / 180)
  const getX = (radius, degInRad) => radius * Math.cos(degInRad)
  const getY = (radius, degInRad) => radius * Math.sin(degInRad)
  let drawBrokenTexts, updatePeriodPosition;
  let state = {
    drop: false,
    frame: 0,
    periodPosition: {x: 12, y: 12},
  }

  let COLORS;

  p.setup = () => {
    const canvas = p.createCanvas(p.select('#p5').size().width, p.select('#p5').size().height);
    COLORS = [p.color(255, 140, 0),
                  p.color(231, 0, 0),
                  p.color(255, 239, 0),
                  p.color(0, 129, 31),
                  p.color(0, 68, 255),
                  p.color(118, 0, 137)]

    state.periodBottomPosition = canvas.size().height - 9
    drawBrokenTexts = [
      setupBrokenText(p.select('#myReligion'), canvas.position().y),
      setupBrokenText(p.select('#myCountry'), canvas.position().y),
      setupBrokenText(p.select('#myBlank'), canvas.position().y)
    ]

    updatePeriodPosition = setupPeriodPositionUpdate(state.periodBottomPosition)

  }

  p.draw = () => {
    p.background(255, 90);
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

  function setupPeriodPositionUpdate(bottomPosition) {
    const easeOut = (t) => bottomPosition * p.bezierPoint(0, 0, 2, 1, t) + 12
    let t = 0
    return function(updateY, y, drop) {
      if(drop && y < bottomPosition) {
        t = t + 0.002
        updateY(easeOut(t))
      }
    }
  }

  // function updatePeriodPosition(update, y, drop, bottomPosition) {
  //   if(drop && y < bottomPosition) {
  //     const t = t + 0.1
  //       console.log(bottomPosition * p.bezierPoint(0, 0, 0.58, 1, t))
  //       const next = bottomPosition * p.bezierPoint(0, 0, 0.58, 1, y/bottomPosition)
  //
  //         update(y+1)
  //   }
  // }

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
