/* 页面组件。个人资料与项目文字在 content.js 中维护。 */
(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const main = document.getElementById('main');
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = '<span aria-hidden="true">↗</span>';
  const companyName = name => name === 'Microsoft · Bing' ? 'Microsoft' : name;
  function companyMark(name) {
    if (name.includes('小红书')) return '<span class="company-mark xiaohongshu" aria-hidden="true"><img src="data:image/png;base64,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" alt=""></span>';
    if (/^Microsoft/i.test(name)) return '<span class="company-mark microsoft" aria-hidden="true"><svg viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h10.8v10.8H0z"/><path fill="#7fba00" d="M12.2 0H23v10.8H12.2z"/><path fill="#00a4ef" d="M0 12.2h10.8V23H0z"/><path fill="#ffb900" d="M12.2 12.2H23V23H12.2z"/></svg></span>';
    return '';
  }
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
    return `<section class="hero">
      <div class="eyebrow hero-kicker">RESEARCHER & PRODUCT ENGINEER</div><h1>${e(data.profile.title).split('\n').map((line,i)=>i?`<br><span>${line}</span>`:line).join('')}</h1>
      <p class="hero-intro">${e(data.profile.intro)}</p>
      <div class="hero-bottom"><a class="person-pill" href="#about"><img src="${e(data.profile.portrait||'assets/portrait.png')}" width="44" height="44" alt="${e(data.profile.name)}的头像"><span>关于我 <span aria-hidden="true">→</span></span></a><span class="hero-line"></span><span class="hero-note">${e(data.profile.interests.join(' · '))}</span></div>
    </section>
    ${featured?`<section class="selected"><div class="section-title"><div><span class="eyebrow">SELECTED RESEARCH</span><h2>从问题出发，探索可靠的智能。</h2></div><a class="text-link" href="#research">全部论文 →</a></div>${project(featured,{eager:true})}</section>`:''}
    ${engineering.length?`<section class="selected"><div class="section-title"><div><span class="eyebrow">SELECTED ENGINEERING</span><h2>把想法，构建成系统。</h2></div><a class="text-link" href="#work">全部项目 →</a></div><div class="project-grid">${engineering.map(p=>project(p,{compact:true})).join('')}</div></section>`:''}
    ${blogHome()}<section class="experience-teaser"><div><div class="eyebrow">A LITTLE ABOUT ME</div><h2>在研究和产品之间，<br>持续探索。</h2><a class="text-link" href="#about">经历与技能 →</a></div><div>${data.experience.map(x=>`<div class="teaser-row ${companyMark(x.company)?'with-logo':''}"><span class="company-heading">${companyMark(x.company)}${e(companyName(x.company))}</span><p>${e(x.role)}</p><small>${e(x.date)}</small></div>`).join('')}</div></section>${contact()}`;
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
      <section class="about-section" id="experience"><div class="section-title"><h2>工作经历</h2><span class="eyebrow">EXPERIENCE</span></div>${data.experience.map(x=>`<article class="timeline-item ${companyMark(x.company)?'with-logo':''}"><div class="timeline-top"><h3 class="company-heading">${companyMark(x.company)}${e(companyName(x.company))}</h3><span>${e(x.date)}</span></div><p class="role">${e(x.role)}</p><p class="muted">${e(x.team)}</p><p>${e(x.text)}</p></article>`).join('')}</section>
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
  function publishedPosts(){return (data.posts||[]).filter(p=>p.status==='published').slice().sort((a,b)=>b.date.localeCompare(a.date));}
  function blogUrl(value,image=false){
    const url=String(value||'').trim();
    if(/^https?:\/\/[^\s]+$/i.test(url))return url;
    if(image&&/^assets\/[A-Za-z0-9._-]+\.(png|jpe?g|webp)$/i.test(url))return url;
    if(image&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(url))return url;
    return '';
  }
  function blogInline(text){
    const pattern=/`([^`\n]+)`|!\[([^\]\n]*)\]\(([^\s)]+)\)|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
    let html='',last=0,m;
    while((m=pattern.exec(text))){html+=e(text.slice(last,m.index));
      if(m[1]!=null)html+=`<code>${e(m[1])}</code>`;
      else if(m[2]!=null){const url=blogUrl(m[3],true);html+=url?`<img src="${e(url)}" alt="${e(m[2])}" loading="lazy" decoding="async">`:e(m[0]);}
      else if(m[4]!=null){const url=blogUrl(m[5]);html+=url?`<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(m[4])} ↗</a>`:e(m[4]);}
      else if(m[6]!=null)html+=`<strong>${e(m[6])}</strong>`;
      else html+=`<em>${e(m[7])}</em>`;
      last=pattern.lastIndex;
    }return html+e(text.slice(last));
  }
  function renderMarkdown(markdown){
    const lines=String(markdown||'').replace(/\r\n?/g,'\n').split('\n');let out=[],paragraph=[],list=[],listType='',quote=[];
    function flush(){if(paragraph.length){out.push('<p>'+paragraph.map(blogInline).join('<br>')+'</p>');paragraph=[];}if(list.length){out.push(`<${listType}>`+list.map(t=>'<li>'+blogInline(t)+'</li>').join('')+`</${listType}>`);list=[];listType='';}if(quote.length){out.push('<blockquote>'+quote.map(blogInline).join('<br>')+'</blockquote>');quote=[];}}
    for(let i=0;i<lines.length;i++){const line=lines[i];
      const fence=line.match(/^\s*```([\w+-]*)\s*$/);
      if(fence){flush();let code=[];while(++i<lines.length&&!/^\s*```\s*$/.test(lines[i]))code.push(lines[i]);out.push(`<pre><code${fence[1]?` data-language="${e(fence[1])}"`:''}>${e(code.join('\n'))}</code></pre>`);continue;}
      if(!line.trim()){flush();continue;}
      const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){flush();const level=Math.max(2,heading[1].length);out.push(`<h${level}>${blogInline(heading[2])}</h${level}>`);continue;}
      if(/^\s*(?:---+|\*\*\*+)\s*$/.test(line)){flush();out.push('<hr>');continue;}
      const q=line.match(/^>\s?(.*)$/);if(q){if(paragraph.length||list.length)flush();quote.push(q[1]);continue;}
      const bullet=line.match(/^\s*([-*+]\s+|\d+[.)]\s+)(.+)$/);if(bullet){const type=/^\d/.test(bullet[1])?'ol':'ul';if(paragraph.length||quote.length||(listType&&listType!==type))flush();listType=type;list.push(bullet[2]);continue;}
      if(list.length||quote.length)flush();paragraph.push(line);
    }flush();return out.join('\n');
  }
  function postExcerpt(p){return p.summary||p.body.replace(/[#*`>\[\]]/g,'').slice(0,110);}
  function postCard(p){return `<article class="blog-card"><a href="#post/${e(p.id)}" class="blog-cover ${p.cover?'':'no-image'}" aria-label="阅读：${e(p.title)}">${p.cover?`<img src="${e(p.cover)}" alt="${e(p.alt||p.title)}" loading="lazy" decoding="async">`:`<span class="cover-category">${e(p.category||'随笔')}</span><span class="cover-title">${e(p.title)}</span><span class="cover-arrow" aria-hidden="true">↗</span>`}</a><div class="blog-card-meta"><time datetime="${e(p.date)}">${e(p.date.replace(/-/g,'.'))}</time><span>${e(p.category||'随笔')}</span></div><h2><a href="#post/${e(p.id)}">${e(p.title)}</a></h2><p>${e(postExcerpt(p))}</p><a class="text-link" href="#post/${e(p.id)}">阅读全文 <span aria-hidden="true">→</span></a></article>`;}
  function blogHome(){const posts=publishedPosts().slice(0,3);return posts.length?`<section class="selected blog-home"><div class="section-title"><div><span class="eyebrow">RECENT WRITING</span><h2>记录新知，也记录思考。</h2></div><a class="text-link" href="#blog">全部博文 →</a></div><div class="blog-grid">${posts.map(postCard).join('')}</div></section>`:'';}
  let blogQuery='',blogCategory='全部';
  function blogList(){const posts=publishedPosts();const categories=['全部',...new Set(posts.map(p=>p.category||'随笔'))];if(!categories.includes(blogCategory))blogCategory='全部';
    return `<section class="page-intro blog-intro"><span class="eyebrow">NOTES ON AI & BUILDING</span><h1>记录新知，也记录思考。</h1><p>AI 动态、技术实践，以及研究与构建过程中的点滴。</p></section>${posts.length?`<div class="blog-tools"><div class="blog-filters" role="group" aria-label="文章分类">${categories.map(c=>`<button data-blog-category="${e(c)}" aria-pressed="${c===blogCategory}">${e(c)}</button>`).join('')}</div><input type="search" id="blog-search" aria-label="搜索博文" placeholder="搜索标题、摘要或标签…" value="${e(blogQuery)}"></div><p class="blog-count" id="blog-count" role="status" aria-live="polite"></p><div class="blog-grid" id="blog-results"></div>`:`<div class="blog-empty"><span class="eyebrow">A SPACE FOR IDEAS</span><h2>下一篇，值得记录的发现。</h2><p>这里将分享 AI 动态、技术笔记和项目思考。<br>新的文章正在准备中，欢迎之后再来看看。</p><a class="text-link" href="${e(data.profile.github)}" target="_blank" rel="noopener noreferrer">先看看我的 GitHub ↗</a></div>`}${contact()}`;
  }
  function bindBlog(){const results=document.getElementById('blog-results');if(!results)return;const update=()=>{const q=blogQuery.trim().toLocaleLowerCase();const found=publishedPosts().filter(p=>(blogCategory==='全部'||(p.category||'随笔')===blogCategory)&&(!q||[p.title,p.summary,p.category,...(p.tags||[])].join(' ').toLocaleLowerCase().includes(q)));results.innerHTML=found.length?found.map(postCard).join(''):'<p class="blog-no-results">没有匹配的文章，换个关键词试试。</p>';document.getElementById('blog-count').textContent=`${found.length} 篇文章`;document.querySelectorAll('[data-blog-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.blogCategory===blogCategory)));};document.getElementById('blog-search').addEventListener('input',event=>{blogQuery=event.target.value;update();});document.querySelectorAll('[data-blog-category]').forEach(b=>b.addEventListener('click',()=>{blogCategory=b.dataset.blogCategory;update();}));update();}
  function postPage(p){const minutes=Math.max(1,Math.ceil(p.body.length/450));const more=publishedPosts().filter(x=>x.id!==p.id).slice(0,2);return `<article class="post-detail"><a class="text-link back" href="#blog">← 返回博文</a><header class="post-heading"><div class="eyebrow">${e(p.category||'随笔')}</div><h1>${e(p.title)}</h1><div class="post-meta"><time datetime="${e(p.date)}">${e(p.date.replace(/-/g,'.'))}</time><span>${e(data.profile.name)}</span><span>约 ${minutes} 分钟阅读</span></div>${p.summary?`<p class="post-summary">${e(p.summary)}</p>`:''}${tags(p.tags||[])}</header>${p.cover?`<figure class="post-hero"><img src="${e(p.cover)}" alt="${e(p.alt||p.title)}" decoding="async"></figure>`:''}<div class="post-prose">${renderMarkdown(p.body)}${p.source?`<div class="post-source">${external(p.source,'参考来源')}</div>`:''}</div>${more.length?`<section class="more-posts"><div class="section-title"><h2>继续阅读</h2><a class="text-link" href="#blog">全部博文 →</a></div><div class="blog-grid">${more.map(postCard).join('')}</div></section>`:''}</article>`;}

  function createDailyClient({fetch:fetcher,storage=null,now=()=>Date.now(),timeoutMs=12000}){
    const base='https://aihot.news/api/v1/dailies',key='jianjun-aihot-reader-v2';
    const caches=new Map(),inflight=new Map(),gates=new Map();let retryAt=0;
    const isDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
    const isIndex=resource=>resource==='index:60'||resource==='index:180';
    const endpointFor=resource=>resource==='latest'?base+'/latest':isIndex(resource)?base+'?limit='+resource.split(':')[1]:isDate(resource)?base+'/'+resource:null;
    const valid=(payload,resource)=>payload?.schemaVersion===1&&(isIndex(resource)?Array.isArray(payload.items)&&payload.items.length<=180&&payload.items.every(x=>isDate(x.date)):payload.report&&isDate(payload.report.date)&&Array.isArray(payload.report.sections)&&Array.isArray(payload.report.flashes)&&(resource==='latest'||payload.report.date===resource));
    try{const saved=JSON.parse(storage?.getItem(key)||'null');retryAt=Number(saved?.retryAt)||0;for(const [resource,value]of saved?.entries||[]){if(endpointFor(resource)&&valid(value.payload,resource)&&now()-value.checkedAt<86400000)caches.set(resource,value);}for(const [resource,time]of saved?.gates||[])if(endpointFor(resource)&&time>now())gates.set(resource,time);}catch{}
    function trim(){for(const kind of ['index','report']){const keys=[...caches.keys()].filter(x=>kind==='index'?isIndex(x):!isIndex(x));while(keys.length>(kind==='index'?1:2))caches.delete(keys.shift());}}
    function persist(){trim();try{storage?.setItem(key,JSON.stringify({entries:[...caches],gates:[...gates],retryAt}));}catch{}}
    function snapshot(resource,state='ready',message=''){const cache=caches.get(resource);return {state,message,resource,report:cache?.payload?.report||null,items:cache?.payload?.items||[],notice:cache?.payload?.notice||null,checkedAt:cache?.checkedAt||null,nextAt:Math.max(retryAt,gates.get(resource)||0,cache?cache.checkedAt+Math.max(60000,cache.ttl):0)};}
    function seconds(headers){const raw=headers.get('Cache-Control')||'';const m=raw.match(/(?:^|,)\s*max-age=(\d+)/i);return Math.min(86400,Math.max(0,m?Number(m[1]):60));}
    function retryDelay(headers){const raw=headers.get('Retry-After');if(!raw)return 60000;const delay=/^\d+$/.test(raw)?Number(raw)*1000:Date.parse(raw)-now();return Math.max(60000,Number.isFinite(delay)?delay:60000);}
    async function request(resource){
      const endpoint=endpointFor(resource);if(!endpoint)return snapshot(resource,'error','日期格式不正确，请从往期列表选择。');
      let cache=caches.get(resource);if(cache&&now()-cache.checkedAt>=86400000){caches.delete(resource);cache=null;}
      if(now()<Math.max(retryAt,gates.get(resource)||0))return snapshot(resource,cache?'stale':'error','请稍后再刷新。');
      if(cache&&now()<cache.checkedAt+cache.ttl)return snapshot(resource);
      if(cache&&now()<cache.checkedAt+60000)return snapshot(resource,'stale','请稍后再刷新。');
      const control=new AbortController(),timer=setTimeout(()=>control.abort(),timeoutMs);
      try{const headers={Accept:'application/json'};if(cache?.etag)headers['If-None-Match']=cache.etag;
        const response=await fetcher(endpoint,{method:'GET',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers,signal:control.signal});
        if(response.status===304&&cache){cache.checkedAt=now();cache.ttl=seconds(response.headers)*1000;gates.delete(resource);persist();return snapshot(resource);}
        if(response.status===429||response.status===503){retryAt=now()+retryDelay(response.headers);persist();return snapshot(resource,cache?'stale':'error',response.status===429?'访问较多，请稍后再试。':'日报服务暂时繁忙，请稍后再试。');}
        if([403,404,410].includes(response.status)){caches.delete(resource);gates.set(resource,now()+60000);persist();return snapshot(resource,'error',response.status===404?'这个日期暂无可用日报，请选择其他日期。':'这期日报暂时无法读取，请选择其他日期。');}
        if(!response.ok)throw Error('HTTP '+response.status);
        const payload=await response.json();if(!valid(payload,resource))throw Error('Unexpected daily format');
        caches.delete(resource);caches.set(resource,{payload,etag:response.headers.get('ETag')||'',checkedAt:now(),ttl:seconds(response.headers)*1000});gates.delete(resource);persist();return snapshot(resource);
      }catch(error){gates.set(resource,now()+60000);persist();return snapshot(resource,cache?'stale':'error',error.name==='AbortError'?'读取日报超时，请稍后再试。':'暂时无法连接日报来源。');}
      finally{clearTimeout(timer);}
    }
    return {load(resource='latest'){if(!inflight.has(resource))inflight.set(resource,request(resource).finally(()=>inflight.delete(resource)));return inflight.get(resource);},peek(resource='latest'){return snapshot(resource,caches.has(resource)?'ready':'idle');},endpoint:base+'/latest',isDate};
  }

  let dailyStorage=null;try{dailyStorage=window.localStorage;}catch{}
  const dailyClient=createDailyClient({fetch:window.fetch.bind(window),storage:dailyStorage});
  let dailyState=null,dailyIndexState=null,dailyIndexLimit=60,dailySelectedDate='',dailyCategory='全部',dailyBusy=false,dailyTimer=null,dailyLoadId=0;
  function dailyUrl(value){try{const url=new URL(String(value));return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}}
  function dailyLink(url,label,cls='text-link'){const safe=dailyUrl(url);return safe?`<a class="${cls}" href="${e(safe)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`:'';}
  function dailyText(text,max=150){const s=String(text||'');return s.length>max?s.slice(0,max)+'…':s;}
  function dailyDate(value,clock=false){try{return new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric',...(clock?{hour:'2-digit',minute:'2-digit'}:{weekday:'long'})}).format(new Date(clock?value:value+'T00:00:00+08:00'));}catch{return String(value||'');}}
  function dailyToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
  function dailyResource(){return dailySelectedDate||'latest';}
  function dailyPage(){return `<div class="daily-layout"><aside class="daily-archive" aria-label="往期日报"><div class="daily-archive-head"><div><span class="eyebrow">DAILY ARCHIVE</span><h2>往期日报</h2></div><a href="#daily" class="daily-latest">最新一期 ↗</a></div><form id="daily-date-form"><label for="daily-date-input">按日期阅读</label><div><input id="daily-date-input" type="date" max="${dailyToday()}" required aria-label="选择日报日期"><button type="submit">前往</button></div></form><nav id="daily-archive-list" aria-label="日报日期"><p class="daily-archive-message">正在读取日期…</p></nav></aside><section class="daily-reader daily-paper" aria-label="AI 日报阅读区"><div class="daily-toolbar"><span>每日资讯 · 摘要选读</span><div class="daily-toolbar-actions"><span id="daily-refresh-hint"></span><button id="daily-refresh" class="button">${window.PORTFOLIO_PREVIEW?'读取日报':'刷新日报'} ↻</button></div></div><p class="daily-status" id="daily-status" role="status" aria-live="polite"></p><div id="daily-content" aria-busy="true"><h1 class="daily-loading-title">AI 日报</h1><div class="daily-loading"><span></span><span></span><span></span><p>正在读取日报…</p></div></div></section></div>`;}
  function dailyEntries(report){return report.sections.slice(0,30).flatMap(section=>(Array.isArray(section.items)?section.items:[]).slice(0,100).map(item=>({...item,category:String(section.label||'其他')})));}
  function paintDailyArchive(){const list=document.getElementById('daily-archive-list');if(!list)return;const items=dailyIndexState?.items||[];const selected=dailySelectedDate||dailyState?.report?.date||'';const input=document.getElementById('daily-date-input');if(input&&document.activeElement!==input)input.value=dailyClient.isDate(selected)?selected:'';
    if(!items.length){list.innerHTML=`<p class="daily-archive-message">${e(dailyIndexState?.message||(window.PORTFOLIO_PREVIEW?'点击读取日报后加载往期日期。':'正在读取日期…'))}</p>`;return;}
    const months=new Map();items.forEach(item=>{const month=item.date.slice(0,7);if(!months.has(month))months.set(month,[]);months.get(month).push(item);});
    list.innerHTML=[...months].map(([month,dates],i)=>`<details class="daily-month" ${selected?selected.startsWith(month)?'open':'':i===0?'open':''}><summary><span>${e(month.replace('-',' 年 '))} 月</span><small>${dates.length}</small></summary>${dates.map(item=>{const weekday=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',weekday:'short'}).format(new Date(item.date+'T00:00:00+08:00'));return `<a href="#daily/${item.date}" ${item.date===selected?'aria-current="date"':''}><span class="daily-date-number">${item.date.slice(-2)}<small>${e(weekday)}</small></span><span class="daily-date-title">${e(item.leadTitle||'AI 日报 · '+item.date)}</span></a>`;}).join('')}</details>`).join('')+(dailyIndexLimit<180&&items.length>=dailyIndexLimit?'<button class="daily-more-dates" id="daily-more-dates">加载更多日期 ↓</button>':'<p class="daily-archive-note">更早日期也可用上方日历直接选择。</p>');
    document.getElementById('daily-more-dates')?.addEventListener('click',()=>{dailyIndexLimit=180;loadDailyIndex();});
    if(dailyIndexState.state==='stale')list.insertAdjacentHTML('beforeend','<p class="daily-archive-message">日期列表暂未更新。</p>');
  }
  function dailyRow(item){return `<article class="daily-news-row"><div class="daily-news-source">${e(item.source?.name||'来源见原文')}</div><h3>${e(item.title)}</h3>${item.summary?`<p>${e(dailyText(item.summary,150))}</p>`:''}<div class="daily-item-links">${dailyLink(item.links?.original,'原文')}</div></article>`;}
  function dailyPaging(report){const items=dailyIndexState?.items||[],i=items.findIndex(x=>x.date===report.date),older=i>=0?items[i+1]:null,newer=i>0?items[i-1]:null;return `<nav class="daily-paging" aria-label="前后期日报">${older?`<a href="#daily/${older.date}"><small>← 前一期 · ${e(older.date)}</small><span>${e(dailyText(older.leadTitle||'AI 日报',45))}</span></a>`:'<span></span>'}${newer?`<a href="#daily/${newer.date}"><small>后一期 · ${e(newer.date)} →</small><span>${e(dailyText(newer.leadTitle||'AI 日报',45))}</span></a>`:'<span></span>'}</nav>`;}
  function paintDaily(){const content=document.getElementById('daily-content');if(!content)return;const report=dailyState?.report,status=document.getElementById('daily-status');content.setAttribute('aria-busy',String(dailyBusy));
    status.classList.toggle('is-stale',dailyState?.state==='stale');
    if(!report){status.textContent=dailyState?.message||'';content.innerHTML=`<div class="daily-empty"><span class="eyebrow">DAILY READER</span><h1>${window.PORTFOLIO_PREVIEW&&dailyState?.state==='idle'?'AI 日报按需读取。':'这期暂时没有读到日报。'}</h1><p>${window.PORTFOLIO_PREVIEW&&dailyState?.state==='idle'?'点击上方「读取日报」加载内容与往期日期。':'可从左侧选择其他日期，或稍后重试。'}</p></div>`;updateDailyButton();paintDailyArchive();return;}
    const rows=dailyEntries(report),categories=['全部',...new Set(rows.map(x=>x.category))];if(!categories.includes(dailyCategory))dailyCategory='全部';const canonical=dailyUrl(report.attribution?.url)||dailyUrl(report.links?.aihot)||'https://aihot.news/daily';
    status.textContent=dailyState.state==='stale'?dailyState.message+' 当前显示上次成功读取的内容。':`已读取 · ${dailyDate(dailyState.checkedAt,true)}`;
    content.innerHTML=`<header class="daily-paper-head"><div class="daily-paper-dateline"><span>${e(dailyDate(report.date))}</span><span>北京时间 08:00 出刊</span></div><div class="daily-paper-brand"><div><h1><span>AI</span> 日报</h1><p>人工智能 · 每日要闻</p></div><div class="daily-day-ticket"><strong>${report.date.slice(-2)}</strong><span>${e(report.date.slice(0,7).replace('-',' 年 '))} 月</span></div></div><div class="daily-paper-stats"><span><strong>${Math.min(8,rows.length)}</strong> 条分类选读</span><span><strong>${categories.length-1}</strong> 类主题</span><span><strong>${Math.min(4,report.flashes.length)}</strong> 则快讯</span></div></header>${report.lead?`<section class="daily-lead"><div class="daily-section-label"><span>头条</span><span>01</span></div><h2>${e(report.lead.title)}</h2><p>${e(dailyText(report.lead.leadParagraph,170))}</p></section>`:''}${rows.length?`<div class="daily-section-label"><span>本期栏目</span></div><div class="daily-filters" role="group" aria-label="日报分类">${categories.map(c=>`<button data-daily-category="${e(c)}" aria-pressed="${c===dailyCategory}">${e(c)}</button>`).join('')}</div><div id="daily-results"></div><p class="daily-selection-note" id="daily-more"></p>`:'<p class="daily-quiet">本期暂无分类条目。</p>'}${report.flashes.length?`<section class="daily-flashes"><div class="daily-section-label"><span>快讯选读</span></div>${report.flashes.slice(0,4).map(item=>`<article><h3>${e(item.title)}</h3><div><span>${e(item.source?.name||'')}</span>${dailyLink(item.links?.original,'原文')}</div></article>`).join('')}</section>`:''}<div id="daily-paging">${dailyPaging(report)}</div><p class="daily-credit">内容来源：${dailyLink(canonical,report.attribution?.name||'AIHOT')}<span>摘要选读</span></p>`;
    function filtered(){const selected=rows.filter(x=>dailyCategory==='全部'||x.category===dailyCategory),visible=selected.slice(0,8),groups=new Map();visible.forEach(item=>{if(!groups.has(item.category))groups.set(item.category,[]);groups.get(item.category).push(item);});document.getElementById('daily-results').innerHTML=[...groups].map(([category,items],i)=>`<section class="daily-paper-section"><div class="daily-section-label"><h2>${e(category)}</h2><span>${String(i+2).padStart(2,'0')}</span></div>${items.map(dailyRow).join('')}</section>`).join('');document.getElementById('daily-more').textContent=selected.length>8?'当前栏目展示 8 条摘要选读。':'';document.querySelectorAll('[data-daily-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dailyCategory===dailyCategory)));}
    if(rows.length){document.querySelectorAll('[data-daily-category]').forEach(b=>b.addEventListener('click',()=>{dailyCategory=b.dataset.dailyCategory;filtered();}));filtered();}updateDailyButton();paintDailyArchive();
  }
  function updateDailyButton(){const button=document.getElementById('daily-refresh');if(!button){clearTimeout(dailyTimer);return;}const wait=Math.max(0,(dailyState?.nextAt||0)-Date.now());button.disabled=dailyBusy||wait>0;button.textContent=dailyBusy?'正在读取…':'刷新日报 ↻';document.getElementById('daily-refresh-hint').textContent=wait>0?`${Math.ceil(wait/1000)} 秒后可刷新`:'';clearTimeout(dailyTimer);if(wait>0)dailyTimer=setTimeout(updateDailyButton,Math.min(1000,wait+10));}
  async function loadDaily(){const resource=dailyResource(),id=++dailyLoadId;dailyBusy=true;updateDailyButton();document.getElementById('daily-content')?.setAttribute('aria-busy','true');const result=await dailyClient.load(resource);if(id!==dailyLoadId||resource!==dailyResource())return;dailyState=result;dailyBusy=false;paintDaily();}
  async function loadDailyIndex(){const limit=dailyIndexLimit;const state=await dailyClient.load('index:'+limit);if(limit!==dailyIndexLimit)return;dailyIndexState=state;paintDailyArchive();const paging=document.getElementById('daily-paging');if(paging&&dailyState?.report)paging.innerHTML=dailyPaging(dailyState.report);}
  function bindDaily(date=''){dailySelectedDate=date;dailyCategory='全部';dailyState=dailyClient.peek(dailyResource());paintDailyArchive();document.getElementById('daily-refresh').addEventListener('click',()=>{loadDaily();loadDailyIndex();});document.getElementById('daily-date-form').addEventListener('submit',event=>{event.preventDefault();const value=document.getElementById('daily-date-input').value;if(dailyClient.isDate(value))location.hash='daily/'+value;});if(window.PORTFOLIO_PREVIEW){paintDaily();if(dailyState.state==='idle')document.getElementById('daily-refresh').textContent='读取日报 ↻';}else{if(dailyState.report)paintDaily();loadDaily();loadDailyIndex();}}

  function render() {
    let route='home';try{route=decodeURIComponent(location.hash.slice(1)||'home')}catch{}
    // About section anchors remain part of the about view and support direct links.
    const dailyRoute=route==='daily'||route.startsWith('daily/');
    const anchor = ['experience','education','skills'].includes(route) ? route : null;
    let active = anchor?'about':route;
    let html;
    const p = route.startsWith('case/') && data.projects.find(x=>x.id===route.split('/')[1]);
    const post=route.startsWith('post/')&&publishedPosts().find(x=>x.id===route.split('/')[1]);
    if(post){html=postPage(post);active='blog';document.title=`${post.title} · 邵建钧`;}
    else if(dailyRoute){html=dailyPage();active='daily';document.title='AI 日报 · 邵建钧';}
    else if(route==='blog'){html=blogList();active='blog';document.title='博文 · 邵建钧';}
    else if(route.startsWith('post/')){html='<section class="page-intro"><h1>这篇文章暂时无法查看。</h1><p>它可能尚未发布，或已移除。</p><a class="text-link" href="#blog">返回博文 →</a></section>';active='blog';document.title='博文 · 邵建钧';}
    else if(p){html=casePage(p);active=p.type;document.title=`${p.name} · 邵建钧`;}
    else if(active==='about'){html=about();document.title='关于 · 邵建钧';}
    else if(['work','research'].includes(active)){html=listing(active);document.title=`${active==='work'?'项目':'论文'} · 邵建钧`;}
    else{html=home();active='home';document.title='邵建钧 · Research & Engineering';}
    main.classList.toggle('daily-mode',dailyRoute);
    main.innerHTML=html;
    if(route==='blog')bindBlog();
    if(dailyRoute)bindDaily(route==='daily'?'':route.slice(6));
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
