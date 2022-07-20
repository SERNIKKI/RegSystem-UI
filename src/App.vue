<template>
  <div id="app">
		<transition name="fade">
				<router-view/>
		</transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      
    }
  }
}
</script>

<style>
/* 重置标签样式的样式表 */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	font-family: -apple-system, 
							BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, "Apple Color Emoji", 
							"Segoe UI Emoji", "Segoe UI Symbol", "Liberation Sans", "PingFang SC", 
							"Microsoft YaHei", "Hiragino Sans GB", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", 
							"ST Heiti", SimHei, SimSun, "WenQuanYi Zen Hei Sharp", sans-serif;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
.fade-enter{
 visibility: hidden;
 opacity: 0;
}
.fade-leave-to{
 display: none;
}
.fade-enter-active,
.fade-leave-active{
 transition: opacity .2s ease;
}
.fade-enter-to,
.fade-leave{
 visibility: visible;
 opacity: 1;
}
.my-item {
	line-height: 1.78;
	font-size: 1rem;
	padding: 0.78571em 0.95em;
}
.line-text {
	line-height: 1.78;
	font-size: 1rem;
}
textarea {
	font-family: -apple-system, 
							BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, "Apple Color Emoji", 
							"Segoe UI Emoji", "Segoe UI Symbol", "Liberation Sans", "PingFang SC", 
							"Microsoft YaHei", "Hiragino Sans GB", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", 
							"ST Heiti", SimHei, SimSun, "WenQuanYi Zen Hei Sharp", sans-serif;
}
</style>
