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

  // Fetch LeetCode Stats
  const fetchLeetCodeStats = async () => {
    try {
      const username = 'tanayprabhakar';
      let solvedTotal = 0, easy = 0, medium = 0, hard = 0, rank = 0;
      let topTopics = '';

      try {
        const [profileRes, solvedRes, skillsRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}`),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
          fetch(`https://alfa-leetcode-api.onrender.com/skillStats/${username}`)
        ]);
        
        if (!profileRes.ok || !solvedRes.ok || !skillsRes.ok) throw new Error("Alfa API Rate Limited");
        
        const profileData = await profileRes.json();
        const solvedData = await solvedRes.json();
        const skillsData = await skillsRes.json();

        solvedTotal = solvedData.solvedProblem;
        easy = solvedData.easySolved;
        medium = solvedData.mediumSolved;
        hard = solvedData.hardSolved;
        rank = profileData.ranking;

        let allTopics = [];
        if (skillsData.matchedUser && skillsData.matchedUser.tagProblemCounts) {
          const tags = skillsData.matchedUser.tagProblemCounts;
          allTopics = [...(tags.advanced || []), ...(tags.intermediate || []), ...(tags.fundamental || [])];
        }
        allTopics.sort((a, b) => b.problemsSolved - a.problemsSolved);
        topTopics = allTopics.slice(0, 8).map(t => t.tagName).join(', ');

      } catch (err) {
        console.warn('Primary LeetCode API failed, trying fallback...', err);
        // Fallback API
        const fallbackRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        if (!fallbackRes.ok) throw new Error("Fallback API also failed");
        
        const fallbackData = await fallbackRes.json();
        solvedTotal = fallbackData.totalSolved;
        easy = fallbackData.easySolved;
        medium = fallbackData.mediumSolved;
        hard = fallbackData.hardSolved;
        rank = fallbackData.ranking;
        topTopics = 'Data unavailable at the moment.';
      }
      
      const loadingEl = document.getElementById('leetcode-loading');
      const statsListEl = document.getElementById('leetcode-stats-list');
      
      if (loadingEl && statsListEl) {
        loadingEl.style.display = 'none';
        statsListEl.style.display = 'block';
        
        const totalEl = document.getElementById('lc-solved-total');
        if (totalEl) totalEl.innerHTML = `<b>${solvedTotal}</b> total solved`;
        
        const easyEl = document.getElementById('lc-easy');
        if (easyEl) easyEl.innerText = `Easy: ${easy}`;
        
        const mediumEl = document.getElementById('lc-medium');
        if (mediumEl) mediumEl.innerText = `Med: ${medium}`;
        
        const hardEl = document.getElementById('lc-hard');
        if (hardEl) hardEl.innerText = `Hard: ${hard}`;
        
        const rankEl = document.getElementById('lc-rank');
        if (rankEl && rank) {
           rankEl.innerText = `${rank.toLocaleString()}`;
        }
        
        const topicsEl = document.getElementById('lc-topics');
        if (topicsEl) topicsEl.innerText = topTopics;
      }
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      const loadingEl = document.getElementById('leetcode-loading');
      if (loadingEl) loadingEl.innerText = 'Unable to load stats.';
    }
  };

  fetchLeetCodeStats();
});
