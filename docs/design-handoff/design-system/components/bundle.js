/* @ds-bundle: {"format":4,"namespace":"Amar","components":[{"name":"Navbar"},{"name":"Button"},{"name":"Tag"},{"name":"StatusBadge"},{"name":"SectionHeading"},{"name":"BentoTile"},{"name":"BrowserFrame"},{"name":"ProjectRow"},{"name":"TimelineItem"},{"name":"CertItem"},{"name":"ContactForm"},{"name":"Reveal"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  /* ---- tiny inline icons (stroke = currentColor) ---- */
  function Icon(props) {
    var p = { download: 'M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14', arrow: 'M5 12h14m-5-5l5 5-5 5', ext: 'M14 5h5v5m0-5L10 14M19 14v5H5V5h5',
      menu: 'M4 7h16M4 12h16M4 17h16', close: 'M6 6l12 12M18 6L6 18', lock: 'M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z',
      alert: 'M12 8v5m0 3.5v.01M12 3l9.5 17h-19z', check: 'M5 12.5l4.5 4.5L19 7.5', mail: 'M4 6h16v12H4zM4 7l8 6 8-6' }[props.name];
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: p }));
  }
  function GitHubIcon() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, h('path', { d: 'M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0012 2z' }));
  }

  /* ---- Tag ---- */
  function Tag(props) { return h('span', { className: cx('am-tag', props.className) }, props.children); }
  function TagList(props) {
    return h('ul', { className: 'am-tags', 'aria-label': props.label || 'Tech stack' },
      (props.tags || []).map(function (t) { return h('li', { key: t }, h(Tag, null, t)); }));
  }

  /* ---- StatusBadge ---- */
  function StatusBadge(props) {
    var s = props.status || 'live';
    var text = props.children || (s === 'live' ? 'Live' : s === 'open' ? 'Open to work' : 'Demo');
    return h('span', { className: cx('am-badge', 'am-badge-' + s, props.className) },
      h('span', { className: 'am-badge-dot', 'aria-hidden': 'true' }), text);
  }

  /* ---- Button ---- */
  function Button(props) {
    var variant = props.variant || 'primary';
    var rest = Object.assign({}, props);
    ['variant', 'size', 'icon', 'iconRight', 'className', 'children'].forEach(function (k) { delete rest[k]; });
    var cls = cx('am-btn', 'am-btn-' + variant, props.size === 'sm' && 'am-btn-sm', props.className);
    var kids = [props.icon ? h(props.icon === 'github' ? GitHubIcon : Icon, { key: 'i', name: props.icon }) : null, props.children,
      props.iconRight ? h(Icon, { key: 'r', name: props.iconRight }) : null];
    if (props.href) {
      if (props.external) { rest.target = '_blank'; rest.rel = 'noopener noreferrer'; }
      delete rest.external;
      return h.apply(null, ['a', Object.assign({ className: cls }, rest)].concat(kids));
    }
    return h.apply(null, ['button', Object.assign({ type: 'button', className: cls }, rest)].concat(kids));
  }

  /* ---- SectionHeading ---- */
  function SectionHeading(props) {
    return h('header', { className: 'am-sh' },
      props.index ? h('span', { className: 'am-sh-index' }, props.index) : null,
      h('h2', { className: 'am-sh-title', id: props.id }, props.title),
      props.subtitle ? h('p', { className: 'am-sh-sub' }, props.subtitle) : null);
  }

  /* ---- BentoTile ---- */
  function BentoTile(props) {
    var Tag_ = props.href ? 'a' : (props.as || 'div');
    var attrs = { className: cx('am-tile', props.href && 'am-tile-link', props.flush && 'am-tile-flush', props.className) };
    if (props.href) attrs.href = props.href;
    if (props.ariaLabel) attrs['aria-label'] = props.ariaLabel;
    if (props.style) attrs.style = props.style;
    return h(Tag_, attrs,
      props.eyebrow ? h('p', { className: 'am-label am-tile-eyebrow' }, props.eyebrow) : null,
      props.children);
  }

  /* ---- BrowserFrame / PhoneFrame ---- */
  function MockUI() {
    return h('div', { className: 'am-mock', 'aria-hidden': 'true' },
      h('div', { className: 'am-mock-side' }, h('b', { className: 'a', style: { width: '70%' } }), h('b'), h('b'), h('b', { style: { width: '60%' } })),
      h('div', { className: 'am-mock-main' }, h('b', { style: { width: '45%', height: '10px', background: '#2c3438' } }),
        h('div', { className: 'am-mock-cards' }, h('span'), h('span'), h('span')),
        h('div', { className: 'am-mock-rows' }, h('span'), h('span'), h('span'), h('span'))));
  }
  function BrowserFrame(props) {
    var body;
    if (props.src) body = h('img', { src: props.src, alt: props.alt || ('Screenshot of ' + props.title), loading: 'lazy' });
    else if (props.mock) body = h(MockUI);
    else body = h('div', { className: 'am-placeholder', role: 'img', 'aria-label': (props.title || 'Project') + ' — screenshot coming soon' },
      h('span', { className: 'am-placeholder-name' }, props.title || 'Project'), h('span', { className: 'am-label' }, 'Screenshot coming soon'));
    return h('div', { className: cx('am-browser', props.className) },
      h('div', { className: 'am-browser-bar', 'aria-hidden': 'true' }, h('span', { className: 'am-browser-dots' }, h('i'), h('i'), h('i')),
        h('span', { className: 'am-browser-url' }, props.url || 'example.com')),
      h('div', { className: 'am-browser-view' }, body));
  }
  function PhoneFrame(props) {
    return h('div', { className: 'am-phone', 'aria-hidden': props.src ? undefined : 'true' },
      props.src ? h('img', { src: props.src, alt: props.alt || '' }) :
        h('div', { className: 'am-mock', style: { gridTemplateColumns: '1fr' } }, h('div', { className: 'am-mock-main', style: { padding: '10px 8px' } },
          h('b', { className: 'a', style: { width: '60%' } }), h('div', { className: 'am-mock-rows' }, h('span'), h('span'), h('span'), h('span'), h('span')))));
  }

  /* ---- ProjectRow ---- */
  function ProjectRow(p) {
    var host = '';
    try { host = p.liveUrl ? new URL(p.liveUrl).host : ''; } catch (e) { host = p.liveUrl || ''; }
    var actions = [];
    if (p.liveUrl) actions.push(h(Button, { key: 'l', href: p.liveUrl, external: true, variant: 'primary', iconRight: 'ext', 'aria-label': (p.status === 'demo' ? 'View demo of ' : 'View ') + p.name + ' live (opens in new tab)' }, p.status === 'demo' ? 'View demo' : 'View live'));
    if (p.githubUrl) actions.push(h(Button, { key: 'g', href: p.githubUrl, external: true, variant: 'secondary', icon: 'github', 'aria-label': p.name + ' source on GitHub (opens in new tab)' }, 'GitHub'));
    else actions.push(h('span', { key: 'p', className: 'am-pr-private' }, h(Icon, { name: 'lock' }), p.privateNote || 'Private client code'));
    return h('article', { className: cx('am-pr', p.featured && 'am-pr-featured', p.reverse && 'am-pr-reverse'), 'aria-labelledby': p.id ? p.id + '-name' : undefined },
      h('div', { className: 'am-pr-media' },
        h(BrowserFrame, { src: p.image, alt: p.imageAlt, title: p.name, url: host, mock: p.mock }),
        p.featured && (p.phoneImage || p.mock) ? h(PhoneFrame, { src: p.phoneImage }) : null),
      h('div', { className: 'am-pr-body' },
        h('div', { className: 'am-pr-meta' }, h('span', { className: 'am-pr-num' }, p.index + (p.featured ? ' — FEATURED' : '')), h(StatusBadge, { status: p.status || 'live' })),
        h('h3', { className: 'am-pr-name', id: p.id ? p.id + '-name' : undefined }, p.name),
        h('p', { className: 'am-pr-problem' }, p.problem),
        p.outcome ? h('p', { className: 'am-pr-outcome' }, h('span', { className: 'am-label' }, 'Result'), h('span', null, p.outcome)) : null,
        h(TagList, { tags: p.tags }),
        h('div', { className: 'am-pr-actions' }, actions)));
  }

  /* ---- TimelineItem ---- */
  function TimelineItem(p) {
    return h('li', { className: cx('am-tl', p.current && 'am-tl-current') },
      h('div', { className: 'am-tl-when' }, p.period),
      h('div', { className: 'am-tl-rail', 'aria-hidden': 'true' }, h('span', { className: 'am-tl-dot' })),
      h('div', { className: 'am-tl-body' },
        h('h3', { className: 'am-tl-role' }, p.role, h('span', { className: 'am-tl-co' }, ' @ ' + p.company)),
        h('ul', { className: 'am-tl-list' }, (p.bullets || []).map(function (b, i) { return h('li', { key: i }, b); })),
        p.tags ? h(TagList, { tags: p.tags }) : null));
  }

  /* ---- CertItem ---- */
  function CertItem(p) {
    return h('li', { className: 'am-cert' },
      h('div', null, h('p', { className: 'am-cert-name' }, p.name), h('p', { className: 'am-cert-by' }, p.issuer + ' · ' + p.year)),
      p.verifyUrl ? h('a', { className: 'am-cert-verify', href: p.verifyUrl, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Verify ' + p.name + ' (opens in new tab)' }, 'Verify ↗') : null);
  }

  /* ---- ContactForm ---- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(v) {
    var e = {};
    if (!v.name.trim()) e.name = 'Please enter your name.';
    if (!v.email.trim()) e.email = 'Please enter your email so I can reply.';
    else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email looks incomplete — check for a missing @ or domain.';
    if (v.message.trim().length < 10) e.message = 'Please write a short message (at least 10 characters).';
    return e;
  }
  function Field(p) {
    var errId = p.id + '-err';
    var input = h(p.multiline ? 'textarea' : 'input', { id: p.id, name: p.id, className: 'am-input', type: p.multiline ? undefined : (p.type || 'text'),
      value: p.value, placeholder: p.placeholder, autoComplete: p.autoComplete, onChange: p.onChange,
      'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': p.error ? errId : undefined });
    return h('div', { className: 'am-field' },
      h('label', { htmlFor: p.id }, p.label), input,
      p.error ? h('p', { className: 'am-error', id: errId }, h(Icon, { name: 'alert' }), p.error) : null);
  }
  function ContactForm(props) {
    var init = props.initialValues || { name: '', email: '', message: '' };
    var s = useState(init), values = s[0], setValues = s[1];
    var e = useState(props.initialErrors || {}), errors = e[0], setErrors = e[1];
    var st = useState(props.initialStatus || 'idle'), status = st[0], setStatus = st[1];
    var uid = props.idPrefix || 'cf';
    function set(k) { return function (ev) { var v = Object.assign({}, values); v[k] = ev.target.value; setValues(v); if (errors[k]) { var n = Object.assign({}, errors); delete n[k]; setErrors(n); } }; }
    function submit(ev) {
      ev.preventDefault();
      var found = validate(values); setErrors(found);
      if (Object.keys(found).length) { var first = document.getElementById(uid + '-' + Object.keys(found)[0]); if (first) first.focus(); return; }
      setStatus('sending');
      Promise.resolve(props.onSubmit ? props.onSubmit(values) : null).then(function () { setStatus('sent'); }, function () { setStatus('failed'); });
    }
    if (status === 'sent') {
      return h('div', { className: 'am-success', role: 'status' },
        h('span', { className: 'am-success-icon' }, h(Icon, { name: 'check' })),
        h('h3', null, 'Message sent — thank you' + (values.name ? ', ' + values.name.split(' ')[0] : '') + '.'),
        h('p', null, 'I reply within 1–2 working days. If it’s urgent, email me directly.'),
        h(Button, { variant: 'secondary', size: 'sm', onClick: function () { setValues({ name: '', email: '', message: '' }); setStatus('idle'); } }, 'Send another message'));
    }
    return h('form', { className: 'am-form', noValidate: true, onSubmit: submit, 'aria-label': 'Contact form' },
      h(Field, { id: uid + '-name', label: 'Name', value: values.name, onChange: set('name'), error: errors.name, autoComplete: 'name', placeholder: 'Your name' }),
      h(Field, { id: uid + '-email', label: 'Email', type: 'email', value: values.email, onChange: set('email'), error: errors.email, autoComplete: 'email', placeholder: 'you@company.com' }),
      h(Field, { id: uid + '-message', label: 'Message', multiline: true, value: values.message, onChange: set('message'), error: errors.message, placeholder: 'Tell me about the role or project' }),
      status === 'failed' ? h('p', { className: 'am-error', role: 'alert' }, h(Icon, { name: 'alert' }), 'Something went wrong. Please email me directly instead.') : null,
      h('div', { className: 'am-form-foot' },
        h('span', { className: 'am-tile-muted' }, 'All fields are required.'),
        h(Button, { type: 'submit', variant: 'primary', 'aria-disabled': status === 'sending' ? 'true' : undefined }, status === 'sending' ? 'Sending…' : 'Send message')));
  }

  /* ---- Navbar ---- */
  function Navbar(p) {
    var links = p.links || [{ label: 'Work', href: '#work' }, { label: 'Experience', href: '#experience' }, { label: 'Certifications', href: '#certifications' }, { label: 'Contact', href: '#contact' }];
    var o = useState(!!p.defaultOpen), open = o[0], setOpen = o[1];
    return h('nav', { className: 'am-nav', 'aria-label': 'Main' },
      h('div', { className: 'am-nav-inner' },
        h('a', { className: 'am-nav-brand', href: '#top' }, p.name || 'Amar', h('span', null, '.')),
        h('ul', { className: 'am-nav-links' }, links.map(function (l) { return h('li', { key: l.href }, h('a', { className: 'am-nav-link', href: l.href }, l.label)); })),
        h('a', { className: 'am-nav-contact', href: '#contact' }, 'Contact'),
        h(Button, { href: p.cvHref || '#', variant: 'primary', size: 'sm', icon: 'download', download: true }, 'Download CV'),
        h('button', { type: 'button', className: 'am-nav-menu', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'am-nav-sheet', 'aria-label': open ? 'Close menu' : 'Open menu', onClick: function () { setOpen(!open); } },
          h(Icon, { name: open ? 'close' : 'menu' }))),
      h('div', { id: 'am-nav-sheet', className: cx('am-nav-sheet', open && 'is-open') },
        h('ul', null, links.map(function (l) { return h('li', { key: l.href }, h('a', { href: l.href, onClick: function () { setOpen(false); } }, l.label)); }))));
  }

  /* ---- Reveal (fade-in on scroll; off under prefers-reduced-motion via CSS) ---- */
  function Reveal(p) {
    var ref = useRef(null);
    var s = useState(false), shown = s[0], setShown = s[1];
    useEffect(function () {
      var el = ref.current;
      if (!el || !('IntersectionObserver' in window)) { setShown(true); return; }
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
      io.observe(el);
      var t = setTimeout(function () { setShown(true); }, 1500);
      return function () { io.disconnect(); clearTimeout(t); };
    }, []);
    return h(p.as || 'div', { ref: ref, className: cx('am-reveal', shown && 'is-in', p.className), id: p.id }, p.children);
  }

  window.Amar = Object.assign(window.Amar || {}, {
    Navbar: Navbar, Button: Button, Tag: Tag, TagList: TagList, StatusBadge: StatusBadge, SectionHeading: SectionHeading,
    BentoTile: BentoTile, BrowserFrame: BrowserFrame, PhoneFrame: PhoneFrame, ProjectRow: ProjectRow, TimelineItem: TimelineItem,
    CertItem: CertItem, ContactForm: ContactForm, Reveal: Reveal, Icon: Icon, GitHubIcon: GitHubIcon
  });
})();
