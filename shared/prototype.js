(() => {
  const root=document.documentElement;
  const stateBtn=document.querySelector('[data-action="state"]');
  const copyBtn=document.querySelector('[data-action="copy"]');
  const statePanel=document.getElementById('state-panel');
  const mainSections=[...document.querySelectorAll('.sleep-hero,.section-block,.metrics-grid,.insight')];
  const copy=document.getElementById('insight-copy');
  let state=0, longCopy=false;

  // Synthetic design sample. Consistency: in-bed 444 = asleep 402 + awake 42 minutes.
  const stageSegments = [["light",25],["deep",25],["light",22],["rem",17],["light",31],["awake",10],["light",24],["deep",18],["light",25],["rem",22],["light",23],["deep",20],["light",28],["awake",12],["light",32],["rem",21],["light",35],["deep",18],["awake",20],["rem",16]];
  const stageLabels = {deep:'深い睡眠',light:'浅い睡眠',rem:'REM睡眠',awake:'覚醒'};
  const stageTotals = {deep:81,light:245,rem:76,awake:42};
  const stagePositions = {awake:12,rem:40,light:68,deep:96};
  const inBedMinutes = 444;
  const clock = minutes => {
    const m = (23*60 + 48 + minutes) % (24*60);
    return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  };
  const formatted = minutes => minutes >= 60 ? Math.floor(minutes/60)+'時間'+String(minutes%60).padStart(2,'0')+'分' : minutes+'分';
  const drawTimeline = id => {
    const container=document.getElementById('timeline-'+id);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 600 116');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label','23時48分から7時12分までの睡眠段階の推移');
    const el=(tag,attrs)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
    [12,40,68,96].forEach(y=>svg.appendChild(el('line',{x1:0,x2:600,y1:y+8,y2:y+8,class:'stage-grid'})));
    let elapsed=0,previous=null;
    const selected=document.getElementById('timeline-'+id+'-selected');
    for(const [type,minutes] of stageSegments){
      const x=elapsed/inBedMinutes*600;
      const w=minutes/inBedMinutes*600;
      const y=stagePositions[type];
      if(previous!==null && previous!==type)svg.appendChild(el('line',{x1:x,x2:x,y1:stagePositions[previous]+8,y2:y+8,class:'stage-transition'}));
      const bar=el('rect',{x:x+0.5,y,width:Math.max(2,w-1),height:16,rx:3,class:'stage-segment stage-'+type,tabindex:0,role:'button'});
      const msg=clock(elapsed)+'〜'+clock(elapsed+minutes)+' '+stageLabels[type]+'（'+formatted(minutes)+'）';
      bar.setAttribute('aria-label',msg);
      bar.addEventListener('click',()=>{selected.textContent=msg;});
      bar.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selected.textContent=msg;}});
      svg.appendChild(bar);previous=type;elapsed+=minutes;
    }
    container.appendChild(svg);
  };
  drawTimeline('a');drawTimeline('c');
  const dist=document.getElementById('distribution-bar');
  const list=document.getElementById('stage-totals');
  for(const type of ['deep','light','rem','awake']){
    const block=document.createElement('span');block.className='stage-'+type;
    block.style.width=(stageTotals[type]/inBedMinutes*100)+'%';
    block.title=stageLabels[type]+' '+formatted(stageTotals[type]);dist.appendChild(block);
    const row=document.createElement('div');row.className='stage-total';
    const swatch=document.createElement('i');swatch.className='swatch stage-'+type;
    const name=document.createElement('span');name.className='stage-total-name';name.textContent=stageLabels[type];
    const amount=document.createElement('span');amount.className='stage-total-time';amount.textContent=formatted(stageTotals[type])+' ';
    const ratio=document.createElement('small');ratio.textContent='('+Math.round(stageTotals[type]/inBedMinutes*100)+'%)';
    amount.appendChild(ratio);row.append(swatch,name,amount);list.appendChild(row);
  }
  const comparisons=[
    ['睡眠時間','6時間42分','仮の個人範囲内：6時間30分〜7時間30分',false],
    ['深い睡眠','1時間21分','仮の範囲内：1時間05分〜1時間45分',false],
    ['REM','1時間16分','仮の範囲内：1時間05分〜1時間40分',false],
    ['覚醒','42分','仮の範囲より長め：15〜35分',true]
  ];
  const comparisonRoot=document.getElementById('comparison-list');
  for(const [name,value,message,over] of comparisons){
    const row=document.createElement('div');row.className='comparison-row';
    const title=document.createElement('span');title.textContent=name;
    const amount=document.createElement('strong');amount.textContent=value;
    const status=document.createElement('span');status.textContent=message;
    if(over)status.className='over';
    row.append(title,amount,status);comparisonRoot.appendChild(row);
  }
  document.querySelectorAll('[data-graph-variant]').forEach(button=>{
    button.addEventListener('click',()=>{
      for(const other of document.querySelectorAll('[data-graph-variant]'))other.setAttribute('aria-pressed',String(other===button));
      for(const type of ['a','b','c'])document.getElementById('graph-'+type).hidden=type!==button.dataset.graphVariant;
      requestAnimationFrame(checkOverflow);
    });
  });


  document.querySelector('[data-action="theme"]').addEventListener('click',()=>{
    root.dataset.theme=root.dataset.theme==='night'?'day':'night';
    requestAnimationFrame(checkOverflow);
  });

  stateBtn.addEventListener('click',()=>{
    state=(state+1)%4;
    const labels=['Normal','Missing','Loading','Unsupported'];
    stateBtn.textContent=labels[state];
    const messages=[
      ['', ''],
      ['データなし','昨夜の睡眠データは見つかりませんでした。0時間としては扱いません。'],
      ['読み込み中','保存済みデータがないため、睡眠データを取得しています。'],
      ['現在取得できません','この指標は現在取得できません。対応状況を確認してください。']
    ];
    const normal=state===0;
    mainSections.forEach(el=>el.hidden=!normal);
    statePanel.hidden=normal;
    if(!normal){
      document.getElementById('state-title').textContent=messages[state][0];
      document.getElementById('state-message').textContent=messages[state][1];
    }
    requestAnimationFrame(checkOverflow);
  });

  copyBtn.addEventListener('click',()=>{
    longCopy=!longCopy;
    copyBtn.textContent=longCopy?'Standard copy':'Long copy';
    copy.textContent=longCopy
      ? '昨夜は途中で目が覚める時間が少しあり、睡眠時間も最近のあなたより短めでした。ただし一晩だけで良し悪しは決めず、今日の体調や数日間の流れも一緒に見ていきましょう。'
      : 'いつもより少し短めの睡眠でした。今日は無理を決めつけず、体調も一緒に見てみましょう。';
    requestAnimationFrame(checkOverflow);
  });

  function checkOverflow(){
    let count=0;
    document.querySelectorAll('[data-fit-probe]').forEach(el=>{
      delete el.dataset.overflow;
      if(el.closest('[hidden]')) return;
      const rect=el.getBoundingClientRect();
      const childOverflow=[...el.children].some(child=>{
        const r=child.getBoundingClientRect();
        return r.left < rect.left-3 || r.right > rect.right+3;
      });
      // Only horizontal overflow is meaningful for this typography probe.
      // Inline baseline ascenders / descenders are not a clipped-layout error.
      const bad=childOverflow || el.scrollWidth-el.clientWidth>4;
      el.dataset.overflow=bad?'true':'false';
      if(bad) count++;
    });
    const copy=document.querySelector('[data-hero-safe-probe]');
    const hero=document.querySelector('.sleep-hero');
    if(copy && hero && !hero.hidden){
      const a=copy.getBoundingClientRect(), b=hero.getBoundingClientRect();
      const unsafe=a.left<b.left+14 || a.right>b.right-14 || a.top<b.top+12 || a.bottom>b.bottom-12;
      if(unsafe) count++;
    }
    const art=document.querySelector(root.dataset.theme==='night'?'.hero-art-night':'.hero-art-day');
    const artOk=!!(art && art.complete && art.naturalWidth>0);
    document.getElementById('art-readout').textContent='hero art: '+(artOk?'loaded':'loading / failed');
    if(art && art.complete && !artOk) count++;
    document.getElementById('overflow-readout').textContent='fit checks: '+(count?count+' issue'+(count>1?'s':''):'pass');
    document.getElementById('viewport-readout').textContent='viewport: '+window.innerWidth+'×'+window.innerHeight+' css px';
  }
  document.querySelectorAll('.hero-art').forEach(art=>{
    art.addEventListener('load',checkOverflow);
    art.addEventListener('error',checkOverflow);
  });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(checkOverflow);
  window.addEventListener('resize',checkOverflow);
  window.addEventListener('load',checkOverflow);
})();