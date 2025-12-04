
//NavBar Active Link
const navLinks = document.querySelectorAll('.nav-link');
const currentLocation = window.location.pathname;

navLinks.forEach(link => {
    if (link.href.includes(currentLocation)) {
        link.classList.add('active');
    }
});

//Search 
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchBtn');

function eliminaDiacritice(text) {
    return text
        .toLowerCase()
        .normalize("NFD")         
        .replace(/[\u0300-\u036f]/g, ""); 
}

let highlightedSpans = []; 

function clearHighlights() {
    highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize(); 
    });
    highlightedSpans = [];
}

searchButton.addEventListener('click', () => {
    const query = eliminaDiacritice(searchInput.value.trim());
    if (!query) return;

    clearHighlights();

   const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
   const nodesToHighlight = []; 

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (eliminaDiacritice(node.textContent).includes(query)) {
            nodesToHighlight.push(node);
        }
    }

    nodesToHighlight.forEach(node => {
        let currentNode = node;
        let normalizedText = eliminaDiacritice(currentNode.textContent);
        let matchIndex = normalizedText.indexOf(query);

        while (matchIndex !== -1) {
            const span = document.createElement('span');
            span.style.backgroundColor = "green";

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

//Contact
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // Field validation
        if (!name || !email || !phone || !message) {
            formFeedback.textContent = "Please fill in all required fields.";
            formFeedback.style.color = "red";
            return;
        }

        //Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            formFeedback.textContent = "Please enter a valid email address.";
            formFeedback.style.color = "red";
            return;
        }

        //Phone validation
        const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
        if (!phonePattern.test(phone)) {
            formFeedback.textContent = "Please enter a valid phone number.";
            formFeedback.style.color = "red";
            return;
        }

        //All valid
        formFeedback.textContent = "Thank you! Your message has been sent.";
        formFeedback.style.color = "green";
        contactForm.reset();
    });
}

//Help widget
const helpButton = document.getElementById('help-button');
const helpWidget = document.getElementById('help-widget');

helpButton.addEventListener('click', () => {
    helpWidget.classList.toggle('visible');
});



//Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
const themeIcon = darkModeToggle ? darkModeToggle.querySelector('.fas') : null; 

function applyTheme(theme) {
     if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");

    }
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
     applyTheme(savedTheme);
} else {
     applyTheme("light"); 
}

darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
});

// Scroll to Top and Bottom Buttons
const scrollToTopButton = document.getElementById('scroll-to-top');
const scrollToBottomButton = document.getElementById('scroll-to-bottom');
if (scrollToTopButton && scrollToBottomButton) {

    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  
    scrollToBottomButton.addEventListener('click', () => {
        const totalHeight = document.body.scrollHeight;
        window.scrollTo({ top: totalHeight, behavior: 'smooth' });
    });

   l
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {  
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50);
        if (isAtBottom) {
            scrollToBottomButton.classList.remove('visible'); 
        } else {
            scrollToBottomButton.classList.add('visible'); 
        }
    });

}

//Modal Zoom Gallery
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
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close");
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
