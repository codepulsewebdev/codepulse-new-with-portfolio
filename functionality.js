document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // Set current year in footer
  // ------------------------------
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ------------------------------
  // Quote Form Submission
  // ------------------------------
  const quoteForm = document.getElementById('quoteForm');
  let formMessage;
  if (quoteForm) {
    // Create a reusable message element
    formMessage = document.createElement('p');
    formMessage.style.marginTop = '1rem';
    formMessage.setAttribute('role', 'alert');
    quoteForm.appendChild(formMessage);

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = quoteForm.querySelector('button[type="submit"]');
      const formData = new FormData(quoteForm);
      const payload = Object.fromEntries(formData.entries());

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      formMessage.textContent = '';

      try {
        const response = await fetch('/.netlify/functions/send-quote-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          formMessage.textContent = 'Thank you! Your request has been sent successfully.';
          formMessage.style.color = '#009970';
          quoteForm.reset();
        } else {
          formMessage.textContent = result.error || 'There was an issue sending your request.';
          formMessage.style.color = '#ff6b6b';
        }
      } catch (error) {
        formMessage.textContent = 'A critical error occurred. Please check your connection and try again.';
        formMessage.style.color = '#ff6b6b';
        console.error(error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Quote Request';
      }
    });
  }

  // ------------------------------
  // WhatsApp Quick Inquiry
  // ------------------------------
  const waBtn = document.getElementById('waSendBtn');
  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('waName').value.trim();
      let number = document.getElementById('waNumber').value.replace(/\s+/g, '').trim();
      const message = document.getElementById('waMessage').value.trim();

      if (!name || !number || !message) {
        alert("Please fill all fields!");
        return;
      }

      // Ensure number has country code
      if (!number.startsWith('+')) {
        alert("Please include country code (e.g., +27 for South Africa).");
        return;
      }

      const waUrl = `https://wa.me/${number}?text=${encodeURIComponent("Hi, my name is " + name + ". " + message)}`;
      window.open(waUrl, "_blank");
    });
  }

  // ------------------------------
  // Navbar shrink on scroll (throttled)
  // ------------------------------
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });

  // ------------------------------
  // Smooth scroll for internal links
  // ------------------------------
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, link.getAttribute('href'));
      }
    });
  });

  // ------------------------------
  // Lazy-load images
  // ------------------------------
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

});
