/**
 * Safa Sayed - E-Portfolio Interactive Enhancements
 * Modular, vanilla JavaScript with zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initScrollSpy();
  initProjectTabs();
  initEmailCopy();
  initContactForm();
  initBackToTop();
  initScrollReveal();
});

/**
 * 1. Navbar elevation on scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-wrapper');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile navigation drawer toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleDrawer = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // Close when clicking a drawer link
  drawer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleDrawer(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleDrawer(false);
    }
  });
}

/**
 * 3. Scroll spy to highlight active section in navbar
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-drawer .nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 4. Interactive Project Tabs for 2D Graphics Editor
 */
function initProjectTabs() {
  const tabButtons = document.querySelectorAll('.terminal-tab-btn');
  const tabContents = {
    'terminal': `<span class="syntax-prompt">$</span> ./graphics_editor
<span class="syntax-output">==========================================</span>
<span class="syntax-output">   2D GRAPHICS EDITOR (C PROGRAMMING)     </span>
<span class="syntax-output">==========================================</span>
<span class="syntax-output">[1] Create New Shape (Circle / Rect / Line)</span>
<span class="syntax-output">[2] List All Active Graphical Objects</span>
<span class="syntax-output">[3] Modify Coordinates & Dimensions</span>
<span class="syntax-output">[4] Delete Shape from Canvas</span>
<span class="syntax-output">[5] Render Canvas Summary</span>
<span class="syntax-output">[6] Save & Exit</span>
<span class="syntax-prompt">> Select an option [1-6]:</span> 1
<span class="syntax-prompt">> Enter Shape Type (1: Circle, 2: Rect):</span> 2
<span class="syntax-prompt">> Coordinates (x, y, width, height):</span> 10 20 80 40
<span class="syntax-success">[SUCCESS] Rectangle #1 created at (10, 20) with size 80x40.</span>
<span class="syntax-prompt">> Select an option [1-6]:</span> 2
<span class="syntax-output">--- Canvas Object Store ---</span>
<span class="syntax-output">ID: 01 | Type: RECTANGLE | Origin: (10, 20) | Dim: 80x40 | Status: ACTIVE</span>
<span class="syntax-success">[STATUS] Memory allocated: 1 Object(s) managed safely.</span>`,

    'structs': `<span class="syntax-comment">/* 2d_graphics_editor.h - Core Data Structures */</span>
<span class="syntax-keyword">typedef enum</span> {
    SHAPE_POINT,
    SHAPE_LINE,
    SHAPE_RECTANGLE,
    SHAPE_CIRCLE
} <span class="syntax-type">ShapeType</span>;

<span class="syntax-keyword">typedef struct</span> {
    <span class="syntax-type">int</span> id;
    <span class="syntax-type">ShapeType</span> type;
    <span class="syntax-type">float</span> x, y;
    <span class="syntax-type">float</span> width, height;  <span class="syntax-comment">/* or radius for circle */</span>
    <span class="syntax-type">int</span> is_visible;
} <span class="syntax-type">GraphicObject</span>;

<span class="syntax-comment">/* Canvas Store Management */</span>
<span class="syntax-keyword">typedef struct</span> {
    <span class="syntax-type">GraphicObject</span> objects[MAX_OBJECTS];
    <span class="syntax-type">int</span> total_count;
} <span class="syntax-type">CanvasState</span>;

<span class="syntax-type">void</span> <span class="syntax-keyword">init_canvas</span>(<span class="syntax-type">CanvasState</span> *canvas);
<span class="syntax-type">int</span>  <span class="syntax-keyword">add_shape</span>(<span class="syntax-type">CanvasState</span> *canvas, <span class="syntax-type">GraphicObject</span> obj);
<span class="syntax-type">void</span> <span class="syntax-keyword">render_summary</span>(<span class="syntax-keyword">const</span> <span class="syntax-type">CanvasState</span> *canvas);`,

    'workflow': `<span class="syntax-comment">/* Modular Execution Pipeline */</span>
<span class="syntax-prompt">1. Initialization:</span>
   • Prepares CanvasState array in memory.
   • Clears buffers and sets standard terminal ANSI formatting.

<span class="syntax-prompt">2. Interactive Event Loop:</span>
   • Continuous while-loop evaluating user selection.
   • Robust input sanitization preventing buffer overflows.

<span class="syntax-prompt">3. Object Lifecycle:</span>
   • <span class="syntax-keyword">CREATE</span>: Validates bounds & assigns unique incremental ID.
   • <span class="syntax-keyword">READ</span>: Formatted tabular display of all active entities.
   • <span class="syntax-keyword">UPDATE</span>: In-place modification of coordinate attributes.
   • <span class="syntax-keyword">DELETE</span>: Shift-based array cleanup or soft-deletion flag.`
  };

  const codeContainer = document.getElementById('terminal-code-display');
  if (!codeContainer) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (!tabContents[target]) return;

      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      codeContainer.style.opacity = '0';
      setTimeout(() => {
        codeContainer.innerHTML = tabContents[target];
        codeContainer.style.opacity = '1';
      }, 120);
    });
  });
}

/**
 * 5. One-click copy email button with feedback tooltip / toast
 */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('.btn-copy-email');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'safasayed350@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        showToast('Email address copied to clipboard: ' + email);

        // Visual feedback on the button
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        btn.classList.add('btn-copied');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-copied');
        }, 2200);
      } catch (err) {
        showToast('Could not copy automatically. Email: ' + email);
      }
    });
  });
}

/**
 * 6. Contact Form validation and mailto simulation
 */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim() || 'Portfolio Inquiry';
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', false);
      return;
    }

    // Compose mailto URI
    const mailtoUri = `mailto:safasayed350@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${subject} - from ${name}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    showToast('Opening your email client to send your message...', true);

    // Give toast moment to show then open email client
    setTimeout(() => {
      window.location.href = mailtoUri;
      form.reset();
    }, 800);
  });
}

/**
 * 7. Back-to-Top Button
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 8. Scroll Reveal Animations with IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: reveal immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
}

/**
 * Utility: Toast notification helper
 */
function showToast(message, isSuccess = true) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${isSuccess ? 'toast-success' : ''}`;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0;color:${isSuccess ? '#10B981' : '#F59E0B'}">
      ${isSuccess 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}
