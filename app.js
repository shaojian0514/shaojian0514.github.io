/* 页面组件。个人资料与项目文字在 content.js 中维护。 */
(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const main = document.getElementById('main');
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = '<span aria-hidden="true">↗</span>';
  const external = (url, text, cls='text-link') => url && /^https?:\/\//i.test(url) ? `<a class="${cls}" href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(text)} ${arrow}</a>` : '';
  const tags = items => `<div class="tags">${items.map(t=>`<span>${e(t)}</span>`).join('')}</div>`;
  const links = p => `<div class="case-links">${p.paper ? external(p.paper,'Paper · Springer') : ''}${external(p.code,'Code · GitHub')}</div>`;
  const status = p => p.status ? `<span class="status ${p.status==='在投'?'pending':''}">${e(p.status)}</span>` : '';
  function image(p, eager=false) {
    return `<img src="${e(p.image)}" alt="${e(p.alt)}" width="1672" height="941" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  }
  function project(p, {compact=false,eager=false}={}) {
    return `<article class="project ${compact?'compact':''}">
      <a class="cover" href="#case/${p.id}" aria-label="查看 ${e(p.name)} 案例">${image(p,eager)}<span class="cover-mark">${e(p.name)} <span>↗</span></span></a>
      <div class="project-info"><div><div class="eyebrow">${e(p.label)}</div><h${compact?'3':'2'}><a href="#case/${p.id}">${e(p.name)}<span>${e(p.subtitle)}</span></a></h${compact?'3':'2'}>${status(p)}</div>
      <div class="project-description">${p.title?`<p class="paper-name">${e(p.title)}</p>`:''}<p>${e(p.summary)}</p><div class="project-actions"><a class="text-link" href="#case/${p.id}">了解${p.type==='research'?'研究':'项目'} <span aria-hidden="true">→</span></a>${p.paper?external(p.paper,'Paper'):''}${external(p.code,'Code')}</div></div></div>
    </article>`;
  }
  function contact() {
    return `<section class="contact"><div class="eyebrow">LET’S CONNECT</div><h2>从一次交流开始。</h2><p>欢迎交流 LLM、Agent 与医学多模态研究，<br>也期待一起把有意思的想法做成产品。</p><a class="button primary" href="mailto:${e(data.profile.email)}">联系我 ${arrow}</a><a class="contact-address" href="mailto:${e(data.profile.email)}">${e(data.profile.email)}</a></section>`;
  }
  function home() {
    const featured=data.projects.find(p=>p.type==='research');
    const engineering=data.projects.filter(p=>p.type==='work');
    return `<section class="hero">${featured?`<a href="#case/${featured.id}" class="announcement"><span class="live-dot"></span>${e(featured.name)} · ${e(featured.venue)} <span>${e(featured.status)} ↗</span></a>`:''}
      <div class="eyebrow hero-kicker">RESEARCHER & PRODUCT ENGINEER</div><h1>${e(data.profile.title).split('\n').map((line,i)=>i?`<br><span>${line}</span>`:line).join('')}</h1>
      <p class="hero-intro">${e(data.profile.intro)}</p>
      <div class="hero-bottom"><a class="person-pill" href="#about"><img src="${e(data.profile.portrait||'assets/portrait.png')}" width="44" height="44" alt="${e(data.profile.name)}的头像"><span>关于我 <span aria-hidden="true">→</span></span></a><span class="hero-line"></span><span class="hero-note">${e(data.profile.interests.join(' · '))}</span></div>
    </section>
    ${featured?`<section class="selected"><div class="section-title"><div><span class="eyebrow">SELECTED RESEARCH</span><h2>从问题出发，探索可靠的智能。</h2></div><a class="text-link" href="#research">全部论文 →</a></div>${project(featured,{eager:true})}</section>`:''}
    ${engineering.length?`<section class="selected"><div class="section-title"><div><span class="eyebrow">SELECTED ENGINEERING</span><h2>把想法，构建成系统。</h2></div><a class="text-link" href="#work">全部项目 →</a></div><div class="project-grid">${engineering.map(p=>project(p,{compact:true})).join('')}</div></section>`:''}
    <section class="experience-teaser"><div><div class="eyebrow">A LITTLE ABOUT ME</div><h2>在研究和产品之间，<br>持续探索。</h2><a class="text-link" href="#about">经历与技能 →</a></div><div>${data.experience.map(x=>`<div class="teaser-row"><span>${e(x.company)}</span><p>${e(x.role)}</p><small>${e(x.date)}</small></div>`).join('')}</div></section>${contact()}`;
  }
  function listing(type) {
    const research = type==='research';
    return `<section class="page-intro"><span class="eyebrow">${research?'PUBLICATIONS & RESEARCH':'SELECTED ENGINEERING'}</span><h1>${research?'让研究，有迹可循。':'把想法，构建成系统。'}</h1><p>${research?'围绕医学多模态、报告生成与智能体检索展开研究。':'从模型训练到智能体协作，探索可用、可维护的 AI 系统。'}</p></section>
      <section class="project-list">${data.projects.filter(p=>p.type===type).map((p,i)=>project(p,{eager:i===0})).join('')}</section>
      ${research&&data.otherPapers.length?`<section class="other-papers"><div class="section-title"><h2>其他研究</h2></div>${data.otherPapers.map(p=>`<article><div><span class="eyebrow">${e(p.venue)}</span><h3>${e(p.title)}</h3><p>${e(p.role)}</p>${links(p)}</div>${status(p)}</article>`).join('')}</section>`:''}
      <p class="visual-note">封面为 AI 生成的项目概念插画；具体实现与研究结论请参阅代码和论文。</p>${contact()}`;
  }
  function about() {
    return `<section class="about-head"><div class="about-portrait"><img src="${e(data.profile.portrait||'assets/portrait.png')}" width="570" height="684" alt="${e(data.profile.name)}个人照片"><span>${e(data.profile.location)}</span></div><div><span class="eyebrow">A LITTLE ABOUT ME</span><h1>${e(data.profile.name)}<span>${e(data.profile.english)}</span></h1><p>${e(data.profile.intro)}</p>${tags(data.profile.interests)}<div class="about-links">${external(data.profile.github,'GitHub')}<a class="text-link" href="mailto:${e(data.profile.email)}">Email ↗</a></div></div></section>
      <div class="about-layout"><aside><a href="#experience">经历</a><a href="#education">教育</a><a href="#skills">技能</a></aside><div>
      <section class="about-section" id="experience"><div class="section-title"><h2>工作经历</h2><span class="eyebrow">EXPERIENCE</span></div>${data.experience.map(x=>`<article class="timeline-item"><div class="timeline-top"><h3>${e(x.company)}</h3><span>${e(x.date)}</span></div><p class="role">${e(x.role)}</p><p class="muted">${e(x.team)}</p><p>${e(x.text)}</p></article>`).join('')}</section>
      <section class="about-section" id="education"><div class="section-title"><h2>教育背景</h2><span class="eyebrow">EDUCATION</span></div>${data.education.map(x=>`<article class="education-item"><div><h3>${e(x.school)}</h3><p>${e(x.subject)}</p></div><span>${e(x.date)}</span></article>`).join('')}<p class="honors">${data.honors.map(e).join(' · ')}</p></section>
      <section class="about-section" id="skills"><div class="section-title"><h2>技能与工具</h2><span class="eyebrow">TOOLKIT</span></div>${data.skills.map(x=>`<div class="skill-row"><h3>${e(x.name)}</h3>${tags(x.items)}</div>`).join('')}</section>
      </div></div>${contact()}`;
  }
  function casePage(p) {
    return `<article class="case-detail"><a class="back text-link" href="#${p.type}">← 返回${p.type==='research'?'论文与研究':'项目'}</a><header class="case-heading"><div class="eyebrow">${e(p.label)}</div><h1>${e(p.name)}<span>${e(p.subtitle)}</span></h1><p>${e(p.summary)}</p>${status(p)}${links(p)}</header>
      <figure class="detail-figure">${image(p,true)}<figcaption>AI 生成的概念插画，用于介绍研究或项目主题。</figcaption></figure>
      <div class="case-meta"><div><small>ROLE</small><span>${e(p.role)}</span></div><div><small>${p.venue?'VENUE':'FOCUS'}</small><span>${e(p.venue || 'Open-source engineering')}</span></div><div><small>KEYWORDS</small><span>${p.tags.map(e).join(' / ')}</span></div></div>
      ${p.title?`<p class="paper-title">${e(p.title)}</p>`:''}
      <section class="method"><div class="eyebrow">${p.type==='research'?'RESEARCH OVERVIEW':'SYSTEM OVERVIEW'}</div><div class="flow">${p.flow.map((x,i)=>`<div><small>0${i+1}</small><span>${e(x)}</span></div>`).join('')}</div></section>
      <div class="case-copy">${p.sections.map(s=>`<section><h2>${e(s.title)}</h2><p>${e(s.text)}</p></section>`).join('')}${links(p)}</div>
      <div class="case-next"><span class="eyebrow">CONTINUE EXPLORING</span>${data.projects.filter(x=>x.type===p.type&&x.id!==p.id).map(x=>`<a href="#case/${x.id}"><span>${e(x.name)}</span><span>${e(x.subtitle)} →</span></a>`).join('')}</div></article>`;
  }
  function render() {
    let route='home';try{route=decodeURIComponent(location.hash.slice(1)||'home')}catch{}
    // About section anchors remain part of the about view and support direct links.
    const anchor = ['experience','education','skills'].includes(route) ? route : null;
    let active = anchor?'about':route;
    let html;
    const p = route.startsWith('case/') && data.projects.find(x=>x.id===route.split('/')[1]);
    if(p){html=casePage(p);active=p.type;document.title=`${p.name} · 邵建钧`;}
    else if(active==='about'){html=about();document.title='关于 · 邵建钧';}
    else if(['work','research'].includes(active)){html=listing(active);document.title=`${active==='work'?'项目':'论文'} · 邵建钧`;}
    else{html=home();active='home';document.title='邵建钧 · Research & Engineering';}
    main.innerHTML=html;
    document.title=document.title.replace('邵建钧',data.profile.name);
    document.querySelector('meta[name="description"]').content=data.profile.intro;
    document.querySelector('.location').innerHTML=`${e(data.profile.english)} <span>${e(data.profile.location)}</span>`;
    document.querySelector('footer>div').innerHTML=`© ${new Date().getFullYear()} ${e(data.profile.name)} <span class="footer-slash">/</span> ${e(data.profile.english)}`;
    const footerLinks=document.querySelector('.footer-links');footerLinks.innerHTML=`${external(data.profile.github,'GitHub','')}<a href="mailto:${e(data.profile.email)}">Email ↗</a><a href="#home">返回顶部 ↑</a>`;
    document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(anchor)document.getElementById(anchor)?.scrollIntoView({block:'start'});else window.scrollTo({top:0,behavior:'instant'});
    if(loaded)main.focus({preventScroll:true});
    loaded=true;
  }
  let loaded=false;
  window.addEventListener('hashchange',render);
  const themeButton=document.getElementById('theme');
  function themeLabel(){const dark=document.documentElement.dataset.theme==='dark';themeButton.setAttribute('aria-label',`切换到${dark?'浅':'深'}色主题`);themeButton.setAttribute('aria-pressed',String(dark));document.querySelector('meta[name="theme-color"]').content=dark?'#111715':'#f7f9f7';}
  themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('jianjun-theme',theme)}catch{}themeLabel();});
  function clock(){document.getElementById('clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' CST';}
  document.getElementById('year').textContent=new Date().getFullYear();
  themeLabel();clock();setInterval(clock,60000);render();
})();
