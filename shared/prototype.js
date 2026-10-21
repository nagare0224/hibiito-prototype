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
  drawTimeline('a');

  const compareData={
    total:{label:'睡眠時間',current:'6時間42分',average:'7時間00分',range:'6時間30分〜7時間30分',status:'いつもの範囲内',summary:'最近30日平均より18分短いですが、いつもの範囲内です。',value:402,min:390,max:450},
    bedtime:{label:'就寝時刻',current:'23:48',average:'23:36',range:'23:10〜00:10',status:'いつもの範囲内',summary:'いつもの就寝時刻より12分遅めです。時刻は日付をまたいで比較しています。',value:1428,min:1390,max:1450},
    wakeup:{label:'起床時刻',current:'07:12',average:'07:04',range:'06:30〜07:30',status:'いつもの範囲内',summary:'最近30日平均より8分遅めの起床でした。',value:432,min:390,max:450},
    deep:{label:'深い睡眠',current:'1時間21分',average:'1時間15分',range:'1時間05分〜1時間45分',status:'いつもの範囲内',summary:'最近30日平均より6分長めで、いつもの範囲内です。',value:81,min:65,max:105},
    rem:{label:'REM睡眠',current:'1時間16分',average:'1時間24分',range:'1時間10分〜1時間35分',status:'いつもの範囲内',summary:'最近30日平均より8分短めですが、いつもの範囲内です。',value:76,min:70,max:95},
    awake:{label:'覚醒時間',current:'42分',average:'28分',range:'15〜35分',status:'いつもより長め',summary:'最近30日平均より14分長めです。一晩だけで良し悪しを決めず、数日間の流れを見てみましょう。',value:42,min:15,max:35}
  };
  const comparePresentation = {
    total: {averageValue:420, minLabel:'6:30', averageLabel:'7:00', maxLabel:'7:30', summary:'30日平均より18分短めです。'},
    bedtime: {averageValue:1416, minLabel:'23:10', averageLabel:'23:36', maxLabel:'00:10', summary:'30日平均より12分遅めです。'},
    wakeup: {averageValue:424, minLabel:'06:30', averageLabel:'07:04', maxLabel:'07:30', summary:'30日平均より8分遅めです。'},
    deep: {averageValue:75, minLabel:'1:05', averageLabel:'1:15', maxLabel:'1:45', summary:'30日平均より6分長めです。'},
    rem: {averageValue:84, minLabel:'1:10', averageLabel:'1:24', maxLabel:'1:35', summary:'30日平均より8分短めです。'},
    awake: {averageValue:28, minLabel:'15分', averageLabel:'28分', maxLabel:'35分', summary:'30日平均より14分長めです。'}
  };
  // Visual-only reference chart. The soft band represents min..max, not a
  // measured probability distribution; clock times may cross midnight.
  const chartX=(value,min,max)=>{
    const fraction=(value-min)/(max-min);
    return Math.min(94,Math.max(6,20+60*fraction));
  };

  const backdrop=document.getElementById('compare-backdrop');
  const sheet=document.getElementById('compare-sheet');
  const dragHandle=document.getElementById('compare-handle');
  let compareReturnFocus=null;
  let closeTimer=null;
  let closing=false;
  let drag=null;
  let suppressHandleClick=false;
  let suppressResetTimer=null;

  const finishClose=()=>{
    clearTimeout(closeTimer);
    closeTimer=null;
    backdrop.hidden=true;
    sheet.hidden=true;
    sheet.classList.remove('is-dragging','is-dismissing');
    backdrop.classList.remove('is-dragging');
    sheet.style.removeProperty('--sheet-offset');
    backdrop.style.opacity='';
    document.body.classList.remove('sheet-open');
    closing=false;
    drag=null;
    if(compareReturnFocus && document.contains(compareReturnFocus) && !compareReturnFocus.closest('[hidden]')){
      compareReturnFocus.focus();
    }else{
      stateBtn.focus();
    }
    compareReturnFocus=null;
  };

  const closeComparison=(immediate=false)=>{
    if(sheet.hidden || closing)return;
    if(immediate){finishClose();return;}
    closing=true;
    drag=null;
    sheet.classList.remove('is-dragging');
    backdrop.classList.remove('is-dragging');
    sheet.classList.add('is-dismissing');
    sheet.style.removeProperty('--sheet-offset');
    backdrop.style.opacity='0';
    const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    closeTimer=setTimeout(finishClose,reduceMotion?0:270);
  };

  const openComparison=(key,trigger)=>{
    const data=compareData[key];
    if(!data || state!==0 || closing)return;
    compareReturnFocus=trigger;
    document.getElementById('compare-title').textContent=data.label;
    document.getElementById('compare-current').textContent=data.current;
    document.getElementById('compare-average').textContent=data.average;
    document.getElementById('compare-range').textContent=data.range;
    document.getElementById('compare-status').textContent=data.status;
    const view=comparePresentation[key];
    document.getElementById('compare-summary').textContent=view.summary;
    document.getElementById('compare-min-short').textContent=view.minLabel;
    document.getElementById('compare-avg-short').textContent=view.averageLabel;
    document.getElementById('compare-max-short').textContent=view.maxLabel;
    document.getElementById('compare-marker').style.left=chartX(data.value,data.min,data.max)+'%';
    document.getElementById('compare-average-marker').style.left=chartX(view.averageValue,data.min,data.max)+'%';
    document.getElementById('compare-status').classList.toggle('is-outside',data.value<data.min || data.value>data.max);
    document.getElementById('compare-plot').setAttribute('aria-label',
      data.label+'：今回'+data.current+'。最近30日平均'+data.average+'。いつもの範囲'+data.range+'。');
    sheet.classList.remove('is-dragging','is-dismissing');
    backdrop.classList.remove('is-dragging');
    sheet.style.removeProperty('--sheet-offset');
    backdrop.style.opacity='';
    sheet.hidden=false;
    backdrop.hidden=false;
    document.body.classList.add('sheet-open');
    dragHandle.focus();
  };

  // Pointer Events keep the bottom sheet exactly under the finger, including
  // dragging back upward; only a down swipe above the threshold dismisses it.
  dragHandle.addEventListener('pointerdown',event=>{
    if(sheet.hidden || closing || drag || (event.pointerType==='mouse' && event.button!==0))return;
    drag={pointerId:event.pointerId,startY:event.clientY,startAt:performance.now(),delta:0};
    sheet.classList.add('is-dragging');
    backdrop.classList.add('is-dragging');
    dragHandle.setPointerCapture(event.pointerId);
  });
  dragHandle.addEventListener('pointermove',event=>{
    if(!drag || event.pointerId!==drag.pointerId || closing)return;
    const distance=Math.max(0,event.clientY-drag.startY);
    drag.delta=distance;
    sheet.style.setProperty('--sheet-offset',Math.min(distance,sheet.offsetHeight+20)+'px');
    backdrop.style.opacity=String(Math.max(0.15,1-distance/Math.max(200,sheet.offsetHeight)));
  });
  const finishDrag=(event,cancelled=false)=>{
    if(!drag || event.pointerId!==drag.pointerId)return;
    const duration=Math.max(1,performance.now()-drag.startAt);
    const distance=Math.max(0,event.clientY-drag.startY);
    const dismiss=!cancelled && (distance>=Math.min(120,sheet.offsetHeight*0.26) || (distance>=48 && distance/duration>=0.65));
    // Prevent a synthetic click immediately after pointerup from closing a snap-back.
    if(distance>=8){
      suppressHandleClick=true;
      clearTimeout(suppressResetTimer);
      suppressResetTimer=setTimeout(()=>{suppressHandleClick=false;},400);
    }
    drag=null;
    sheet.classList.remove('is-dragging');
    backdrop.classList.remove('is-dragging');
    if(dismiss)closeComparison();
    else{
      sheet.style.removeProperty('--sheet-offset');
      backdrop.style.opacity='';
    }
  };
  dragHandle.addEventListener('pointerup',event=>finishDrag(event));
  dragHandle.addEventListener('pointercancel',event=>finishDrag(event,true));
  dragHandle.addEventListener('lostpointercapture',event=>finishDrag(event,true));
  dragHandle.addEventListener('click',()=>{
    if(suppressHandleClick){suppressHandleClick=false;return;}
    closeComparison();
  });

  document.querySelectorAll('[data-compare]').forEach(el=>{
    el.addEventListener('click',()=>openComparison(el.dataset.compare,el));
  });
  backdrop.addEventListener('click',()=>closeComparison());
  document.addEventListener('keydown',event=>{
    if(sheet.hidden || closing)return;
    if(event.key==='Escape'){event.preventDefault();closeComparison();}
    if(event.key==='Tab'){
      // The grabber doubles as an accessible close control.
      if(!event.shiftKey){event.preventDefault();dragHandle.focus();}
      else{event.preventDefault();dragHandle.focus();}
    }
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
    if(!normal)closeComparison();
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