(function () {
  var ROOT_PREFIX = document.currentScript && document.currentScript.getAttribute('data-prefix') || '';
  var API_URL = 'https://psrb-chat.ca-psrb-llp.workers.dev/';
  var history = [];

  var FAQ = [
    { keys: ['audit', 'statutory audit', 'tax audit', 'internal audit', 'concurrent audit', 'bank audit', 'stock audit'],
      answer: "We offer Statutory Audit, Tax Audit (44AB), Internal Audit, Concurrent Audit, Bank/Stock Audit, Limited Review &amp; Due Diligence, and Compliance Audit. <a href=\"PREFIXservices.html#audit\">See Audit &amp; Assurance details →</a>" },
    { keys: ['tax', 'gst', 'income tax', 'litigation', 'tds', 'tax return', 'return filing'],
      answer: "Our Taxation practice covers Income Tax Advisory &amp; Return Filing, GST Registration/Returns/Audits, Corporate Tax Compliance, and representation before tax authorities &amp; tribunals. <a href=\"PREFIXservices.html#tax\">See Taxation details →</a>" },
    { keys: ['valuation', 'business valuation', 'ibbi', 'dcf', 'fairness opinion', 'merger', 'acquisition', 'm&a', 'm and a'],
      answer: "We provide Business Valuation, Financial Asset &amp; Securities Valuation (IBBI Registered Valuer), M&amp;A valuation, FEMA/Companies Act compliance valuation, and Fairness Opinions. <a href=\"PREFIXservices.html#valuation\">See Valuation details →</a>" },
    { keys: ['loan', 'project finance', 'bank finance', 'dpr', 'cma data', 'nbfc', 'working capital', 'funding'],
      answer: "We help with Detailed Project Reports (DPR), CMA Data, Term Loan &amp; Working Capital assistance, Bank/NBFC liaison, and government scheme advisory (CGTMSE, PMEGP). <a href=\"PREFIXservices.html#finance\">See Project Finance details →</a>" },
    { keys: ['process', 'automation', 'ifc', 'sop', 'internal control', 'erp', 'mis'],
      answer: "Our Process Automation &amp; IFC services include Internal Financial Control design, SOP development, accounting automation, and ERP/MIS advisory. <a href=\"PREFIXservices.html#process\">See Process Automation details →</a>" },
    { keys: ['startup', 'msme', 'entity', 'registration', 'company formation', 'llp', 'incorporation', 'fundraise', 'investor'],
      answer: "For startups &amp; MSMEs we offer entity structuring/formation, accounting &amp; compliance setup, growth advisory, and investor/lender readiness preparation. <a href=\"PREFIXservices.html#msme\">See Startup &amp; MSME details →</a>" },
    { keys: ['service', 'services', 'what do you do', 'offer'],
      answer: "We offer six core services: Audit &amp; Assurance, Taxation &amp; Compliance, Valuation &amp; Transaction Advisory, Project Finance &amp; Banking, Process Automation &amp; IFC, and Startup &amp; MSME Advisory. <a href=\"PREFIXservices.html\">View all services →</a>" },
    { keys: ['contact', 'phone', 'number', 'call', 'email', 'reach', 'address'],
      answer: "You can reach us at <strong>+91-9437634787 / 7377496459</strong> or email <strong>ca.psrb.llp@gmail.com</strong>. <a href=\"PREFIXcontact.html\">Open Contact page →</a>" },
    { keys: ['team', 'partner', 'partners', 'who are you', 'founder', 'leadership'],
      answer: "PSRB &amp; Associates LLP has 4+ partners — Pankaj Sahoo (Valuation &amp; Project Finance), Saubhagya Ranjan Bal (GST &amp; Income Tax), Laxmi Prasad Maharana (Process Advisory), and Rakesh Ranjan Pal (Operations). <a href=\"PREFIXteam.html\">Meet the team →</a>" },
    { keys: ['blog', 'article', 'insight', 'read'],
      answer: "Check out our blog for practical guidance on tax, audit, and finance. <a href=\"PREFIXblog/index.html\">Visit the Blog →</a>" },
    { keys: ['consult', 'consultation', 'appointment', 'meeting', 'book', 'schedule'],
      answer: "We'd be happy to schedule a no-obligation consultation. <a href=\"PREFIXcontact.html\">Get in touch here →</a> or call +91-9437634787." },
    { keys: ['fee', 'fees', 'cost', 'price', 'charge'],
      answer: "Fees depend on the scope and nature of the engagement. Share your requirement on our <a href=\"PREFIXcontact.html\">Contact page</a> and a partner will get back to you with a quote." },
    { keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon'],
      answer: "Hello! I'm the PSRB Associates assistant. Ask me about our services, partners, or how to reach us." },
    { keys: ['thank', 'thanks'],
      answer: "You're welcome! Let us know if you have any other questions." }
  ];

  var DEFAULT_ANSWER = "I can help with questions about our services (Audit, Taxation, Valuation, Project Finance, Process Automation, MSME Advisory), our team, or how to contact us. You can also reach a partner directly via the <a href=\"PREFIXcontact.html\">Contact page</a> or call +91-9437634787.";

  function withPrefix(html) {
    return html.split('PREFIX').join(ROOT_PREFIX);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function localAnswer(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;
    FAQ.forEach(function (item) {
      item.keys.forEach(function (k) {
        if (q.indexOf(k) !== -1 && k.length > bestScore) {
          best = item;
          bestScore = k.length;
        }
      });
    });
    return best ? withPrefix(best.answer) : withPrefix(DEFAULT_ANSWER);
  }

  function linkify(text) {
    // turn plain "contact page" style hints into nothing extra; just escape and preserve line breaks
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  async function aiAnswer(text) {
    history.push({ role: 'user', content: text });
    var res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });
    if (!res.ok) throw new Error('Bad response: ' + res.status);
    var data = await res.json();
    if (!data.reply) throw new Error('No reply field');
    history.push({ role: 'assistant', content: data.reply });
    if (history.length > 12) history = history.slice(-12);
    return linkify(data.reply);
  }

  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.id = 'psrb-chat-widget';
    wrap.innerHTML =
      '<button id="psrb-chat-toggle" aria-label="Open chat">💬</button>' +
      '<div id="psrb-chat-panel" class="hidden">' +
        '<div class="psrb-chat-head">' +
          '<div><strong>PSRB Assistant</strong><div class="psrb-chat-sub">AI-powered — ask about our services</div></div>' +
          '<button id="psrb-chat-close" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<div id="psrb-chat-body"></div>' +
        '<div class="psrb-chat-quick" id="psrb-chat-quick">' +
          '<button data-q="What services do you offer?">Services</button>' +
          '<button data-q="How can I contact you?">Contact</button>' +
          '<button data-q="Tell me about your team">Our Team</button>' +
          '<button data-q="I want a consultation">Book Consultation</button>' +
        '</div>' +
        '<form id="psrb-chat-form">' +
          '<input id="psrb-chat-input" type="text" placeholder="Type your question..." autocomplete="off">' +
          '<button type="submit">Send</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    var panel = document.getElementById('psrb-chat-panel');
    var body = document.getElementById('psrb-chat-body');
    var toggle = document.getElementById('psrb-chat-toggle');
    var closeBtn = document.getElementById('psrb-chat-close');
    var form = document.getElementById('psrb-chat-form');
    var input = document.getElementById('psrb-chat-input');
    var quick = document.getElementById('psrb-chat-quick');

    function addMsg(html, who) {
      var div = document.createElement('div');
      div.className = 'psrb-msg ' + (who === 'user' ? 'psrb-msg-user' : 'psrb-msg-bot');
      div.innerHTML = html;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function addTyping() {
      var div = addMsg('<span class="psrb-typing"><span></span><span></span><span></span></span>', 'bot');
      div.classList.add('psrb-typing-msg');
      return div;
    }

    function greet() {
      if (body.children.length === 0) {
        addMsg("Hi! 👋 I'm the PSRB &amp; Associates AI assistant. Ask me anything about our services, partners, or how to get in touch — or tap a quick option below.", 'bot');
      }
    }

    function ask(text) {
      if (!text.trim()) return;
      addMsg(escapeHtml(text), 'user');
      input.value = '';
      var typingEl = addTyping();

      aiAnswer(text).then(function (reply) {
        typingEl.remove();
        addMsg(reply, 'bot');
      }).catch(function () {
        typingEl.remove();
        addMsg(localAnswer(text), 'bot');
      });
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) { greet(); input.focus(); }
    });
    closeBtn.addEventListener('click', function () { panel.classList.add('hidden'); });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    quick.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') { ask(e.target.getAttribute('data-q')); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
