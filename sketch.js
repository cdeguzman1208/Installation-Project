// Define variables for heart rate, canvas dimensions, and circle properties
let heartRateSlider;
let canvasWidth = 800;
let canvasHeight = 600;
let circles = [];
let waveAmplitude = 100; // Amplitude of the sine wave
let waveFrequency = 0.02; // Frequency of the sine wave
let waveOffset = 0; // Initial offset for the sine wave
let sineWavePoints = []; // Array to store points of the sine wave
let dotX = 0; // X-coordinate of the riding circle
let dotY = 0; // Y-coordinate of the riding circle
let dotSize = 30; // Size of the riding circle

function setup() {
  // Create canvas
  createCanvas(canvasWidth, canvasHeight);

  // Create heart rate slider
  heartRateSlider = createSlider(60, 180, 120, 1); // Min: 60 BPM, Max: 180 BPM, Initial: 120 BPM
  heartRateSlider.position(20, 20);
  heartRateSlider.style('width', '200px');

  // Create initial set of circles
  for (let i = 0; i < 20; i++) {
    let posX = random(width);
    let posY = random(height);
    let size = random(20, 100);
    let speed = random(0.5, 2); // Randomize movement speed
    let color = randomColor(); // Generate a random color

    circles.push({
      x: posX,
      y: posY,
      size: size,
      color: color
    });
  }
  
  // Initialize sine wave points along the middle of the canvas
  for (let x = 0; x < canvasWidth; x += 10) {
    let y = canvasHeight / 2 + waveAmplitude * sin(waveFrequency * x);
    sineWavePoints.push({ x: x, y: y });
  }
  
  // Set initial position of the riding circle
  dotX = sineWavePoints[1].x;
  dotY = sineWavePoints[1].y;
}

function randomColor() {
  // Generate a random color (RGB values)
  let r = random(100, 255);
  let g = random(100, 255);
  let b = random(100, 255);
  return color(r, g, b); // Create a p5 color object
}

function updateHeartRate() {
  // Clear background
  background(0);

  // Get current heart rate from the slider value
  let heartRate = heartRateSlider.value();

  // Adjust saturation (brightness) of circle colors based on heart rate
  let saturation = map(heartRate, 60, 180, 50, 100); // Map heart rate to saturation range (dull to bright)
  
  let strokeWeightValue = map(heartRate, 60, 180, 1, 100); // Map heart rate to stroke weight

  // Update and draw circles with animation
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    
    // Set fill color with adjusted saturation
    fill(color(circle.color.levels[0], circle.color.levels[1], circle.color.levels[2], saturation));
    stroke(color(circle.color.levels[0], circle.color.levels[1], circle.color.levels[2], saturation));
    
    // Update circle position (simulate movement)
    circle.x += heartRate / 20;
    
    if (circle.x > width + circle.size / 2) {
      circle.x = -circle.size / 2; // Reset circle position when it moves off-screen
    }

    // Set fill and stroke based on heart rate
    fill(hue, saturation, brightness);
    stroke(hue, saturation, brightness);
    strokeWeight(strokeWeightValue);
    
    // Update position of the riding circle along the sine wave
  let circleIndex = int(map(dotX, 0, canvasWidth, 2.5, sineWavePoints.length - 1));
  dotX = sineWavePoints[circleIndex].x;
  dotY = sineWavePoints[circleIndex].y;

    // Draw animated ellipse (circle)
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }
  
  // Adjust wave frequency based on heart rate
  waveFrequency = map(heartRate, 60, 180, 0.01, 0.05); // Map heart rate to wave frequency range
  
  // Update wave offset to animate the sine wave
  waveOffset += 0.1;

  // Update sine wave points based on new wave parameters
  for (let i = 0; i < sineWavePoints.length; i++) {
    let point = sineWavePoints[i];
    point.y = canvasHeight / 2 + waveAmplitude * sin(waveFrequency * point.x + waveOffset);
  }
  
  // Draw animated sine wave
  noFill();
  stroke(255);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < sineWavePoints.length; i++) {
    vertex(sineWavePoints[i].x, sineWavePoints[i].y);
  }
  endShape();
  
  // Draw riding circle
  fill(255, 255, 255); // Red color for the riding circle
  ellipse(dotX, dotY, dotSize, dotSize);
}

function draw() {
  // Trigger updateHeartRate function on frame update (animation loop)
  updateHeartRate();
}
