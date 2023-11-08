import{d as le,e as re,b as z,n as oe,p as X,o as Z,c as C,m as N,D as ae,g as O,i as ee,F as se,f as g,l as ue,j as K,S as Q,a as de,q as ce,r as ge,s as me,k as he,t as D,v as fe}from"./entry-client-d9f900d5.js";var R=(t=>(t[t.Start=0]="Start",t[t.Center=1]="Center",t[t.End=2]="End",t))(R||{});const pe={updateItem:()=>{},removeItem:()=>{}},te=le(pe);function be(){return re(te)}const q={alignment:R.Center,calculateHeight:!0,useElementWidth:!1,horizontalGap:0,verticalGap:0,repositionOnResize:!0,fitHorizontalGap:!1,requestAppendScrollTolerance:20};function ye(t,l){const[m,p]=z();let w=!1,b,o=[],a;function d(){return l.options?l.options():void 0}function u(e){e.requestReposition=h,e.reposition=x,e.attachOnScrollListener=()=>{document.addEventListener("scroll",r)},e.deAttachOnScrollListener=()=>{document.removeEventListener("scroll",r)},e.attachOnResize=()=>{window.addEventListener("resize",$)},e.deAttachOnResize=()=>{window.removeEventListener("resize",$)},e.isRegistered=!0}l.gridController!=null&&u(l.gridController);function S(e){if(e.gridWidth!=null)return e.gridWidth;{let n=y(e),i=t();if(n!=null&&e.columnWidth!=null&&!e.useElementWidth)return n*e.columnWidth;if(i!=null){const c=i.clientWidth;return c==null||c==0?(console.error("gridWidth is zero , gridWidth prop || css width property should be given to StaggeredGrid"),0):c}else return 0}}function y(e){if(e.columns!=null&&e.columns>0)return Math.max(1,Math.min(o.length,e.columns))}function v(e,n){if(e.columnWidth!=null)return e.columnWidth;{let i=y(e);return i!=null?n/i:(console.error("columnWidth is zero , columns || columnWidth prop not given to StaggeredGrid"),260)}}function W(e,n,i,c){let E=v(e,n);return e.fitHorizontalGap&&(E-=(i-1)*c/i),E}function G(e,n){return y(e)||Math.max(1,Math.min(o.length,Math.ceil(n/v(e,n))-1))}function x(e){try{const n=e;if(o.length===0)return;b=S(n);const i=G(n,b);if(i<1)return;const c=n.horizontalGap||q.horizontalGap,E=n.verticalGap||q.verticalGap,T=W(n,b,i,c),U=i*T+(i-1)*c;let F=0,P=0;const M=Array(i).fill(0);let V=0;n.alignment===R.Center?V=(b-U)/2:n.alignment===R.End&&(V=b-U);for(let k=0;k<o.length;k++){let I=o[k];if(I.mounted)try{const _=Math.max(1,Math.min(I.itemColumnSpan,i)),Y=_*T+Math.max(_-1,0)*c,J=I.itemHeight;let j,B=0;if(P+_<=i?j=F:(P=0,j=0,F=0),_===1)B=M[P],M[P]+=J+E;else if(_>1){let A=0;for(let L=P;L<P+_;L++)M[L]>A&&(A=M[L]);B=A;for(let L=P;L<P+_;L++)M[L]=A+J+E}F+=Y+c,P+=_,I.update(Y,V+j,B)}catch(_){console.warn(_)}}if(n.calculateHeight){let k=0;for(let I=0;I<M.length;I++)M[I]>k&&(k=M[I]);m()!==k&&p(k)}w=!0}catch(n){console.error(n)}}function h(e){a==null&&(a=window.requestAnimationFrame(()=>{a=void 0,x(e)}))}function $(){const e=d();e&&h(e)}function r(){const e=d();if(!e)return;let n=t();if(n==null||m()==null){e.calculateHeight||console.warn("calculateHeight must be true for requestAppend to work !");return}const i=n.getBoundingClientRect().top-(n.offsetParent?.getBoundingClientRect().top||0);(window.scrollY||window.pageYOffset)+window.innerHeight-i>=n.scrollHeight-(e.requestAppendScrollTolerance||q.requestAppendScrollTolerance)&&e.requestAppend!=null&&e.requestAppend()}function s(){let e;return(l.options||(()=>q))().calculateHeight&&m()!=null?e={height:m()+"px"}:e={},e}function f(e,n,i,c){let E=!1;if(o[e]!=null?((n!==o[e].itemColumnSpan||i!==o[e].itemHeight)&&(E=!0),o[e].itemColumnSpan=n,o[e].itemHeight=i,o[e].update=c,o[e].mounted=!0):o[e]={itemColumnSpan:n,itemHeight:i,update:c,mounted:!0},E&&w){const T=d();T&&h(T)}}function H(e){if(o[e]!=null){o[e].mounted=!1;const n=d();n&&h(n)}}return oe(()=>{const e=d();e&&e.repositionOnResize&&window.addEventListener("resize",$),e&&e.requestAppend!=null&&document.addEventListener("scroll",r)}),X(()=>{const e=d();e&&h(e),l.gridController!=null&&!l.gridController.isRegistered&&u(l.gridController)}),Z(()=>{{const e=d();e&&e.repositionOnResize&&window.removeEventListener("resize",$),e&&e.requestAppend!=null&&document.removeEventListener("scroll",r)}}),{updateItem:f,removeItem:H,context:{updateItem:f,removeItem:H},getHeightProp:s}}function Se(){return{isRegistered:!1,attachOnResize(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")},attachOnScrollListener(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")},deAttachOnResize(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")},deAttachOnScrollListener(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")},reposition(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")},requestReposition(){console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")}}}function ne(t){const l=be(),[m,p]=z(t.initialPosition);let w;function b(d,u,S){const y=m();if(y==null||y.width!==d||u!==y.left||S!==y.top){const v={width:d,left:u,top:S,animateTo:y!=null};p(v)}}function o(){t.itemHeight==null&&w==null||l.updateItem(t.index(),t.spans||1,t.itemHeight||w.clientHeight,b)}X(o),Z(()=>l.removeItem(t.index()));function a(){const d=m(),u={...t};if(delete u.elementType,delete u.initialPosition,delete u.itemHeight,delete u.spans,delete u.index,delete u.children,delete u.transform,t.transform!=null)return{...u,...t.transform(d)};if(d==null)return u;const S=d.animateTo?{transition:"top, left 0.3s ease"}:{};return{...u,style:{position:"absolute",width:d.width+"px",left:d.left+"px",top:d.top+"px",...S,...t.style||{}}}}return()=>({...a(),onLoad:o,ref:t.itemHeight==null?w:void 0})}function ve(t){const l=ne(t);return C(ae,N({get component(){return t.elementType||"div"}},l,{get children(){return t.children}}))}const ie=D("<div>"),Ge=D('<div><div>Name : <!#><!/><div>Span : <input type="number"></div><div>Height : <input type="number"></div><button>Add Next</button><button>Remove Me</button><button>Update Me</button><button>Swap Me'),we=D('<img alt="Random Image">'),xe=D('<div><label for="fitHorizontalGap">Show Images: </label><input type="checkbox"><label for="multiSpan">Multi Span: </label><input type="checkbox"><label for="alignment">Alignment : </label><select id="alignment"><option>Start</option><option>Center</option><option>End</option></select><label for="columnWidth">Column Width : </label><input type="number" id="columnWidth" min="0"><label for="columns">Total Columns : </label><input type="number" id="columns" min="0"><label for="horizontalGap">Horizontal Gap : </label><input type="number" id="horizontalGap" min="0"><label for="verticalGap">Vertical Gap : </label><input type="number" id="verticalGap" min="0"><label for="fitHorizontalGap">Fit Horizontal Gap : </label><input type="checkbox"><label for="infiniteGrid">Infinite Grid : </label><input type="checkbox">');function $e(){const[t,l]=z(!1),[m,p]=z(!1),[w,b]=z(!1),[o,a]=z({calculateHeight:!0,useElementWidth:!0,alignment:R.Center,columnWidth:300,columns:0,horizontalGap:10,verticalGap:10,fitHorizontalGap:!0,requestAppend:()=>{w()&&x(W([...G()],10))}});let d=Se();const u=20;function S(){return Math.floor(Math.random()*300+300)}function y(){let r=[];for(let s=0;s<u;s++)r.push(S());return r}function v(){let r=[];for(let s=0;s<u;s++)r.push(Math.floor(Math.random()*2)+1);return r}function W(r,s){const f=r.length,H=v(),e=y();for(let n=0;n<s;n++){let i;m()?i=H[n]:i=1,r.push({key:"Item"+(n+f)+i,name:"Item "+(n+f),span:i,width:i*o().columnWidth,height:e[n]})}return r}let[G,x]=z(W([],u)),h;const $=ye(()=>h,{gridController:d,options:o});return[C(Pe,{alignment:()=>o().alignment,setAlignment:r=>{a(s=>({...s,alignment:r}))},columnWidth:()=>o().columnWidth,setColumnWidth:r=>{a(s=>({...s,columnWidth:r}))},columns:()=>o().columns,setColumns:r=>{a(s=>({...s,columns:r}))},horizontalGap:()=>o().horizontalGap,setHorizontalGap:r=>{a(s=>({...s,horizontalGap:r}))},verticalGap:()=>o().verticalGap,setVerticalGap:r=>{a(s=>({...s,verticalGap:r}))},fitHorizontalGap:()=>o().fitHorizontalGap,setFitHorizontalGap:r=>{a(s=>({...s,fitHorizontalGap:r}))},images:t,setImages:l,multiSpan:m,setMultiSpan:p,infiniteGrid:w,setInfiniteGrid:b}),C(te.Provider,{get value(){return $.context},get children(){const r=O(ie),s=h;return typeof s=="function"?fe(s,r):h=r,ee(r,C(se,{get each(){return G()},children:(f,H)=>C(Ce,{get columnWidth(){return o().columnWidth},images:t,index:H,item:f,addNext:e=>{x(n=>{const i=[...n];return i.splice(e+1,0,{key:"newItem"+(e+1),name:"Item "+(e+1),height:S(),width:o().columnWidth,span:1}),i})},removeMe:e=>{x(n=>{let i=[...n];return i.splice(e,1),i})},updateMe:(e,n)=>{x(i=>{let c=[...i];return c[e]=n,c})},swapWithRandom:e=>{const n=G();let i=Math.floor(Math.random()*(n.length-1));if(i>0&&i<n.length){let c=[...n];c[e]=c[i],c[i]=n[e],x(c)}}})})),g(f=>ue(r,{background:"#e3e3e3","margin-top":"1em",position:"relative",...$.getHeightProp()},f)),r}})]}function Ce(t){return[C(Q,{get when(){return t.images()},get children(){return C(_e,N(()=>K(t,["images"])[1]))}}),C(Q,{get when(){return!t.images()},get children(){return C(He,N(()=>K(t,["images"])[1]))}})]}function He(t){let[l,m]=z(t.item.span),[p,w]=z(t.item.height);const b=ne({index:t.index,spans:l(),itemHeight:p()});return(()=>{const o=O(Ge),a=o.firstChild,d=a.firstChild,u=d.nextSibling,[S,y]=de(u.nextSibling),v=S.nextSibling,W=v.firstChild,G=W.nextSibling,x=v.nextSibling,h=x.firstChild,$=h.nextSibling,r=x.nextSibling,s=r.nextSibling,f=s.nextSibling,H=f.nextSibling;return ce(o,N(b),!1,!0),a.style.setProperty("width","100%"),a.style.setProperty("background","skyblue"),a.style.setProperty("text-align","center"),a.style.setProperty("display","flex"),a.style.setProperty("flex-direction","column"),a.style.setProperty("align-items","center"),a.style.setProperty("justify-content","center"),ee(a,()=>t.item.name,S,y),G.addEventListener("change",e=>{t.item.span=parseInt(e.currentTarget.value),m(t.item.span)}),G.style.setProperty("width","4em"),$.addEventListener("change",e=>{t.item.height=parseInt(e.currentTarget.value),w(t.item.height)}),$.style.setProperty("width","4em"),r.$$click=()=>t.addNext(t.index()),s.$$click=()=>t.removeMe(t.index()),f.$$click=()=>t.updateMe(t.index(),{...t.item,name:t.item.name+"Updated"}),H.$$click=()=>t.swapWithRandom(t.index()),g(()=>t.item.height+"px"!=null?a.style.setProperty("height",t.item.height+"px"):a.style.removeProperty("height")),g(()=>G.value=l()),g(()=>$.value=p()),ge(),o})()}function _e(t){let{item:l,index:m}=t;return C(ve,{index:m,get spans(){return l.span},style:{transition:"left 0.3s ease,top 0.3s ease","overflow-x":"hidden"},get children(){const p=O(we);return g(()=>me(p,"src","https://picsum.photos/"+l.width+"/"+l.height)),p}})}function Pe(t){return[(()=>{const l=O(ie);return l.style.setProperty("width","100%"),l.style.setProperty("height","3em"),l})(),(()=>{const l=O(xe),m=l.firstChild,p=m.nextSibling,w=p.nextSibling,b=w.nextSibling,o=b.nextSibling,a=o.nextSibling,d=a.firstChild,u=d.nextSibling,S=u.nextSibling,y=a.nextSibling,v=y.nextSibling,W=v.nextSibling,G=W.nextSibling,x=G.nextSibling,h=x.nextSibling,$=h.nextSibling,r=$.nextSibling,s=r.nextSibling,f=s.nextSibling,H=f.nextSibling,e=H.nextSibling;return l.style.setProperty("width","100%"),l.style.setProperty("display","flex"),l.style.setProperty("justify-content","center"),l.style.setProperty("gap","0.75em"),l.style.setProperty("padding","1em 0em"),l.style.setProperty("position","fixed"),l.style.setProperty("top","0"),l.style.setProperty("left","0"),l.style.setProperty("z-index","99"),l.style.setProperty("background","rgba(255,255,255,.3)"),l.style.setProperty("flex-wrap","wrap"),p.addEventListener("change",n=>t.setImages(n.currentTarget.checked)),b.addEventListener("change",n=>t.setMultiSpan(n.currentTarget.checked)),a.addEventListener("change",n=>{t.setAlignment(parseInt(n.currentTarget.value))}),v.addEventListener("change",n=>t.setColumnWidth(parseInt(n.currentTarget.value))),v.style.setProperty("width","4em"),G.addEventListener("change",n=>t.setColumns(parseInt(n.currentTarget.value))),G.style.setProperty("width","4em"),h.addEventListener("change",n=>t.setHorizontalGap(parseInt(n.currentTarget.value))),h.style.setProperty("width","4em"),r.addEventListener("change",n=>t.setVerticalGap(parseInt(n.currentTarget.value))),r.style.setProperty("width","4em"),f.addEventListener("change",n=>t.setFitHorizontalGap(n.currentTarget.checked)),e.addEventListener("change",n=>t.setInfiniteGrid(n.currentTarget.checked)),g(()=>p.checked=t.images()),g(()=>b.checked=t.multiSpan()),g(()=>a.value=t.alignment()),g(()=>d.value=R.Start),g(()=>u.value=R.Center),g(()=>S.value=R.End),g(()=>v.value=t.columnWidth()),g(()=>G.value=t.columns()),g(()=>h.value=t.horizontalGap()),g(()=>r.value=t.verticalGap()),g(()=>f.checked=t.fitHorizontalGap()),g(()=>e.checked=t.infiniteGrid()),l})()]}he(["click"]);function ze(){return C($e,{})}export{ze as default};