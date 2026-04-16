(function() {
  'use strict';

  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null };
  var animationId;

  var config = {
    particleCount: window.innerWidth < 768 ? 30 : 60,
    connectionDistance: 150,
    particleSize: 1.5,
    speed: 0.3,
    mouseRadius: 200,
    color: { r: 100, g: 255, b: 218 },
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      size: Math.random() * config.particleSize + 0.5,
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < config.particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + config.color.r + ',' + config.color.g + ',' + config.color.b + ', 0.3)';
    ctx.fill();
  }

  function drawLine(p1, p2, distance) {
    var opacity = 1 - (distance / config.connectionDistance);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'rgba(' + config.color.r + ',' + config.color.g + ',' + config.color.b + ',' + (opacity * 0.15) + ')';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse attraction
      if (mouse.x !== null) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRadius) {
          p.vx += dx * 0.00005;
          p.vy += dy * 0.00005;
        }
      }

      // Cap velocity
      var maxSpeed = config.speed * 2;
      if (Math.abs(p.vx) > maxSpeed) p.vx = maxSpeed * Math.sign(p.vx);
      if (Math.abs(p.vy) > maxSpeed) p.vy = maxSpeed * Math.sign(p.vy);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < config.connectionDistance) {
          drawLine(particles[i], particles[j], distance);
        }
      }
    }

    // Draw mouse connections
    if (mouse.x !== null) {
      for (var k = 0; k < particles.length; k++) {
        var mdx = mouse.x - particles[k].x;
        var mdy = mouse.y - particles[k].y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < config.mouseRadius) {
          var mOpacity = 1 - (mDist / config.mouseRadius);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[k].x, particles[k].y);
          ctx.strokeStyle = 'rgba(' + config.color.r + ',' + config.color.g + ',' + config.color.b + ',' + (mOpacity * 0.2) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (var l = 0; l < particles.length; l++) {
      drawParticle(particles[l]);
    }
  }

  function animate() {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', function() {
    resize();
    // Adjust particle count on resize
    var newCount = window.innerWidth < 768 ? 30 : 60;
    while (particles.length > newCount) particles.pop();
    while (particles.length < newCount) particles.push(createParticle());
  });

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
  });

  // Pause on tab hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  init();
  animate();
})();
