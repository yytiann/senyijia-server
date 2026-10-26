import{g as de,E as pe,q as me,s as fe,b as g,d as W,v as b,_ as x,j as t,V as l,w as he,H as ve,f as ge,x as R,i as be,S as xe,y as we,z as ye,e as Ee,A as _e,X as Ce,B as je,D as Fe,F as Te,G as h,J as c,K as Be,M as K,N as Q,r as A,O as Se,P as Pe,Q as ke,U as Ne,W as Ae,Y as De,Z,$ as v}from"./vendors.d82c36e3.js";import{c as O,P as Oe,B as F,C as He,a as Re,b as D,d as Le,e as Ie,t as U,T as ze}from"./common.6dd19889.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();var Ve=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 导航栏页面自动添加顶部间距 */
body.h5-navbar-visible .taro_page {
  padding-top: 44px;
}

body.h5-navbar-visible .toaster[data-position^="top"] {
  top: 44px !important;
}

/* Sheet 组件在 H5 导航栏下的位置修正 */
body.h5-navbar-visible .sheet-content:not([data-side="bottom"]) {
    top: 44px !important;
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* 全局按钮样式重置 */
taro-button-core,
button {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

taro-button-core::after,
button::after {
    border: none;
}

taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`,Me=`
/* PC 宽屏适配 - 基础布局 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }
}
`,We=`
/* PC 宽屏适配 - 手机框样式（有 TabBar 页面） */
@media (min-width: 769px) {
  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}

/* PC 宽屏适配 - Toast 定位到手机框范围内 */
@media (min-width: 769px) {
  body .toaster {
    left: 50% !important;
    right: auto !important;
    width: 375px !important;
    max-width: 375px !important;
    transform: translateX(-50%) !important;
    box-sizing: border-box !important;
  }
}

/* PC 宽屏适配 - 手机框样式（无 TabBar 页面，通过 JS 添加 no-tabbar 类） */
@media (min-width: 769px) {
  body.no-tabbar #app {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
    transform: translateX(0) !important;
  }

  body.no-tabbar #app .taro_router {
    height: 100% !important;
    overflow: auto !important;
  }
}
`;function Ue(){var s=document.createElement("style");s.innerHTML=Ve+Me+We,document.head.appendChild(s)}function $e(){var s=function(){var n=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!n)};s();var e=new MutationObserver(s);e.observe(document.body,{childList:!0,subtree:!0})}function Ye(){Ue(),$e()}function Xe(){var s=de();if(s===pe.WEAPP)try{var e=me(),r=e.miniProgram.envVersion;console.log("[Debug] envVersion:",r),r!=="release"&&fe({enableDebug:!0})}catch(n){console.error("[Debug] 开启调试模式失败:",n)}}var Ge={visible:!1,title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},qe=function(){var e,r=R();return(r==null||(e=r.config)===null||e===void 0?void 0:e.window)||{}},Je=function(){var e,r,n=(e=R())===null||e===void 0||(e=e.config)===null||e===void 0?void 0:e.tabBar;return new Set((n==null||(r=n.list)===null||r===void 0?void 0:r.map(function(o){return o.pagePath}))||[])},$=function(){var e,r=R();return(r==null||(e=r.config)===null||e===void 0||(e=e.pages)===null||e===void 0?void 0:e[0])||"pages/index/index"},B=function(e){return e.replace(/^\//,"")},Ke=function(e,r,n,o){if(!e)return"none";var a=B(e),i=B(o),f=a===i,u=r.has(a)||r.has("/".concat(a)),p=n>1;return u||f?"none":p?"back":"home"},Qe=function(){var e=g.useState(Ge),r=W(e,2),n=r[0],o=r[1],a=g.useState(0),i=W(a,2),f=i[0],u=i[1],p=g.useCallback(function(){var d=b.getCurrentPages();if(d.length===0){o(function(ce){return x(x({},ce),{},{visible:!1})});return}var m=d[d.length-1],z=(m==null?void 0:m.route)||"";if(z){var w=(m==null?void 0:m.config)||{},y=qe(),C=Je(),se=$(),j=B(z),V=B(se),le=j===V,ue=C.has(j)||C.has("/".concat(j)),M=C.size<=1&&d.length<=1&&(le||ue);o({visible:!M,title:document.title||w.navigationBarTitleText||y.navigationBarTitleText||"",bgColor:w.navigationBarBackgroundColor||y.navigationBarBackgroundColor||"#ffffff",textStyle:w.navigationBarTextStyle||y.navigationBarTextStyle||"black",navStyle:w.navigationStyle||y.navigationStyle||"default",transparent:w.transparentTitle||y.transparentTitle||"none",leftIcon:M?"none":Ke(j,C,d.length,V)})}},[]);b.useDidShow(function(){p()}),b.usePageScroll(function(d){var m=d.scrollTop;n.transparent==="auto"&&u(Math.min(m/100,1))}),g.useEffect(function(){var d=null,m=new MutationObserver(function(){d&&clearTimeout(d),d=setTimeout(function(){p()},50)});return m.observe(document.head,{subtree:!0,childList:!0,characterData:!0}),p(),function(){m.disconnect(),d&&clearTimeout(d)}},[p]);var N=n.visible&&n.navStyle!=="custom";if(g.useEffect(function(){N?document.body.classList.add("h5-navbar-visible"):document.body.classList.remove("h5-navbar-visible")},[N]),!N)return t.jsx(t.Fragment,{});var I=n.textStyle==="white"?"#fff":"#333",te=n.textStyle==="white"?"text-white":"text-gray-800",ae=function(){return n.transparent==="always"?{backgroundColor:"transparent"}:n.transparent==="auto"?{backgroundColor:n.bgColor,opacity:f}:{backgroundColor:n.bgColor}},oe=function(){return b.navigateBack()},ie=function(){var m=$();b.reLaunch({url:"/".concat(m)})};return t.jsxs(t.Fragment,{children:[t.jsxs(l,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000",style:ae(),children:[n.leftIcon==="back"&&t.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:oe,children:t.jsx(he,{size:24,color:I})}),n.leftIcon==="home"&&t.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:ie,children:t.jsx(ve,{size:22,color:I})}),t.jsx(ge,{className:"text-base font-medium max-w-3/5 truncate ".concat(te),children:n.title})]}),t.jsx(l,{className:"h-11 shrink-0"})]})},Ze=function(e){var r=e.children;return t.jsxs(t.Fragment,{children:[t.jsx(Qe,{}),r]})},er=["className","children","orientation"],ee=g.forwardRef(function(s,e){var r=s.className,n=s.children,o=s.orientation,a=o===void 0?"vertical":o,i=be(s,er),f=a==="horizontal"||a==="both",u=a==="vertical"||a==="both";return t.jsx(xe,x(x({ref:e,className:O("relative",r),scrollY:u,scrollX:f,style:{overflowX:f?"auto":"hidden",overflowY:u?"auto":"hidden"}},i),{},{children:n}))});ee.displayName="ScrollArea";var rr={error:null,report:"",source:"",visible:!1,open:!1,timestamp:""},Y="hsl(360, 100%, 45%)",X=!1,S=rr,H=new Set,nr=function(){H.forEach(function(e){return e()})},tr=function(e){return H.add(e),function(){return H.delete(e)}},G=function(){return S},re=function(e){S=e,nr()},ar=(function(){var s=h(c().m(function e(r){var n,o,a,i,f;return c().w(function(u){for(;;)switch(u.p=u.n){case 0:if(typeof window!="undefined"){u.n=1;break}return u.a(2,!1);case 1:if(u.p=1,!((n=navigator.clipboard)!==null&&n!==void 0&&n.writeText)){u.n=3;break}return u.n=2,navigator.clipboard.writeText(r);case 2:return u.a(2,!0);case 3:u.n=5;break;case 4:u.p=4,i=u.v,console.warn("[H5ErrorBoundary] Clipboard API copy failed:",i);case 5:return u.p=5,o=document.createElement("textarea"),o.value=r,o.setAttribute("readonly","true"),o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),a=document.execCommand("copy"),document.body.removeChild(o),u.a(2,a);case 6:return u.p=6,f=u.v,console.warn("[H5ErrorBoundary] Fallback copy failed:",f),u.a(2,!1)}},e,null,[[5,6],[1,4]])}));return function(r){return s.apply(this,arguments)}})(),or=function(e){if(e instanceof Error)return e;if(typeof e=="string")return new Error(e);try{return new Error(JSON.stringify(e))}catch(r){return new Error(String(e))}},ir=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=["[H5 Runtime Error]","Time: ".concat(new Date().toISOString()),r.source?"Source: ".concat(r.source):"","Name: ".concat(e.name),"Message: ".concat(e.message),e.stack?`Stack:
`.concat(e.stack):"",r.componentStack?`Component Stack:
`.concat(r.componentStack):"",typeof navigator!="undefined"?"User Agent: ".concat(navigator.userAgent):""].filter(Boolean);return n.join(`

`)},q=function(e){S.visible&&re(x(x({},S),{},{open:e}))},L=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(typeof window!="undefined"){var n=or(e),o=ir(n,r),a=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});re({error:n,report:o,source:r.source||"runtime",timestamp:a,visible:!0,open:!1}),console.error("[H5ErrorOverlay] Showing error overlay:",n,r)}},sr=function(e){var r=e.error||new Error(e.message||"Unknown H5 runtime error");L(r,{source:"window.error"})},lr=function(e){L(e.reason,{source:"window.unhandledrejection"})},ur=function(){typeof window=="undefined"||X||(X=!0,window.addEventListener("error",sr),window.addEventListener("unhandledrejection",lr))},cr=function(){var e,r,n=g.useSyncExternalStore(tr,G,G);if(!n.visible)return null;var o=((e=n.error)===null||e===void 0?void 0:e.name)||"Error";return t.jsx(Oe,{children:t.jsxs(l,{className:"pointer-events-none fixed inset-0 z-[2147483646]",children:[t.jsx(l,{className:"pointer-events-auto fixed bottom-5 left-5",children:t.jsx(F,{variant:"outline",size:"icon",className:O("h-11 w-11 rounded-full shadow-md transition-transform"),style:{backgroundColor:"hsl(359, 100%, 97%)",borderColor:"hsl(359, 100%, 94%)",color:Y},onClick:function(){return q(!n.open)},children:t.jsx(Ee,{size:22,color:Y})})}),n.open&&t.jsx(l,{className:"pointer-events-none fixed inset-0 bg-white bg-opacity-15 supports-[backdrop-filter]:backdrop-blur-md",children:t.jsx(l,{className:"absolute inset-0 flex items-center justify-center px-4 py-4",children:t.jsx(l,{className:"w-full max-w-md",style:{width:"min(calc(100vw - 32px), var(--h5-phone-width, 390px))",height:"min(calc(100vh - 32px), 900px)"},children:t.jsx(He,{className:O("pointer-events-auto h-full rounded-2xl border border-border bg-background text-foreground shadow-2xl"),children:t.jsxs(l,{className:"relative flex h-full flex-col",children:[t.jsxs(Re,{className:"gap-2 p-4 pb-2",children:[t.jsxs(l,{className:"flex items-start justify-between gap-3",children:[t.jsxs(l,{className:"flex flex-wrap items-center gap-2",children:[t.jsx(D,{variant:"destructive",className:"border-none bg-red-500 px-3 py-1 text-xs font-medium text-white",children:"Runtime Error"}),t.jsx(D,{variant:"outline",className:"px-3 py-1 text-xs",children:n.source})]}),t.jsxs(l,{className:"flex shrink-0 items-center gap-1",children:[t.jsx(F,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return window.location.reload()},children:t.jsx(_e,{size:15,color:"inherit"})}),t.jsx(F,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return q(!1)},children:t.jsx(Ce,{size:17,color:"inherit"})})]})]}),t.jsxs(l,{className:"flex items-center justify-between gap-3",children:[t.jsx(Le,{className:"text-left text-lg",children:o}),t.jsxs(F,{variant:"outline",size:"sm",className:"shrink-0 rounded-lg",onClick:(function(){var a=h(c().m(function f(){var u;return c().w(function(p){for(;;)switch(p.n){case 0:return p.n=1,ar(n.report);case 1:if(u=p.v,!u){p.n=2;break}return U.success("已复制错误信息",{description:"可发送给 Agent 进行自动修复",position:"top-center"}),p.a(2);case 2:U.warning("复制失败",{description:"请直接选中文本后手动复制。",position:"top-center"});case 3:return p.a(2)}},f)}));function i(){return a.apply(this,arguments)}return i})(),children:[t.jsx(je,{size:15,color:"inherit"}),t.jsx(l,{children:"复制错误"})]})]})]}),t.jsx(Ie,{className:"min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2",children:t.jsxs(l,{className:"flex h-full min-h-0 flex-col gap-2",children:[t.jsxs(l,{className:"flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border px-3 py-2 text-sm",children:[t.jsxs(l,{className:"flex items-center gap-2",children:[t.jsx(l,{className:"text-muted-foreground",children:"Error"}),t.jsx(l,{className:"font-medium text-foreground",children:((r=n.error)===null||r===void 0?void 0:r.name)||"Error"})]}),t.jsx(l,{className:"h-4 w-px bg-border"}),t.jsxs(l,{className:"flex items-center gap-2",children:[t.jsx(l,{className:"text-muted-foreground",children:"Source"}),t.jsx(l,{className:"font-medium text-foreground",children:n.source})]})]}),t.jsxs(l,{className:"min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-black text-white",children:[t.jsxs(l,{className:"flex items-center justify-between border-b border-white border-opacity-10 px-3 py-3",children:[t.jsx(l,{className:"text-xs font-medium uppercase tracking-wide text-zinc-400",children:"Full Report"}),t.jsx(D,{variant:"outline",className:"border-zinc-700 bg-transparent px-2 py-1 text-xs text-zinc-400",children:n.timestamp})]}),t.jsx(ee,{className:"min-h-0 flex-1 w-full",orientation:"both",children:t.jsx(l,{className:"inline-block min-w-full whitespace-pre px-3 py-3 pb-8 font-mono text-xs leading-6 text-zinc-200",children:n.report})})]})]})})]})})})})})]})})},dr=(function(s){function e(){var r;Fe(this,e);for(var n=arguments.length,o=new Array(n),a=0;a<n;a++)o[a]=arguments[a];return r=Te(this,e,[].concat(o)),r.state={error:null},r}return we(e,s),ye(e,[{key:"componentDidUpdate",value:function(n){this.state.error&&n.children!==this.props.children&&this.setState({error:null})}},{key:"componentDidCatch",value:function(n,o){L(n,{source:"React Error Boundary",componentStack:o.componentStack||""})}},{key:"render",value:function(){return t.jsxs(t.Fragment,{children:[t.jsx(cr,{}),this.state.error?null:this.props.children]})}}],[{key:"getDerivedStateFromError",value:function(n){return{error:n}}}])})(g.Component),pr=function(e){var r=e.children;return t.jsx(dr,{children:r})},mr=function(e){var r=e.children;return ur(),b.useLaunch(function(){Xe(),Ye()}),t.jsx(pr,{children:t.jsx(Ze,{children:r})})},fr=function(e){var r=e.children;return t.jsxs(Be,{defaultColor:"#000",defaultSize:24,children:[t.jsx(mr,{children:r}),t.jsx(ze,{})]})},_=K.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index","pages/booking/create","pages/profile/index","pages/service/detail","pages/order/detail","pages/about/index","pages/admin/index","pages/admin/login","pages/admin-web/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#FFFFFF",navigationBarTitleText:"森易家",navigationBarTextStyle:"black"},tabBar:{color:"#94A3B8",selectedColor:"#0D9488",backgroundColor:"#FFFFFF",borderStyle:"white",list:[{pagePath:"pages/index/index",text:"首页",iconPath:"./assets/tabbar/house.png",selectedIconPath:"./assets/tabbar/house-active.png"},{pagePath:"pages/booking/create",text:"预约",iconPath:"./assets/tabbar/calendar.png",selectedIconPath:"./assets/tabbar/calendar-active.png"},{pagePath:"pages/profile/index",text:"我的",iconPath:"./assets/tabbar/user.png",selectedIconPath:"./assets/tabbar/user-active.png"}]}},P=[],k=[];P[0]="/static/images/house.png";k[0]="/static/images/house-active.png";P[1]="/static/images/calendar.png";k[1]="/static/images/calendar-active.png";P[2]="/static/images/user.png";k[2]="/static/images/user-active.png";var J=_.tabBar.list;for(var E=0;E<J.length;E++){var T=J[E];T.iconPath&&(T.iconPath=P[E]),T.selectedIconPath&&(T.selectedIconPath=k[E])}_.routes=[Object.assign({path:"pages/index/index",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./index.639379ef.js"),["./index.639379ef.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"森易家 - 专业室内环境治理"}),Object.assign({path:"pages/booking/create",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./create.de533a4b.js"),["./create.de533a4b.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"预约服务"}),Object.assign({path:"pages/profile/index",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./index.de63b37d.js"),["./index.de63b37d.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"我的"}),Object.assign({path:"pages/service/detail",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./detail.939028fa.js"),["./detail.939028fa.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"服务详情"}),Object.assign({path:"pages/order/detail",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./detail.404db5e8.js"),["./detail.404db5e8.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"订单详情"}),Object.assign({path:"pages/about/index",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./index.1dce3b9e.js"),["./index.1dce3b9e.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"关于我们"}),Object.assign({path:"pages/admin/index",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./index.0759cf1b.js"),["./index.0759cf1b.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"商户管理"}),Object.assign({path:"pages/admin/login",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./login.dcb7ac02.js"),["./login.dcb7ac02.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"商户登录",navigationBarBackgroundColor:"#0D9488",navigationBarTextStyle:"white"}),Object.assign({path:"pages/admin-web/index",load:(function(){var s=h(c().m(function r(n,o){var a;return c().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,v(()=>import("./index.bc2bf9f1.js"),["./index.bc2bf9f1.js","./vendors.d82c36e3.js","../css/vendors.8886af03.css","./common.6dd19889.js"],import.meta.url);case 1:return a=i.v,i.a(2,[a,n,o])}},r)}));function e(r,n){return s.apply(this,arguments)}return e})()},{navigationBarTitleText:"森易家商户管理后台"})];Object.assign(Q,{findDOMNode:A.findDOMNode,render:A.render,unstable_batchedUpdates:A.unstable_batchedUpdates});Se();var hr=Pe(fr,Z,Q,_),ne=ke({window:K});Ne(_,ne);Ae(ne,hr,_,Z);De({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
