(() => {
  'use strict';
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      for (const link of links) {
        if (link.hash === '#' + visible[0].target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }, { rootMargin: '-5% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
  const config = window.PERSONAL_SITE_CONFIG?.analytics;
  const { protocol, hostname, pathname } = window.location;
  if (!config?.enabled || !config.token || protocol !== 'https:' || hostname !== config.hostname) return;
  const allowed = config.paths?.some(path => pathname === path ||
    (path !== '/' && path.endsWith('/') && pathname.startsWith(path)));
  if (!allowed) return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token: config.token }));
  document.body.appendChild(beacon);
})();
