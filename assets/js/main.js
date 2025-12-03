// main.js

// Functionality for the navigation bar highlighting the active page
const navLinks = document.querySelectorAll('.nav-link');
const currentLocation = window.location.pathname;

navLinks.forEach(link => {
    if (link.href.includes(currentLocation)) {
        link.classList.add('active');
    }
});

// Functionality for the search feature
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchBtn');

function eliminaDiacritice(text) {
    return text
        .toLowerCase()
        .normalize("NFD")           // separă diacriticele
        .replace(/[\u0300-\u036f]/g, ""); // elimină diacriticele
}

let highlightedSpans = []; // reținem toate span-urile evidențiate

function clearHighlights() {
    highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize(); // combină nodurile text adiacente
    });
    highlightedSpans = [];
}

searchButton.addEventListener('click', () => {
    const query = eliminaDiacritice(searchInput.value.trim());
    if (!query) return;

    // Curățăm highlight-urile anterioare
    clearHighlights();

   const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
   const nodesToHighlight = []; 

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (eliminaDiacritice(node.textContent).includes(query)) {
            nodesToHighlight.push(node);
        }
    }

    // Evidențiem fiecare apariție din fiecare nod
    nodesToHighlight.forEach(node => {
        let currentNode = node;
        let normalizedText = eliminaDiacritice(currentNode.textContent);
        let matchIndex = normalizedText.indexOf(query);

        while (matchIndex !== -1) {
            const span = document.createElement('span');
            span.style.backgroundColor = "yellow";

            const originalText = currentNode.textContent;
            const before = originalText.slice(0, matchIndex);
            const match = originalText.slice(matchIndex, matchIndex + query.length);
            const after = originalText.slice(matchIndex + query.length);

            const parent = currentNode.parentNode;

            if (before) parent.insertBefore(document.createTextNode(before), currentNode);
            span.textContent = match;
            parent.insertBefore(span, currentNode);
            currentNode.textContent = after;

            highlightedSpans.push(span);

            currentNode = span.nextSibling;
            normalizedText = eliminaDiacritice(currentNode.textContent);
            matchIndex = normalizedText.indexOf(query);
        }
    });

    if (highlightedSpans.length > 0) {
        const rect = highlightedSpans[0].getBoundingClientRect();
        window.scrollTo({
            top: rect.top + window.scrollY - 150,
            behavior: "smooth"
        });
    } else {
        alert("No results found.");
    } 
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchBtn') && !e.target.closest('#searchInput')) {
        clearHighlights();
    }
  });    

// Formular contact
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevenim trimiterea tradițională

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validare simplă
        if (!name || !email || !phone || !message) {
            formFeedback.textContent = "Please fill in all required fields.";
            formFeedback.style.color = "red";
            return;
        }

        // Validare email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            formFeedback.textContent = "Please enter a valid email address.";
            formFeedback.style.color = "red";
            return;
        }

        // Validare telefon
        const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
        if (!phonePattern.test(phone)) {
            formFeedback.textContent = "Please enter a valid phone number.";
            formFeedback.style.color = "red";
            return;
        }

        // Dacă totul e valid
        formFeedback.textContent = "Thank you! Your message has been sent.";
        formFeedback.style.color = "green";

        // Aici poți adăuga trimiterea reală prin fetch / AJAX
        contactForm.reset();
    });
}

// Functionality for the help widget
const helpButton = document.getElementById('help-button');
const helpWidget = document.getElementById('help-widget');

helpButton.addEventListener('click', () => {
    helpWidget.classList.toggle('visible');
});



/// DARK MODE
const darkModeToggle = document.getElementById("darkModeToggle");
// Selectează elementul <i> care conține pictograma (Lună/Soare)
const themeIcon = darkModeToggle ? darkModeToggle.querySelector('.fas') : null; 

function applyTheme(theme) {
     if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");

    }
    localStorage.setItem("theme", theme);
}

// 1. Load saved theme and initialize icon on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
     applyTheme(savedTheme);
} else {
     applyTheme("light"); 
}

// 2. Toggle on click
darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
});
// ... restul codului main.js

// Scroll to top/bottom functionality

const scrollToTopButton = document.getElementById('scroll-to-top');
const scrollToBottomButton = document.getElementById('scroll-to-bottom');
if (scrollToTopButton && scrollToBottomButton) {

    // 1. Logica de click (Scroll la Top)
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 2. Logica de click (Scroll la Bottom)
    scrollToBottomButton.addEventListener('click', () => {
        const totalHeight = document.body.scrollHeight;
        window.scrollTo({ top: totalHeight, behavior: 'smooth' });
    });

    // 3. Logica de afișare/ascundere la scroll
    window.addEventListener('scroll', () => {
        
        // --- Butonul UP (Scroll to Top) ---
        if (window.scrollY > 300) { 
            // Apare când derulezi în jos
            scrollToTopButton.classList.add('visible');
        } else {
            // Dispare când ești sus
            scrollToTopButton.classList.remove('visible');
        }

        // --- Butonul DOWN (Scroll to Bottom) ---
        // Verifică dacă utilizatorul este aproape de baza paginii
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50);

        if (isAtBottom) {
            // Ascunde butonul de Down când ești jos
            scrollToBottomButton.classList.remove('visible'); 
        } else {
            // Afișează butonul de Down
            scrollToBottomButton.classList.add('visible'); 
        }
    });

}

// Initialize Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'YOUR_TRACKING_ID', 'auto');
ga('send', 'pageview');
// === Modal Zoom Gallery ===
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close");
  const images = document.querySelectorAll(".image-grid img");

  images.forEach(img => {
    img.addEventListener("click", function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    });
  });

  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
  // === Modal Zoom pentru Kitchen Tiles ===
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close");

  // Selectează TOATE imaginile din .tile-grid (secțiunea de kitchen)
  const tileImages = document.querySelectorAll(".tile-grid img");

  tileImages.forEach(img => {
    img.addEventListener("click", function() {
      modal.style.display = "flex";
      modalImg.src = this.src;
    });
  });

  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
});
});
