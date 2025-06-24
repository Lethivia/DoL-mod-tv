/* Story JavaScript */
(function(){
  window.TextPlay = { paused: false, speedFactor: 1 };

  Macro.add('textplay', {
    isAsync: true,
    tags: null,           // 与内置 <<type>> 保持一致
    handler: async function() {
      // 重置状态
      TextPlay.paused = false;
      TextPlay.speedFactor = 1;
      TextPlay.autoScroll = true;


      // 1. 解析时间参数
      if (this.args.length < 4) {
        return this.error('需要 4 个时间参数：普通间隔、逗号停顿、句号停顿、换行停顿');
      }
      const [cd, ccd, pcd, nld] = this.args.map(arg => {
        if (arg.endsWith('ms')) return parseFloat(arg);
        if (arg.endsWith('s'))  return parseFloat(arg) * 1000;
        return parseFloat(arg);
      });

      // 2. 把宏体内容先 Wikify，再拿到它的 innerHTML
      const frag = document.createElement('div');
      new Wikifier(frag, this.payload[0].contents);
      // 此时 frag.innerHTML 中 <span>、<br> 都已被解析成 DOM
      // 用一个特殊标记把 <br> 占位成换行符，方便后面处理
      const html = frag.innerHTML.replace(/<br\s*\/?>/g, '\n');
      const len  = html.length;

      // 3. 准备输出容器
      const $out = $(this.output).empty();
      const $ctr = $('<span class="textplay-container"></span>')
                    .appendTo($out);

      // 4. 事件：pointerdown 控制快进/回退；在容器上 click 切换暂停
      const onPointerDown = e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        TextPlay.speedFactor = e.clientX > window.innerWidth/2 ? 5 : -2;
      };
      const onPointerUp   = () => { TextPlay.speedFactor = 1; };
      const onClick       = () => { TextPlay.paused = !TextPlay.paused; };

      // document.addEventListener('pointerdown', onPointerDown, {passive:true});
      // document.addEventListener('pointerup',   onPointerUp,   {passive:true});
      $ctr.on('click', onClick);

      // 监听用户滚动，手动滚动时关闭自动滚动
      const $autoscroll = $('#text-area');
      // const $autoscroll = $('#upper');
	  // const $autoscroll = $(this.output).closest('#text-area');  // 向上找最近的 text-area
      $autoscroll.on('scroll.textplay', function(){
        const el = this;
        if (el.scrollTop + el.clientHeight +5 < el.scrollHeight) {
          TextPlay.autoScroll = false;
        } else {
          TextPlay.autoScroll = true;
		}
      });

      // 5. 渲染循环，用 idx 正向／反向移动
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      let idx = 0;
      while (idx < len) {
        // 暂停
        while (TextPlay.paused) await sleep(50);

        // 回退
        if (TextPlay.speedFactor < 0) {
          if (idx === 0) {
			TextPlay.paused = false;
			TextPlay.speedFactor = 1;
			continue;
		  }
          $ctr.html($ctr.html().replace(/(<br\/?>|.$)$/, ''));
          idx--;
          await sleep(cd / Math.abs(TextPlay.speedFactor));
          continue;
        }

        // 正向添加
        const ch = html[idx];
        let delay = cd;
        if (ch === ',' || ch === '，')        delay = ccd;
        else if ('.。!?！？'.includes(ch))    delay = pcd;
        else if (ch === '\n')                 delay = nld;

        if (ch === '\n') {
          $ctr.append('<br>');
        } else {
          // 直接 append HTML 片段，以保留 <span> 等标签
          $ctr.append(ch);
        }

        if (TextPlay.autoScroll) {
            $autoscroll.scrollTop($autoscroll[0].scrollHeight);
        }

        idx++;
        await sleep(delay / TextPlay.speedFactor);
      }

      // 6. 卸载事件
      // document.removeEventListener('pointerdown', onPointerDown);
      // document.removeEventListener('pointerup',   onPointerUp);
      $ctr.off('click', onClick);
      $autoscroll.off('scroll.textplay');

      new Wikifier($('#text-area'), '<div id="avreplace"><<avShowNext>></div>');
      if (TextPlay.autoScroll) {
          $autoscroll.scrollTop($autoscroll[0].scrollHeight);
      }

    }
  });
})();


//------------------------------------------------------------------------
/* Story JavaScript */
(function() {
  if (State.variables.widgetList === undefined) {
    State.variables.widgetList = [];
  }

  // 存放定时器 ID
  setup._widgetIntervalId = null;

  // 每秒调用所有 widget，并更新进度条
  setup.startAVTimer = function() {
    // 如果已经在运行，则不重复启动
    if (setup._widgetIntervalId) return;
	const $up = $('#upper');
	$up.empty();
	new Wikifier($up[0], '<div id="text-area"></div>');
	new Wikifier($up[0], '<<avplay>>');
	const _func = function() {
      // widget 区域容器
      const $wa = $('#widget-area');
      // 如果希望每秒重渲染 UI，则先清空；否则注释掉下一行
      $wa.empty();
      // 依次调用 widget
	  if (State.variables.widgetList && State.variables.widgetList.length) {
        State.variables.widgetList.forEach(function(wname) {
          new Wikifier($wa[0], '<<' + wname + '>>');
      });}
	  else {
	    setup.stopAVTimer();
	  }
    }
	_func();
    setup._widgetIntervalId = setInterval(_func, 2000);
  };

  setup.stopAVTimer = function() {
    if (setup._widgetIntervalId) {
      clearInterval(setup._widgetIntervalId);
      setup._widgetIntervalId = null;
    }
  };

  setup.toggleAVTimer = function() {
    if (setup._widgetIntervalId) {
      setup.stopAVTimer();
    } else {
      setup.startAVTimer();
    }
  };
})();
