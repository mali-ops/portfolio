// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// "Contact" nav/hero links open the AI assistant chat panel instead of scrolling
document.querySelectorAll('[data-open-chat]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof window.openChatWidget === 'function') window.openChatWidget();
    const navLinksEl = document.querySelector('.nav-links');
    if (navLinksEl) navLinksEl.classList.remove('open');
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Smooth scroll for all in-page nav links (also closes mobile menu)
navLinks.querySelectorAll('a[href^="#"]:not([data-open-chat])').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navLinks.classList.remove('open');
  });
});

// Typing effect in hero terminal
const typedEl = document.getElementById('typedLine');
const lines = [
  'building RAG pipelines...',
  'fine-tuning Llama-3-8B...',
  'automating workflows in n8n...',
  'shipping to production...'
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  typedEl.textContent = lines[0];
} else {
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }

    setTimeout(tick, deleting ? 30 : 55);
  }

  tick();
}

// AI Assistant chat widget
(function () {
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messagesEl = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  if (!toggle || !panel || !form) return;

  let history = [];
  let isSending = false;

  function isPanelOpen() {
    return panel.hasAttribute('hidden') === false;
  }

  function openPanel() {
    panel.removeAttribute('hidden');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePanel() {
    panel.setAttribute('hidden', '');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    isPanelOpen() ? closePanel() : openPanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPanelOpen()) closePanel();
  });

  // Let the "contact" nav/hero buttons open this same panel
  window.openChatWidget = openPanel;

  function addMessage(text, role) {
    const el = document.createElement('div');
    el.className = `chat-msg chat-msg-${role}`;
    const p = document.createElement('p');
    p.textContent = text;
    el.appendChild(p);
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function addTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'chat-msg chat-msg-bot';
    el.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isSending) return;

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    isSending = true;

    const typingEl = addTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();

      typingEl.remove();

      if (!res.ok || !data.reply) {
        addMessage(data.error || 'Something went wrong. Please try again.', 'error');
      } else {
        addMessage(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
      }
    } catch (err) {
      typingEl.remove();
      addMessage('Network error — please try again.', 'error');
    } finally {
      isSending = false;
    }
  });
})();

// Active nav link highlight on scroll
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text-primary)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));
