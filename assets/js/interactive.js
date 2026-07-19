document.addEventListener("DOMContentLoaded", () => {
  // Custom Cursor Logic
  const cursor = document.getElementById("custom-cursor");
  const cursorTrail = document.getElementById("custom-cursor-trail");
  
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    if (cursor) {
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    
    // 3D Tilt Logic for Cards
    const cards = document.querySelectorAll(".page_content");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate rotation based on mouse position relative to center of screen
    const rotateY = ((mouseX / windowWidth) - 0.5) * 15; // max 7.5deg
    const rotateX = ((mouseY / windowHeight) - 0.5) * -15;
    
    cards.forEach(card => {
      // Only apply if it's visible or you just want to apply globally
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
  
  // Smooth trail animation
  const animateTrail = () => {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    
    if (cursorTrail) {
      cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
    }
    
    requestAnimationFrame(animateTrail);
  };
  animateTrail();
  
  // Hover effect for links
  const links = document.querySelectorAll("a, .theme_btn, .theme_colors");
  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      if (cursor) cursor.classList.add("hover");
      if (cursorTrail) cursorTrail.classList.add("hover");
    });
    link.addEventListener("mouseleave", () => {
      if (cursor) cursor.classList.remove("hover");
      if (cursorTrail) cursorTrail.classList.remove("hover");
    });
  });
});
