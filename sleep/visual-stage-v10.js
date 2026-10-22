/* Sleep v10 — interactive prototype only; synthetic intervals, no production Health. */
(() => {
  const card=document.querySelector('.sleep-page .sleep-graph');
  const graph=document.querySelector('#timeline-a');
  const svg=graph?.querySelector('svg');
  const pop=document.getElementById('stage-popover-v10');
  if(!svg||!pop||!card)return;
  const bars=[...svg.querySelectorAll('rect.stage-segment')];
  const title=document.getElementById('stage-v10-name');
  const times=document.getElementById('stage-v10-times');
  const duration=document.getElementById('stage-v10-duration');
  const mode=document.getElementById('stage-v10-mode');
  const navigation=document.getElementById('stage-v10-nav');
  const navButtons=[...navigation.querySelectorAll('button[data-stage-nav]')];
  const labels={deep:'深い睡眠',light:'浅い睡眠',rem:'REM睡眠',awake:'覚醒'};
  const startMinute=23*60+48;
  const clock=t=>{
    const value=(startMinute+t)%(24*60);
    return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0');
  };
  const rows=bars.map((el,i)=>({
    el,index:i,type:el.dataset.stageType,start:Number(el.dataset.stageStart),minutes:Number(el.dataset.stageDuration)
  }));
  let fixed=null,preview=null,gesture=null,holdTimer=null;
  const cancelHold=()=>{clearTimeout(holdTimer);holdTimer=null;};
  const indexAtX=clientX=>{
    const box=svg.getBoundingClientRect();
    if(!box.width)return 0;
    const fraction=Math.max(0,Math.min(1,(clientX-box.left)/box.width));
    const total=rows.at(-1).start+rows.at(-1).minutes;
    const elapsed=Math.min(total-.0001,total*fraction);
    const found=rows.findIndex(row=>elapsed>=row.start&&elapsed<row.start+row.minutes);
    return found<0?rows.length-1:found;
  };
  const display=(index,kind)=>{
    if(index===null){
      pop.hidden=true;
      bars.forEach(bar=>{bar.classList.remove('stage-v10-fixed','stage-v10-preview');bar.setAttribute('aria-pressed','false');});
      return;
    }
    const data=rows[index];
    pop.hidden=false;
    pop.dataset.mode=kind;
    title.textContent=labels[data.type];
    times.textContent=clock(data.start)+'〜'+clock(data.start+data.minutes);
    duration.textContent=data.minutes+'分';
    mode.textContent=kind==='preview'?'確認中':'選択中';
    navigation.hidden=kind==='preview';
    bars.forEach((bar,i)=>{
      bar.classList.toggle('stage-v10-fixed',kind==='fixed'&&i===index);
      bar.classList.toggle('stage-v10-preview',kind==='preview'&&i===index);
      bar.setAttribute('aria-pressed',kind==='fixed'&&i===index?'true':'false');
    });
    // Place a compact callout near the selected stage; clamp horizontally.
    const cardRect=card.getBoundingClientRect();
    const rect=data.el.getBoundingClientRect();
    const width=pop.offsetWidth,height=pop.offsetHeight;
    const x=(rect.left+rect.right)/2-cardRect.left;
    const safeLeft=Math.max(8,Math.min(card.clientWidth-width-8,x-width/2));
    let y=rect.top-cardRect.top-height-10;
    if(y<8)y=rect.bottom-cardRect.top+9;
    pop.style.left=safeLeft+'px';
    pop.style.top=y+'px';
    navButtons[0].disabled=index===0;
    navButtons[1].disabled=index===rows.length-1;
  };
  const refresh=()=>display(preview!==null?preview:fixed,preview!==null?'preview':'fixed');
  const close=()=>{fixed=null;preview=null;refresh();};
  const setFixed=index=>{fixed=index;preview=null;refresh();};
  const setPreview=index=>{preview=index;refresh();};
  navButtons.forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    if(fixed===null)return;
    const to=Math.max(0,Math.min(rows.length-1,fixed+Number(btn.dataset.stageNav)));
    setFixed(to);
  }));
  const onPointerDown=e=>{
    if(e.button!==undefined&&e.pointerType==='mouse'&&e.button!==0)return;
    if(gesture)return;
    gesture={id:e.pointerId,startX:e.clientX,startY:e.clientY,origin:e.target,active:false,moved:false};
    cancelHold();
    holdTimer=setTimeout(()=>{
      if(!gesture||gesture.id!==e.pointerId||gesture.moved)return;
      gesture.active=true;
      try{svg.setPointerCapture(e.pointerId)}catch(_){}
      setPreview(indexAtX(gesture.startX));
    },330);
  };
  svg.addEventListener('pointerdown',onPointerDown);
  svg.addEventListener('pointermove',e=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;
    if(!gesture.active){
      if(Math.hypot(dx,dy)>12){gesture.moved=true;cancelHold();}
      return;
    }
    const index=indexAtX(e.clientX);
    if(index!==preview)setPreview(index);
    e.preventDefault();
  });
  const end=(e,cancelled)=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    const wasPreview=gesture.active,wasMoved=gesture.moved;
    cancelHold();gesture=null;
    if(wasPreview){preview=null;refresh();return;}
    if(!cancelled&&!wasMoved)setFixed(indexAtX(e.clientX));
  };
  svg.addEventListener('pointerup',e=>end(e,false));
  svg.addEventListener('pointercancel',e=>end(e,true));
  svg.addEventListener('lostpointercapture',e=>end(e,true));
  svg.addEventListener('keydown',e=>{
    const bar=e.target.closest('rect.stage-segment');
    if(!bar||!['Enter',' '].includes(e.key))return;
    e.preventDefault();
    setFixed(bars.indexOf(bar));
  });
  // Tap outside the stage chart or its popover dismisses fixed details.
  document.addEventListener('pointerdown',e=>{
    if(pop.hidden)return;
    if(!graph.contains(e.target)&&!pop.contains(e.target))close();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!pop.hidden){close();e.preventDefault();}
  });
  // When returning from error/empty states, never carry a stale selected interval.
  document.querySelector('[data-action="state"]')?.addEventListener('click',close);
  window.addEventListener('resize',()=>{
    if(!pop.hidden)refresh();
  });
})();
