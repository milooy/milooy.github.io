(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[351],{72:function(e){"use strict";var t=function(e,t){if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);var r;return e=Array.isArray(e)?e.map((function(e){return e.trim()})).filter((function(e){return e.length})).join("-"):e.trim(),0===e.length?"":1===e.length?t.pascalCase?e.toUpperCase():e.toLowerCase():(e!==e.toLowerCase()&&(e=function(e){for(var t=!1,r=!1,n=!1,i=0;i<e.length;i++){var a=e[i];t&&/[a-zA-Z]/.test(a)&&a.toUpperCase()===a?(e=e.slice(0,i)+"-"+e.slice(i),t=!1,n=r,r=!0,i++):r&&n&&/[a-zA-Z]/.test(a)&&a.toLowerCase()===a?(e=e.slice(0,i-1)+"-"+e.slice(i-1),n=r,r=!1,t=!0):(t=a.toLowerCase()===a&&a.toUpperCase()!==a,n=r,r=a.toUpperCase()===a&&a.toLowerCase()!==a)}return e}(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,(function(e,t){return t.toUpperCase()})).replace(/\d+(\w|$)/g,(function(e){return e.toUpperCase()})),r=e,t.pascalCase?r.charAt(0).toUpperCase()+r.slice(1):r)};e.exports=t,e.exports.default=t},2993:function(e){var t="undefined"!=typeof Element,r="function"==typeof Map,n="function"==typeof Set,i="function"==typeof ArrayBuffer&&!!ArrayBuffer.isView;function a(e,o){if(e===o)return!0;if(e&&o&&"object"==typeof e&&"object"==typeof o){if(e.constructor!==o.constructor)return!1;var c,s,l,u;if(Array.isArray(e)){if((c=e.length)!=o.length)return!1;for(s=c;0!=s--;)if(!a(e[s],o[s]))return!1;return!0}if(r&&e instanceof Map&&o instanceof Map){if(e.size!==o.size)return!1;for(u=e.entries();!(s=u.next()).done;)if(!o.has(s.value[0]))return!1;for(u=e.entries();!(s=u.next()).done;)if(!a(s.value[1],o.get(s.value[0])))return!1;return!0}if(n&&e instanceof Set&&o instanceof Set){if(e.size!==o.size)return!1;for(u=e.entries();!(s=u.next()).done;)if(!o.has(s.value[0]))return!1;return!0}if(i&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(o)){if((c=e.length)!=o.length)return!1;for(s=c;0!=s--;)if(e[s]!==o[s])return!1;return!0}if(e.constructor===RegExp)return e.source===o.source&&e.flags===o.flags;if(e.valueOf!==Object.prototype.valueOf&&"function"==typeof e.valueOf&&"function"==typeof o.valueOf)return e.valueOf()===o.valueOf();if(e.toString!==Object.prototype.toString&&"function"==typeof e.toString&&"function"==typeof o.toString)return e.toString()===o.toString();if((c=(l=Object.keys(e)).length)!==Object.keys(o).length)return!1;for(s=c;0!=s--;)if(!Object.prototype.hasOwnProperty.call(o,l[s]))return!1;if(t&&e instanceof Element)return!1;for(s=c;0!=s--;)if(("_owner"!==l[s]&&"__v"!==l[s]&&"__o"!==l[s]||!e.$$typeof)&&!a(e[l[s]],o[l[s]]))return!1;return!0}return e!=e&&o!=o}e.exports=function(e,t){try{return a(e,t)}catch(r){if((r.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw r}}},4839:function(e,t,r){"use strict";var n,i=r(7294),a=(n=i)&&"object"==typeof n&&"default"in n?n.default:n;function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var c=!("undefined"==typeof window||!window.document||!window.document.createElement);e.exports=function(e,t,r){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof t)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==r&&"function"!=typeof r)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(n){if("function"!=typeof n)throw new Error("Expected WrappedComponent to be a React component.");var s,l=[];function u(){s=e(l.map((function(e){return e.props}))),f.canUseDOM?t(s):r&&(s=r(s))}var f=function(e){var t,r;function i(){return e.apply(this,arguments)||this}r=e,(t=i).prototype=Object.create(r.prototype),t.prototype.constructor=t,t.__proto__=r,i.peek=function(){return s},i.rewind=function(){if(i.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=s;return s=void 0,l=[],e};var o=i.prototype;return o.UNSAFE_componentWillMount=function(){l.push(this),u()},o.componentDidUpdate=function(){u()},o.componentWillUnmount=function(){var e=l.indexOf(this);l.splice(e,1),u()},o.render=function(){return a.createElement(n,this.props)},i}(i.PureComponent);return o(f,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(n)+")"),o(f,"canUseDOM",c),f}}},3723:function(e,t,r){"use strict";r.d(t,{L:function(){return m},M:function(){return T},P:function(){return w},S:function(){return R},_:function(){return c},a:function(){return o},b:function(){return l},g:function(){return u},h:function(){return s}});var n=r(7294),i=(r(72),r(5697)),a=r.n(i);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},o.apply(this,arguments)}function c(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)t.indexOf(r=a[n])>=0||(i[r]=e[r]);return i}var s=function(){return"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype};function l(e,t,r,n,i){return void 0===i&&(i={}),o({},r,{loading:n,shouldLoad:e,"data-main-image":"",style:o({},i,{opacity:t?1:0})})}function u(e,t,r,n,i,a,c,s){var l={};a&&(l.backgroundColor=a,"fixed"===r?(l.width=n,l.height=i,l.backgroundColor=a,l.position="relative"):("constrained"===r||"fullWidth"===r)&&(l.position="absolute",l.top=0,l.left=0,l.bottom=0,l.right=0)),c&&(l.objectFit=c),s&&(l.objectPosition=s);var u=o({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:o({opacity:t?0:1,transition:"opacity 500ms linear"},l)});return u}var f,d=["children"],p=function(e){var t=e.layout,r=e.width,i=e.height;return"fullWidth"===t?n.createElement("div",{"aria-hidden":!0,style:{paddingTop:i/r*100+"%"}}):"constrained"===t?n.createElement("div",{style:{maxWidth:r,display:"block"}},n.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg height='"+i+"' width='"+r+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},m=function(e){var t=e.children,r=c(e,d);return n.createElement(n.Fragment,null,n.createElement(p,o({},r)),t,null)},g=["src","srcSet","loading","alt","shouldLoad"],y=["fallback","sources","shouldLoad"],h=function(e){var t=e.src,r=e.srcSet,i=e.loading,a=e.alt,s=void 0===a?"":a,l=e.shouldLoad,u=c(e,g);return n.createElement("img",o({},u,{decoding:"async",loading:i,src:l?t:void 0,"data-src":l?void 0:t,srcSet:l?r:void 0,"data-srcset":l?void 0:r,alt:s}))},b=function(e){var t=e.fallback,r=e.sources,i=void 0===r?[]:r,a=e.shouldLoad,s=void 0===a||a,l=c(e,y),u=l.sizes||(null==t?void 0:t.sizes),f=n.createElement(h,o({},l,t,{sizes:u,shouldLoad:s}));return i.length?n.createElement("picture",null,i.map((function(e){var t=e.media,r=e.srcSet,i=e.type;return n.createElement("source",{key:t+"-"+i+"-"+r,type:i,media:t,srcSet:s?r:void 0,"data-srcset":s?void 0:r,sizes:u})})),f):f};h.propTypes={src:i.string.isRequired,alt:i.string.isRequired,sizes:i.string,srcSet:i.string,shouldLoad:i.bool},b.displayName="Picture",b.propTypes={alt:i.string.isRequired,shouldLoad:i.bool,fallback:i.exact({src:i.string.isRequired,srcSet:i.string,sizes:i.string}),sources:i.arrayOf(i.oneOfType([i.exact({media:i.string.isRequired,type:i.string,sizes:i.string,srcSet:i.string.isRequired}),i.exact({media:i.string,type:i.string.isRequired,sizes:i.string,srcSet:i.string.isRequired})]))};var v=["fallback"],w=function(e){var t=e.fallback,r=c(e,v);return t?n.createElement(b,o({},r,{fallback:{src:t},"aria-hidden":!0,alt:""})):n.createElement("div",o({},r))};w.displayName="Placeholder",w.propTypes={fallback:i.string,sources:null==(f=b.propTypes)?void 0:f.sources,alt:function(e,t,r){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+r+"`. Validation failed."):null}};var T=function(e){return n.createElement(n.Fragment,null,n.createElement(b,o({},e)),n.createElement("noscript",null,n.createElement(b,o({},e,{shouldLoad:!0}))))};T.displayName="MainImage",T.propTypes=b.propTypes;var E,C,S=function(e,t,r){for(var n=arguments.length,i=new Array(n>3?n-3:0),o=3;o<n;o++)i[o-3]=arguments[o];return e.alt||""===e.alt?a().string.apply(a(),[e,t,r].concat(i)):new Error('The "alt" prop is required in '+r+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},O={image:a().object.isRequired,alt:S},A=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],x=["style","className"],L=new Set,k=function(e){var t=e.as,i=void 0===t?"div":t,a=e.image,l=e.style,u=e.backgroundColor,f=e.className,d=e.class,p=e.onStartLoad,m=e.onLoad,g=e.onError,y=c(e,A),h=a.width,b=a.height,v=a.layout,w=function(e,t,r){var n={},i="gatsby-image-wrapper";return"fixed"===r?(n.width=e,n.height=t):"constrained"===r&&(i="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:i,"data-gatsby-image-wrapper":"",style:n}}(h,b,v),T=w.style,S=w.className,O=c(w,x),k=(0,n.useRef)(),j=(0,n.useMemo)((function(){return JSON.stringify(a.images)}),[a.images]);d&&(f=d);var I=function(e,t,r){var n="";return"fullWidth"===e&&(n='<div aria-hidden="true" style="padding-top: '+r/t*100+'%;"></div>'),"constrained"===e&&(n='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height=\''+r+"' width='"+t+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),n}(v,h,b);return(0,n.useEffect)((function(){E||(E=Promise.all([r.e(774),r.e(217)]).then(r.bind(r,9217)).then((function(e){var t=e.renderImageToString,r=e.swapPlaceholderImage;return C=t,{renderImageToString:t,swapPlaceholderImage:r}})));var e,t,n=k.current.querySelector("[data-gatsby-image-ssr]");return n&&s()?(n.complete?(null==p||p({wasCached:!0}),null==m||m({wasCached:!0}),setTimeout((function(){n.removeAttribute("data-gatsby-image-ssr")}),0)):(null==p||p({wasCached:!0}),n.addEventListener("load",(function e(){n.removeEventListener("load",e),null==m||m({wasCached:!0}),setTimeout((function(){n.removeAttribute("data-gatsby-image-ssr")}),0)}))),void L.add(j)):C&&L.has(j)?void 0:(E.then((function(r){var n=r.renderImageToString,i=r.swapPlaceholderImage;k.current&&(k.current.innerHTML=n(o({isLoading:!0,isLoaded:L.has(j),image:a},y)),L.has(j)||(e=requestAnimationFrame((function(){k.current&&(t=i(k.current,j,L,l,p,m,g))}))))})),function(){e&&cancelAnimationFrame(e),t&&t()})}),[a]),(0,n.useLayoutEffect)((function(){L.has(j)&&C&&(k.current.innerHTML=C(o({isLoading:L.has(j),isLoaded:L.has(j),image:a},y)),null==p||p({wasCached:!0}),null==m||m({wasCached:!0}))}),[a]),(0,n.createElement)(i,o({},O,{style:o({},T,l,{backgroundColor:u}),className:S+(f?" "+f:""),ref:k,dangerouslySetInnerHTML:{__html:I},suppressHydrationWarning:!0}))},j=(0,n.memo)((function(e){return e.image?(0,n.createElement)(k,e):null}));j.propTypes=O,j.displayName="GatsbyImage";var I,P=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"],N=function(e,t){for(var r=arguments.length,n=new Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?a().number.apply(a(),[e,t].concat(n)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},_=new Set(["fixed","fullWidth","constrained"]),M={src:a().string.isRequired,alt:S,width:N,height:N,sizes:a().string,layout:function(e){if(void 0!==e.layout&&!_.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}},R=(I=j,function(e){var t=e.src,r=e.__imageData,i=e.__error,a=c(e,P);return i&&console.warn(i),r?n.createElement(I,o({image:r},a)):(console.warn("Image not loaded",t),null)});R.displayName="StaticImage",R.propTypes=M},8613:function(e,t,r){"use strict";r.d(t,{Z:function(){return p}});var n=r(7294),i=r(3494),a=r(1082),o=r(3723),c=[{to:"/intro",label:"나는"},{to:"/category/dev",label:"개발 이야기"},{to:"/category/life",label:"사는 이야기"},{to:"/category/book",label:"책 읽어요"},{to:"/category/art",label:"그림 그리기"},{to:"/category/media",label:"눈과 귀"},{to:"/inbox",label:"글감상자"},{to:"/guest",label:"방명록"}],s={display:"flex",justifyContent:"space-between",borderBottom:"1px solid var(--color-border)",background:"var(--color-background-3)",alignItems:"center",paddingLeft:24},l=i.default.ul.withConfig({displayName:"TopNav__Categories",componentId:"sc-daeuvx-0"})(["background:var(--color-background);display:flex;list-style:none;border-bottom:1px solid var(--color-border);padding-left:24px;flex-wrap:wrap;margin-bottom:0;margin-top:0;padding-top:16px;"]),u=i.default.li.withConfig({displayName:"TopNav__CategoryItem",componentId:"sc-daeuvx-1"})([""]),f=(0,i.default)(a.Link).withConfig({displayName:"TopNav__StyledLink",componentId:"sc-daeuvx-2"})(["margin-right:3rem;text-decoration:none;color:black;"]),d=function(){return n.createElement(n.Fragment,null,n.createElement("nav",{style:s},n.createElement(a.Link,{to:"/",style:{textDecoration:"none"}},n.createElement("h1",{style:{margin:0}},"Today yurim felt")),n.createElement(o.S,{className:"main-heading",formats:["auto","webp","avif"],src:"../images/profile-pic.png",placeholder:"none",height:110,alt:"Profile picture",__imageData:r(8855)})),n.createElement(l,null,c.map((function(e){return n.createElement(f,{to:e.to},n.createElement(u,null,e.label))}))))},p=function(e){var t=e.location,r=e.children,i="/"===t.pathname;return n.createElement("div",null,n.createElement(d,null),n.createElement("div",{className:"global-wrapper","data-is-root-path":i},n.createElement("main",null,r),n.createElement("footer",null,"With love, Yurim Jin")))}},7959:function(e,t,r){"use strict";r.d(t,{Z:function(){return ye}});var n,i,a,o,c=r(7294),s=r(5697),l=r.n(s),u=r(4839),f=r.n(u),d=r(2993),p=r.n(d),m=r(6494),g=r.n(m),y="bodyAttributes",h="htmlAttributes",b="titleAttributes",v={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"},w=(Object.keys(v).map((function(e){return v[e]})),"charset"),T="cssText",E="href",C="http-equiv",S="innerHTML",O="itemprop",A="name",x="property",L="rel",k="src",j="target",I={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},P="defaultTitle",N="defer",_="encodeSpecialCharacters",M="onChangeClientState",R="titleTemplate",q=Object.keys(I).reduce((function(e,t){return e[I[t]]=t,e}),{}),z=[v.NOSCRIPT,v.SCRIPT,v.STYLE],D="data-react-helmet",H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},F=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),U=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},B=function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r},W=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},Y=function(e){var t=J(e,v.TITLE),r=J(e,R);if(r&&t)return r.replace(/%s/g,(function(){return Array.isArray(t)?t.join(""):t}));var n=J(e,P);return t||n||void 0},K=function(e){return J(e,M)||function(){}},V=function(e,t){return t.filter((function(t){return void 0!==t[e]})).map((function(t){return t[e]})).reduce((function(e,t){return U({},e,t)}),{})},Z=function(e,t){return t.filter((function(e){return void 0!==e[v.BASE]})).map((function(e){return e[v.BASE]})).reverse().reduce((function(t,r){if(!t.length)for(var n=Object.keys(r),i=0;i<n.length;i++){var a=n[i].toLowerCase();if(-1!==e.indexOf(a)&&r[a])return t.concat(r)}return t}),[])},$=function(e,t,r){var n={};return r.filter((function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&te("Helmet: "+e+' should be of type "Array". Instead found type "'+H(t[e])+'"'),!1)})).map((function(t){return t[e]})).reverse().reduce((function(e,r){var i={};r.filter((function(e){for(var r=void 0,a=Object.keys(e),o=0;o<a.length;o++){var c=a[o],s=c.toLowerCase();-1===t.indexOf(s)||r===L&&"canonical"===e[r].toLowerCase()||s===L&&"stylesheet"===e[s].toLowerCase()||(r=s),-1===t.indexOf(c)||c!==S&&c!==T&&c!==O||(r=c)}if(!r||!e[r])return!1;var l=e[r].toLowerCase();return n[r]||(n[r]={}),i[r]||(i[r]={}),!n[r][l]&&(i[r][l]=!0,!0)})).reverse().forEach((function(t){return e.push(t)}));for(var a=Object.keys(i),o=0;o<a.length;o++){var c=a[o],s=g()({},n[c],i[c]);n[c]=s}return e}),[]).reverse()},J=function(e,t){for(var r=e.length-1;r>=0;r--){var n=e[r];if(n.hasOwnProperty(t))return n[t]}return null},G=(n=Date.now(),function(e){var t=Date.now();t-n>16?(n=t,e(t)):setTimeout((function(){G(e)}),0)}),Q=function(e){return clearTimeout(e)},X="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||G:r.g.requestAnimationFrame||G,ee="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||Q:r.g.cancelAnimationFrame||Q,te=function(e){return console&&"function"==typeof console.warn&&console.warn(e)},re=null,ne=function(e,t){var r=e.baseTag,n=e.bodyAttributes,i=e.htmlAttributes,a=e.linkTags,o=e.metaTags,c=e.noscriptTags,s=e.onChangeClientState,l=e.scriptTags,u=e.styleTags,f=e.title,d=e.titleAttributes;oe(v.BODY,n),oe(v.HTML,i),ae(f,d);var p={baseTag:ce(v.BASE,r),linkTags:ce(v.LINK,a),metaTags:ce(v.META,o),noscriptTags:ce(v.NOSCRIPT,c),scriptTags:ce(v.SCRIPT,l),styleTags:ce(v.STYLE,u)},m={},g={};Object.keys(p).forEach((function(e){var t=p[e],r=t.newTags,n=t.oldTags;r.length&&(m[e]=r),n.length&&(g[e]=p[e].oldTags)})),t&&t(),s(e,m,g)},ie=function(e){return Array.isArray(e)?e.join(""):e},ae=function(e,t){void 0!==e&&document.title!==e&&(document.title=ie(e)),oe(v.TITLE,t)},oe=function(e,t){var r=document.getElementsByTagName(e)[0];if(r){for(var n=r.getAttribute(D),i=n?n.split(","):[],a=[].concat(i),o=Object.keys(t),c=0;c<o.length;c++){var s=o[c],l=t[s]||"";r.getAttribute(s)!==l&&r.setAttribute(s,l),-1===i.indexOf(s)&&i.push(s);var u=a.indexOf(s);-1!==u&&a.splice(u,1)}for(var f=a.length-1;f>=0;f--)r.removeAttribute(a[f]);i.length===a.length?r.removeAttribute(D):r.getAttribute(D)!==o.join(",")&&r.setAttribute(D,o.join(","))}},ce=function(e,t){var r=document.head||document.querySelector(v.HEAD),n=r.querySelectorAll(e+"["+D+"]"),i=Array.prototype.slice.call(n),a=[],o=void 0;return t&&t.length&&t.forEach((function(t){var r=document.createElement(e);for(var n in t)if(t.hasOwnProperty(n))if(n===S)r.innerHTML=t.innerHTML;else if(n===T)r.styleSheet?r.styleSheet.cssText=t.cssText:r.appendChild(document.createTextNode(t.cssText));else{var c=void 0===t[n]?"":t[n];r.setAttribute(n,c)}r.setAttribute(D,"true"),i.some((function(e,t){return o=t,r.isEqualNode(e)}))?i.splice(o,1):a.push(r)})),i.forEach((function(e){return e.parentNode.removeChild(e)})),a.forEach((function(e){return r.appendChild(e)})),{oldTags:i,newTags:a}},se=function(e){return Object.keys(e).reduce((function(t,r){var n=void 0!==e[r]?r+'="'+e[r]+'"':""+r;return t?t+" "+n:n}),"")},le=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,r){return t[I[r]||r]=e[r],t}),t)},ue=function(e,t,r){switch(e){case v.TITLE:return{toComponent:function(){return e=t.title,r=t.titleAttributes,(n={key:e})[D]=!0,i=le(r,n),[c.createElement(v.TITLE,i,e)];var e,r,n,i},toString:function(){return function(e,t,r,n){var i=se(r),a=ie(t);return i?"<"+e+" "+D+'="true" '+i+">"+W(a,n)+"</"+e+">":"<"+e+" "+D+'="true">'+W(a,n)+"</"+e+">"}(e,t.title,t.titleAttributes,r)}};case y:case h:return{toComponent:function(){return le(t)},toString:function(){return se(t)}};default:return{toComponent:function(){return function(e,t){return t.map((function(t,r){var n,i=((n={key:r})[D]=!0,n);return Object.keys(t).forEach((function(e){var r=I[e]||e;if(r===S||r===T){var n=t.innerHTML||t.cssText;i.dangerouslySetInnerHTML={__html:n}}else i[r]=t[e]})),c.createElement(e,i)}))}(e,t)},toString:function(){return function(e,t,r){return t.reduce((function(t,n){var i=Object.keys(n).filter((function(e){return!(e===S||e===T)})).reduce((function(e,t){var i=void 0===n[t]?t:t+'="'+W(n[t],r)+'"';return e?e+" "+i:i}),""),a=n.innerHTML||n.cssText||"",o=-1===z.indexOf(e);return t+"<"+e+" "+D+'="true" '+i+(o?"/>":">"+a+"</"+e+">")}),"")}(e,t,r)}}}},fe=function(e){var t=e.baseTag,r=e.bodyAttributes,n=e.encode,i=e.htmlAttributes,a=e.linkTags,o=e.metaTags,c=e.noscriptTags,s=e.scriptTags,l=e.styleTags,u=e.title,f=void 0===u?"":u,d=e.titleAttributes;return{base:ue(v.BASE,t,n),bodyAttributes:ue(y,r,n),htmlAttributes:ue(h,i,n),link:ue(v.LINK,a,n),meta:ue(v.META,o,n),noscript:ue(v.NOSCRIPT,c,n),script:ue(v.SCRIPT,s,n),style:ue(v.STYLE,l,n),title:ue(v.TITLE,{title:f,titleAttributes:d},n)}},de=f()((function(e){return{baseTag:Z([E,j],e),bodyAttributes:V(y,e),defer:J(e,N),encode:J(e,_),htmlAttributes:V(h,e),linkTags:$(v.LINK,[L,E],e),metaTags:$(v.META,[A,w,C,x,O],e),noscriptTags:$(v.NOSCRIPT,[S],e),onChangeClientState:K(e),scriptTags:$(v.SCRIPT,[k,S],e),styleTags:$(v.STYLE,[T],e),title:Y(e),titleAttributes:V(b,e)}}),(function(e){re&&ee(re),e.defer?re=X((function(){ne(e,(function(){re=null}))})):(ne(e),re=null)}),fe)((function(){return null})),pe=(i=de,o=a=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.shouldComponentUpdate=function(e){return!p()(this.props,e)},t.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case v.SCRIPT:case v.NOSCRIPT:return{innerHTML:t};case v.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},t.prototype.flattenArrayTypeChildren=function(e){var t,r=e.child,n=e.arrayTypeChildren,i=e.newChildProps,a=e.nestedChildren;return U({},n,((t={})[r.type]=[].concat(n[r.type]||[],[U({},i,this.mapNestedChildrenToProps(r,a))]),t))},t.prototype.mapObjectTypeChildren=function(e){var t,r,n=e.child,i=e.newProps,a=e.newChildProps,o=e.nestedChildren;switch(n.type){case v.TITLE:return U({},i,((t={})[n.type]=o,t.titleAttributes=U({},a),t));case v.BODY:return U({},i,{bodyAttributes:U({},a)});case v.HTML:return U({},i,{htmlAttributes:U({},a)})}return U({},i,((r={})[n.type]=U({},a),r))},t.prototype.mapArrayTypeChildrenToProps=function(e,t){var r=U({},t);return Object.keys(e).forEach((function(t){var n;r=U({},r,((n={})[t]=e[t],n))})),r},t.prototype.warnOnInvalidChildren=function(e,t){return!0},t.prototype.mapChildrenToProps=function(e,t){var r=this,n={};return c.Children.forEach(e,(function(e){if(e&&e.props){var i=e.props,a=i.children,o=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,r){return t[q[r]||r]=e[r],t}),t)}(B(i,["children"]));switch(r.warnOnInvalidChildren(e,a),e.type){case v.LINK:case v.META:case v.NOSCRIPT:case v.SCRIPT:case v.STYLE:n=r.flattenArrayTypeChildren({child:e,arrayTypeChildren:n,newChildProps:o,nestedChildren:a});break;default:t=r.mapObjectTypeChildren({child:e,newProps:t,newChildProps:o,nestedChildren:a})}}})),t=this.mapArrayTypeChildrenToProps(n,t)},t.prototype.render=function(){var e=this.props,t=e.children,r=B(e,["children"]),n=U({},r);return t&&(n=this.mapChildrenToProps(t,n)),c.createElement(i,n)},F(t,null,[{key:"canUseDOM",set:function(e){i.canUseDOM=e}}]),t}(c.Component),a.propTypes={base:l().object,bodyAttributes:l().object,children:l().oneOfType([l().arrayOf(l().node),l().node]),defaultTitle:l().string,defer:l().bool,encodeSpecialCharacters:l().bool,htmlAttributes:l().object,link:l().arrayOf(l().object),meta:l().arrayOf(l().object),noscript:l().arrayOf(l().object),onChangeClientState:l().func,script:l().arrayOf(l().object),style:l().arrayOf(l().object),title:l().string,titleAttributes:l().object,titleTemplate:l().string},a.defaultProps={defer:!0,encodeSpecialCharacters:!0},a.peek=i.peek,a.rewind=function(){var e=i.rewind();return e||(e=fe({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},o);pe.renderStatic=pe.rewind;var me=r(1082),ge=function(e){var t,r,n,i=e.description,a=e.lang,o=e.meta,s=e.title,l=(0,me.useStaticQuery)("2841359383").site,u=i||l.siteMetadata.description,f=null===(t=l.siteMetadata)||void 0===t?void 0:t.title;return c.createElement(pe,{htmlAttributes:{lang:a},title:s,titleTemplate:f?"%s | "+f:null,meta:[{name:"description",content:u},{property:"og:title",content:s},{property:"og:description",content:u},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:(null===(r=l.siteMetadata)||void 0===r||null===(n=r.social)||void 0===n?void 0:n.twitter)||""},{name:"twitter:title",content:s},{name:"twitter:description",content:u}].concat(o)})};ge.defaultProps={lang:"en",meta:[],description:""};var ye=ge},8855:function(e){"use strict";e.exports=JSON.parse('{"layout":"constrained","images":{"fallback":{"src":"/static/6f6993e6bccd3c63f94928a53c7d7f94/36cff/profile-pic.png","srcSet":"/static/6f6993e6bccd3c63f94928a53c7d7f94/06956/profile-pic.png 23w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/39458/profile-pic.png 46w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/36cff/profile-pic.png 91w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/421e0/profile-pic.png 182w","sizes":"(min-width: 91px) 91px, 100vw"},"sources":[{"srcSet":"/static/6f6993e6bccd3c63f94928a53c7d7f94/a0d16/profile-pic.avif 23w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/440f0/profile-pic.avif 46w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/aec04/profile-pic.avif 91w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/d0ad7/profile-pic.avif 182w","type":"image/avif","sizes":"(min-width: 91px) 91px, 100vw"},{"srcSet":"/static/6f6993e6bccd3c63f94928a53c7d7f94/28220/profile-pic.webp 23w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/eb98e/profile-pic.webp 46w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/17797/profile-pic.webp 91w,\\n/static/6f6993e6bccd3c63f94928a53c7d7f94/d6581/profile-pic.webp 182w","type":"image/webp","sizes":"(min-width: 91px) 91px, 100vw"}]},"width":91,"height":110}')}}]);
//# sourceMappingURL=commons-8a125c4d29c784db30e3.js.map