/* Sleep v11 — mobile touch scrub fix; synthetic intervals only, no production Health. */
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
  // The mobile browser may take ownership of a pan-y Pointer Event stream.
  // A non-passive touchmove allows us to intercept a deliberate horizontal
  // stage scrub while leaving an ordinary vertical page scroll untouched.
  let touchGesture=null;
  let recentTouchEndAt=-Infinity;
  const takeTouch=(touches,id)=>Array.from(touches).find(t=>t.identifier===id);
  const startTouch=e=>{
    if(e.touches.length!==1||touchGesture||gesture)return;
    const t=e.changedTouches[0];
    if(!t)return;
    cancelHold();
    touchGesture={
      id:t.identifier,startX:t.clientX,startY:t.clientY,
      lastX:t.clientX,active:false,moved:false,vertical:false
    };
    holdTimer=setTimeout(()=>{
      const g=touchGesture;
      if(!g||g.id!==t.identifier||g.vertical||g.moved)return;
      g.active=true;
      setPreview(indexAtX(g.lastX));
    },300);
  };
  const moveTouch=e=>{
    const g=touchGesture;
    if(!g)return;
    const t=takeTouch(e.changedTouches,g.id);
    if(!t)return;
    g.lastX=t.clientX;
    const dx=t.clientX-g.startX,dy=t.clientY-g.startY;
    if(!g.active){
      // A horizontal gesture is scrubbing even when the hold timer has not
      // fired; this covers slight motion before the Android long-press fires.
      if(Math.abs(dx)>=9&&Math.abs(dx)>Math.abs(dy)*1.2){
        cancelHold();g.active=true;g.moved=true;
      }else if(Math.abs(dy)>=12&&Math.abs(dy)>Math.abs(dx)){
        cancelHold();g.moved=true;g.vertical=true;
        return; // Native vertical scrolling remains available.
      }
    }
    if(g.active){
      if(e.cancelable)e.preventDefault();
      const i=indexAtX(t.clientX);
      if(i!==preview)setPreview(i);
    }
  };
  const finishTouch=(e,cancelled)=>{
    const g=touchGesture;
    if(!g)return;
    const t=takeTouch(e.changedTouches,g.id);
    if(!t)return;
    const wasPreview=g.active;
    const wasMoved=g.moved||g.vertical;
    cancelHold();touchGesture=null;recentTouchEndAt=performance.now();
    if(wasPreview){
      preview=null;refresh(); // Restore the previous fixed selection, if any.
    }else if(!cancelled&&!wasMoved){
      setFixed(indexAtX(t.clientX));
    }
  };
  svg.addEventListener('touchstart',startTouch,{passive:true});
  svg.addEventListener('touchmove',moveTouch,{passive:false});
  svg.addEventListener('touchend',e=>finishTouch(e,false),{passive:true});
  svg.addEventListener('touchcancel',e=>finishTouch(e,true),{passive:true});
  svg.addEventListener('contextmenu',e=>e.preventDefault());

  // Mouse and pen keep Pointer Events; touch is handled above to avoid
  // touch-action:pan-y triggering pointercancel in the middle of a scrub.
  const onPointerDown=e=>{
    if(e.pointerType==='touch')return;
    if(e.pointerType==='mouse'&&(e.button!==0||performance.now()-recentTouchEndAt<800))return;
    if(gesture||touchGesture)return;
    gesture={id:e.pointerId,startX:e.clientX,startY:e.clientY,origin:e.target,active:false,moved:false};
    cancelHold();
    holdTimer=setTimeout(()=>{
      if(!gesture||gesture.id!==e.pointerId||gesture.moved)return;
      gesture.active=true;
      try{svg.setPointerCapture(e.pointerId)}catch(_){}
      setPreview(indexAtX(gesture.startX));
    },300);
  };
  svg.addEventListener('pointerdown',onPointerDown);
  svg.addEventListener('pointermove',e=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;
    if(!gesture.active){
      if(Math.abs(dx)>=9&&Math.abs(dx)>Math.abs(dy)*1.2){
        cancelHold();gesture.active=true;gesture.moved=true;
        try{svg.setPointerCapture(e.pointerId)}catch(_){}
      }else if(Math.abs(dy)>12){gesture.moved=true;cancelHold();return;}
    }
    if(gesture.active){
      const i=indexAtX(e.clientX);
      if(i!==preview)setPreview(i);
      e.preventDefault();
    }
  });
  const finishPointer=(e,cancelled)=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    const wasPreview=gesture.active,wasMoved=gesture.moved;
    cancelHold();gesture=null;
    if(wasPreview){preview=null;refresh();return;}
    if(!cancelled&&!wasMoved)setFixed(indexAtX(e.clientX));
  };
  svg.addEventListener('pointerup',e=>finishPointer(e,false));
  svg.addEventListener('pointercancel',e=>finishPointer(e,true));
  svg.addEventListener('lostpointercapture',e=>finishPointer(e,true));
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
