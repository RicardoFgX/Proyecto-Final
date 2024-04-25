

/* Please ❤ this if you like it! */


(function() {
	setTimeout(init, 0);
	function init() {
		document.body.classList.remove('loading');
		var element = document.getElementById('rev-1'),
			watcher = scrollMonitor.create(element, -(element.offsetHeight)),
			duration = 1000,
			rev1 = new RevealFx(element, {
				revealSettings: {
					direction: 'tb',
					bgcolor: '#07d89d',
					duration: duration/3,
					easing: 'easeInOutCirc',
					coverArea: 100,
					revealWidth: '6px',
					onCover: function (contentEl, revealerEl) {
						console.log('Element has being covered.');
						anime({
							targets: revealerEl,
							width: {
								value: contentEl.offsetWidth,
								duration: duration/3,
							},
							easing: 'easeInOutQuad',
							complete: function() {
								contentEl.style.opacity = 1;
								anime({
									targets: revealerEl,
									width: {
										value: 0,
										duration: duration/3
									},
									translateX:{
										value: contentEl.offsetWidth,
										duration: duration/3
									},
									easing: 'easeInOutQuad'
								});
							}
						});
					},
					onComplete: function(contentEl, revealerEl) {
						console.log('Element has being completed.');
					}
				}
			});
		watcher.enterViewport(function() {
			rev1.reveal();
			watcher.destroy();
		});
		/** ======================================================= */
		var element2 = document.getElementById('rev-2'),
			watcher2 = scrollMonitor.create(element2, -(element2.offsetHeight)),
			duration2 = 1000,
			rev2 = new RevealFx(element2, {
				revealSettings: {
					direction: 'tb',
					bgcolor: '#f8ae2c',
					duration: duration2/3,
					easing: 'easeInOutCirc',
					coverArea: 100,
					revealWidth: '6px',
					onCover: function (contentEl, revealerEl) {
						console.log('Element has being covered.');
						anime({
							targets: revealerEl,
							width: {
								value: contentEl.offsetWidth,
								duration: duration2/3,
							},
							easing: 'easeInOutQuad',
							complete: function() {
								contentEl.style.opacity = 1;
								anime({
									targets: revealerEl,
									width: {
										value: 0,
										duration: duration2/3
									},
									translateX:{
										value: contentEl.offsetWidth,
										duration: duration2/3
									},
									easing: 'easeInOutQuad'
								});
							}
						});
					},
					onComplete: function(contentEl, revealerEl) {
						console.log('Element has being completed.');
					}
				}
			});
		watcher2.enterViewport(function() {
			rev2.reveal();
			watcher2.destroy();
		});
		/** ======================================================= */
		var element3 = document.getElementById('rev-3'),
			watcher3 = scrollMonitor.create(element3, -(element3.offsetHeight)),
			duration3 = 1000,
			rev3 = new RevealFx(element3, {
				revealSettings: {
					direction: 'tb',
					bgcolor: '#3a3d98',
					duration: duration3/3,
					easing: 'easeInOutCirc',
					coverArea: 100,
					revealWidth: '6px',
					onCover: function (contentEl, revealerEl) {
						console.log('Element has being covered.');
						anime({
							targets: revealerEl,
							width: {
								value: contentEl.offsetWidth,
								duration: duration3/3,
							},
							easing: 'easeInOutQuad',
							complete: function() {
								contentEl.style.opacity = 1;
								anime({
									targets: revealerEl,
									width: {
										value: 0,
										duration: duration3/3
									},
									translateX:{
										value: contentEl.offsetWidth,
										duration: duration3/3
									},
									easing: 'easeInOutQuad'
								});
							}
						});
					},
					onComplete: function(contentEl, revealerEl) {
						console.log('Element has being completed.');
					}
				}
			});
		watcher3.enterViewport(function() {
			rev3.reveal();
			watcher3.destroy();
		});
		/** ======================================================= */
		var element4 = document.getElementById('rev-4'),
			watcher4 = scrollMonitor.create(element4, -(element4.offsetHeight)),
			duration4 = 1000,
			rev4 = new RevealFx(element4, {
				revealSettings: {
					direction: 'tb',
					bgcolor: '#f19872',
					duration: duration4/3,
					easing: 'easeInOutCirc',
					coverArea: 100,
					revealWidth: '6px',
					onCover: function (contentEl, revealerEl) {
						console.log('Element has being covered.');
						anime({
							targets: revealerEl,
							width: {
								value: contentEl.offsetWidth,
								duration: duration4/3,
							},
							easing: 'easeInOutQuad',
							complete: function() {
								contentEl.style.opacity = 1;
								anime({
									targets: revealerEl,
									width: {
										value: 0,
										duration: duration4/3
									},
									translateX:{
										value: contentEl.offsetWidth,
										duration: duration4/3
									},
									easing: 'easeInOutQuad'
								});
							}
						});
					},
					onComplete: function(contentEl, revealerEl) {
						console.log('Element has being completed.');
					}
				}
			});
		watcher4.enterViewport(function() {
			rev4.reveal();
			watcher4.destroy();
		});
	}
})();




!function(e){"use strict";function t(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);return e}function i(e,t,i){var n=document.createElement(e);return n.className=t||"",n.innerHTML=i||"",n}function n(e,i){this.originalEl,this.el=e,this.options=t({},this.options),t(this.options,i),this._init()}n.prototype.options={isContentHidden:!0,revealSettings:{direction:"lr",bgcolor:"#f0f0f0",duration:500,easing:"easeInOutQuint",coverArea:0,revealWidth:"100%",onCover:function(e,t){return!1},onStart:function(e,t){return!1},onComplete:function(e,t){return!1}}},n.prototype._init=function(){this._layout()},n.prototype._layout=function(){var e=getComputedStyle(this.el).position;"fixed"!==e&&"absolute"!==e&&"relative"!==e&&(this.el.style.position="relative"),this.content=i("div","block-revealer__content",this.el.innerHTML),this.options.isContentHidden&&(this.content.style.opacity=0),this.revealer=i("div","block-revealer__element"),this.revealer.style.width=this.options.revealSettings.revealWidth,this.originalEl=this.el.cloneNode(!0),this.el.classList.add("block-revealer"),this.el.innerHTML="",this.el.appendChild(this.content),this.el.appendChild(this.revealer)},n.prototype._getTransformSettings=function(e){var t,i,n;switch(e){case"lr":t="scale3d(0,1,1)",i="0 50%",n="100% 50%";break;case"rl":t="scale3d(0,1,1)",i="100% 50%",n="0 50%";break;case"tb":t="scale3d(1,0,1)",i="50% 0",n="50% 100%";break;case"bt":t="scale3d(1,0,1)",i="50% 100%",n="50% 0";break;default:t="scale3d(0,1,1)",i="0 50%",n="100% 50%"}return{val:t,origin:{initial:i,halfway:n}}},n.prototype.reveal=function(e){if(this.isAnimating)return!1;this.isAnimating=!0;var t=500,i="easeInOutQuint",n=0,r="#f0f0f0",o="lr",a=0,s=(e=e||this.options.revealSettings).direction||o,l=this._getTransformSettings(s);this.revealer.style.WebkitTransform=this.revealer.style.transform=l.val,this.revealer.style.WebkitTransformOrigin=this.revealer.style.transformOrigin=l.origin.initial,this.revealer.style.backgroundColor=e.bgcolor||r,this.revealer.style.opacity=1;var c=this,h={complete:function(){c.isAnimating=!1,"function"==typeof e.onComplete&&e.onComplete(c.content,c.revealer)}},v={delay:e.delay||n,complete:function(){c.revealer.style.WebkitTransformOrigin=c.revealer.style.transformOrigin=l.origin.halfway,"function"==typeof e.onCover&&e.onCover(c.content,c.revealer),anime(h)}};v.targets=h.targets=this.revealer,v.duration=h.duration=e.duration||t,v.easing=h.easing=e.easing||i;var f=e.coverArea||a;"lr"===s||"rl"===s?(v.scaleX=[0,1],h.scaleX=[1,f/100]):(v.scaleY=[0,1],h.scaleY=[1,f/100]),"function"==typeof e.onStart&&e.onStart(c.content,c.revealer),anime(v)},e.RevealFx=n}(window);






