import{b as M,_ as de}from"./route-block-29b3669d.js";import{e as ue,v as e,f as I,p as S,h as U,i as B,j as G,k as F,I as W,m as se,l as ie,n as ce,o as R,L as fe,V as H,q as me,s as D,t as ve,w as q,x as z,y as ge,z as pe,A as he,B as ye,C as be,D as xe,E as _e,F as we,G as Ve,_ as ke,u as Ne,c as j,b as Se,d as Ce,R as Pe}from"./app-fd32fea5.js";const $=ue({align:{type:String,default:"start"},fixed:Boolean,fixedOffset:[Number,String],height:[Number,String],lastFixed:Boolean,noPadding:Boolean,tag:String,width:[Number,String]},(t,o)=>{let{slots:n,attrs:a}=o;const r=t.tag??"td";return e.createVNode(r,e.mergeProps({class:["v-data-table__td",{"v-data-table-column--fixed":t.fixed,"v-data-table-column--last-fixed":t.lastFixed,"v-data-table-column--no-padding":t.noPadding},`v-data-table-column--align-${t.align}`],style:{height:I(t.height),width:I(t.width),left:I(t.fixedOffset||null)}},a),{default:()=>{var i;return[(i=n.default)==null?void 0:i.call(n)]}})}),Te=S({headers:{type:Array,default:()=>[]}},"v-data-table-header"),K=Symbol.for("vuetify:data-table-headers");function De(t,o){const n=e.ref([]),a=e.ref([]);e.watch(()=>t.headers,()=>{var y,b,x;const i=t.headers.length?Array.isArray(t.headers[0])?t.headers:[t.headers]:[],d=i.flatMap((v,c)=>v.map(h=>({column:h,row:c}))),s=i.length,u={title:"",sortable:!1},f={...u,width:48};if((y=o==null?void 0:o.groupBy)!=null&&y.value.length){const v=d.findIndex(c=>{let{column:h}=c;return h.key==="data-table-group"});v<0?d.unshift({column:{...u,key:"data-table-group",title:"Group",rowspan:s},row:0}):d.splice(v,1,{column:{...u,...d[v].column},row:d[v].row})}if((b=o==null?void 0:o.showSelect)!=null&&b.value){const v=d.findIndex(c=>{let{column:h}=c;return h.key==="data-table-select"});v<0?d.unshift({column:{...f,key:"data-table-select",rowspan:s},row:0}):d.splice(v,1,{column:{...f,...d[v].column},row:d[v].row})}if((x=o==null?void 0:o.showExpand)!=null&&x.value){const v=d.findIndex(c=>{let{column:h}=c;return h.key==="data-table-expand"});v<0?d.push({column:{...f,key:"data-table-expand",rowspan:s},row:0}):d.splice(v,1,{column:{...f,...d[v].column},row:d[v].row})}const l=U(s).map(()=>[]),m=U(s).fill(0);let g=0;d.forEach(v=>{let{column:c,row:h}=v;const V=c.key??`data-table-column-${g++}`;for(let w=h;w<=h+(c.rowspan??1)-1;w++)l[w].push({...c,key:V,fixedOffset:m[w],sortable:c.sortable??!!c.key}),m[w]+=c.width??0}),l.forEach(v=>{for(let c=v.length;c--;c>=0)if(v[c].fixed){v[c].lastFixed=!0;return}});const p=new Set;n.value=l.map(v=>{const c=[];for(const h of v)p.has(h.key)||(p.add(h.key),c.push(h));return c}),a.value=l.at(-1)??[]},{deep:!0,immediate:!0});const r={headers:n,columns:a};return e.provide(K,r),r}function O(){const t=e.inject(K);if(!t)throw new Error("Missing headers!");return t}const Ie=S({showSelect:Boolean,modelValue:{type:Array,default:()=>[]}},"v-data-table-select"),J=Symbol.for("vuetify:data-table-selection");function Be(t,o){const n=B(t,"modelValue",t.modelValue,m=>new Set(m),m=>[...m.values()]);function a(m){return m.every(g=>n.value.has(g.value))}function r(m){return m.some(g=>n.value.has(g.value))}function i(m,g){const p=new Set(n.value);for(const y of m)g?p.add(y.value):p.delete(y.value);n.value=p}function d(m){i([m],!a([m]))}function s(m){i(o.value,m)}const u=e.computed(()=>n.value.size>0),f=e.computed(()=>a(o.value)),l={toggleSelect:d,select:i,selectAll:s,isSelected:a,isSomeSelected:r,someSelected:u,allSelected:f};return e.provide(J,l),l}function A(){const t=e.inject(J);if(!t)throw new Error("Missing selection!");return t}const Ee=S({sortBy:{type:Array,default:()=>[]},multiSort:Boolean,mustSort:Boolean},"v-data-table-sort"),Q=Symbol.for("vuetify:data-table-sort");function Fe(t){const o=B(t,"sortBy"),n=e.toRef(t,"mustSort"),a=e.toRef(t,"multiSort");return{sortBy:o,mustSort:n,multiSort:a}}function $e(t){const{sortBy:o,mustSort:n,multiSort:a,page:r}=t,d={sortBy:o,toggleSort:s=>{let u=o.value.map(l=>({...l}))??[];const f=u.find(l=>l.key===s);f?f.order==="desc"?n.value?f.order="asc":u=u.filter(l=>l.key!==s):f.order="desc":a.value?u=[...u,{key:s,order:"asc"}]:u=[{key:s,order:"asc"}],o.value=u,r&&(r.value=1)}};return e.provide(Q,d),d}function Re(){const t=e.inject(Q);if(!t)throw new Error("Missing sort!");return t}function Oe(t,o,n){const a=e.computed(()=>n.value.reduce((i,d)=>(d.sort&&(i[d.key]=d.sort),i),{}));return{sortedItems:e.computed(()=>o.value.length?Ae(t.value,o.value,"en",a.value):t.value)}}function Ae(t,o,n,a){const r=new Intl.Collator(n,{sensitivity:"accent",usage:"sort"});return[...t].sort((i,d)=>{for(let s=0;s<o.length;s++){const u=o[s].key,f=o[s].order;if(f===!1)continue;let l=G(i.raw,u),m=G(d.raw,u);if(f==="desc"&&([l,m]=[m,l]),a!=null&&a[u]){const g=a[u](l,m);if(!g)continue;return g}if(!(l==null||m==null)){if(l instanceof Date&&m instanceof Date)return l.getTime()-m.getTime();if([l,m]=[l,m].map(g=>(g||"").toString().toLocaleLowerCase()),l!==m)return!isNaN(l)&&!isNaN(m)?Number(l)-Number(m):r.compare(l,m)}}return 0})}const Le=F()({name:"VDataTableHeaders",props:{color:String,sticky:Boolean,multiSort:Boolean,sortAscIcon:{type:W,default:"$sortAsc"},sortDescIcon:{type:W,default:"$sortDesc"},...se()},setup(t,o){let{slots:n,emit:a}=o;const{toggleSort:r,sortBy:i}=Re(),{someSelected:d,allSelected:s,selectAll:u}=A(),{columns:f,headers:l}=O(),{loaderClasses:m}=ie(t),g=(v,c)=>!t.sticky&&!v.fixed?null:{position:"sticky",zIndex:v.fixed?4:t.sticky?3:void 0,left:v.fixed?I(v.fixedOffset):void 0,top:t.sticky?`calc(var(--v-table-header-height) * ${c})`:void 0};function p(v){const c=i.value.find(h=>h.key===v);return c?c.order==="asc"?t.sortAscIcon:t.sortDescIcon:t.sortAscIcon}const{backgroundColorClasses:y,backgroundColorStyles:b}=ce(t,"color"),x=v=>{let{column:c,x:h,y:V}=v;const w=!!i.value.find(N=>N.key===c.key),E=c.key==="data-table-select"||c.key==="data-table-expand";return e.createVNode($,{tag:"th",align:c.align,class:["v-data-table__th",{"v-data-table__th--sortable":c.sortable,"v-data-table__th--sorted":w},m.value],style:{width:I(c.width),minWidth:I(c.width),...g(c,V)},colspan:c.colspan,rowspan:c.rowspan,onClick:c.sortable?()=>r(c.key):void 0,lastFixed:c.lastFixed,noPadding:E},{default:()=>{var k;const N=`column.${c.key}`,C={column:c,selectAll:u};return n[N]?n[N](C):c.key==="data-table-select"?((k=n["column.data-table-select"])==null?void 0:k.call(n,C))??e.createVNode(H,{modelValue:s.value,indeterminate:d.value&&!s.value,"onUpdate:modelValue":u},null):e.createVNode("div",{class:"v-data-table-header__content"},[e.createVNode("span",null,[c.title]),c.sortable&&e.createVNode(me,{key:"icon",class:"v-data-table-header__sort-icon",icon:p(c.key)},null),t.multiSort&&w&&e.createVNode("div",{key:"badge",class:["v-data-table-header__sort-badge",...y.value],style:b.value},[i.value.findIndex(T=>T.key===c.key)+1])])}})};R(()=>e.createVNode(e.Fragment,null,[l.value.map((v,c)=>e.createVNode("tr",null,[v.map((h,V)=>e.createVNode(x,{column:h,x:V,y:c},null))])),t.loading&&e.createVNode("tr",{class:"v-data-table__progress"},[e.createVNode("th",{colspan:f.value.length},[e.createVNode(fe,{name:"v-data-table-headers",active:!0,color:typeof t.loading=="boolean"?void 0:t.loading,indeterminate:!0},{default:n.loader})])])]))}}),Ge=S({groupBy:{type:Array,default:()=>[]}},"data-table-group"),X=Symbol.for("vuetify:data-table-group");function He(t){return{groupBy:B(t,"groupBy")}}function Me(t){const{groupBy:o,sortBy:n}=t,a=e.ref(new Set),r=e.computed(()=>o.value.map(f=>({...f,order:f.order??!1})).concat(n.value));function i(f){return a.value.has(f.id)}function d(f){const l=new Set(a.value);i(f)?l.delete(f.id):l.add(f.id),a.value=l}function s(f){function l(m){const g=[];for(const p of m.items)p.type==="item"?g.push(p):g.push(...l(p));return g}return l({type:"group-header",items:f,id:"dummy",key:"dummy",value:"dummy",depth:0})}const u={sortByWithGroups:r,toggleGroup:d,opened:a,groupBy:o,extractRows:s,isGroupOpen:i};return e.provide(X,u),u}function Y(){const t=e.inject(X);if(!t)throw new Error("Missing group!");return t}function Ue(t,o){if(!t.length)return[];const n=new Map;for(const a of t){const r=G(a.raw,o);n.has(r)||n.set(r,[]),n.get(r).push(a)}return n}function Z(t,o){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,a=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"root";if(!o.length)return[];const r=Ue(t,o[0]),i=[],d=o.slice(1);return r.forEach((s,u)=>{const f=o[0],l=`${a}_${f}_${u}`;i.push({depth:n,id:l,key:f,value:u,items:d.length?Z(s,d,n+1,l):s,type:"group-header"})}),i}function ee(t,o){const n=[];for(const a of t)a.type==="group-header"?(a.value!=null&&n.push(a),(o.has(a.id)||a.value==null)&&n.push(...ee(a.items,o))):n.push(a);return n}function We(t,o,n){return{flatItems:e.computed(()=>{if(!o.value.length)return t.value;const r=Z(t.value,o.value.map(i=>i.key));return ee(r,n.value)})}}const je=F()({name:"VDataTableGroupHeaderRow",props:{item:{type:Object,required:!0}},setup(t,o){let{slots:n}=o;const{isGroupOpen:a,toggleGroup:r,extractRows:i}=Y(),{isSelected:d,isSomeSelected:s,select:u}=A(),{columns:f}=O(),l=e.computed(()=>i([t.item]));return()=>e.createVNode("tr",{class:"v-data-table-group-header-row",style:{"--v-data-table-group-header-row-depth":t.item.depth}},[f.value.map(m=>{var g,p;if(m.key==="data-table-group"){const y=a(t.item)?"$expand":"$next",b=()=>r(t.item);return((g=n["data-table-group"])==null?void 0:g.call(n,{item:t.item,count:l.value.length,props:{icon:y,onClick:b}}))??e.createVNode($,{class:"v-data-table-group-header-row__column"},{default:()=>[e.createVNode(D,{size:"small",variant:"text",icon:y,onClick:b},null),e.createVNode("span",null,[t.item.value]),e.createVNode("span",null,[e.createTextVNode("("),l.value.length,e.createTextVNode(")")])]})}if(m.key==="data-table-select"){const y=d(l.value),b=s(l.value)&&!y,x=v=>u(l.value,v);return((p=n["data-table-select"])==null?void 0:p.call(n,{props:{modelValue:y,indeterminate:b,"onUpdate:modelValue":x}}))??e.createVNode("td",null,[e.createVNode(H,{modelValue:y,indeterminate:b,"onUpdate:modelValue":x},null)])}return e.createVNode("td",null,null)})])}}),qe=S({expandOnClick:Boolean,showExpand:Boolean,expanded:{type:Array,default:()=>[]}},"v-data-table-expand"),te=Symbol.for("vuetify:datatable:expanded");function ze(t){const o=e.toRef(t,"expandOnClick"),n=B(t,"expanded",t.expanded,s=>new Set(s),s=>[...s.values()]);function a(s,u){const f=new Set(n.value);u?f.add(s.value):f.delete(s.value),n.value=f}function r(s){return n.value.has(s.value)}function i(s){a(s,!r(s))}const d={expand:a,expanded:n,expandOnClick:o,isExpanded:r,toggleExpand:i};return e.provide(te,d),d}function ae(){const t=e.inject(te);if(!t)throw new Error("foo");return t}const L=ve({name:"VDataTableRow",props:{index:Number,item:Object,onClick:Function},setup(t,o){let{slots:n}=o;const{isSelected:a,toggleSelect:r}=A(),{isExpanded:i,toggleExpand:d}=ae(),{columns:s}=O();R(()=>e.createVNode("tr",{class:["v-data-table__tr",{"v-data-table__tr--clickable":!!t.onClick}],onClick:t.onClick},[!s.value.length&&e.createVNode($,{key:"no-data"},n),t.item&&s.value.map((u,f)=>e.createVNode($,{align:u.align,fixed:u.fixed,fixedOffset:u.fixedOffset,lastFixed:u.lastFixed,noPadding:u.key==="data-table-select"||u.key==="data-table-expand",width:u.width},{default:()=>{var p,y;const l=t.item,m=`item.${u.key}`,g={index:t.index,item:t.item,columns:s.value,isSelected:a,toggleSelect:r,isExpanded:i,toggleExpand:d};return n[m]?n[m](g):u.key==="data-table-select"?((p=n["item.data-table-select"])==null?void 0:p.call(n,g))??e.createVNode(H,{modelValue:a([l]),onClick:e.withModifiers(()=>r(l),["stop"])},null):u.key==="data-table-expand"?((y=n["item.data-table-expand"])==null?void 0:y.call(n,g))??e.createVNode(D,{icon:i(l)?"$collapse":"$expand",size:"small",variant:"text",onClick:e.withModifiers(()=>d(l),["stop"])},null):q(l.columns,u.key)}}))]))}}),Ke=F()({name:"VDataTableRows",props:{loading:[Boolean,String],loadingText:{type:String,default:"$vuetify.dataIterator.loadingText"},hideNoData:Boolean,items:{type:Array,default:()=>[]},noDataText:{type:String,default:"$vuetify.noDataText"},rowHeight:Number},emits:{"click:row":(t,o)=>!0},setup(t,o){let{emit:n,slots:a}=o;const{columns:r}=O(),{expandOnClick:i,toggleExpand:d,isExpanded:s}=ae(),{isSelected:u,toggleSelect:f}=A(),{toggleGroup:l,isGroupOpen:m}=Y(),{t:g}=z();return R(()=>{var p,y;return e.createVNode(e.Fragment,null,[t.loading?((p=a.loading)==null?void 0:p.call(a))??e.createVNode(L,{class:"v-data-table-rows-no-data",key:"loading"},{default:()=>[g(t.loadingText)]}):void 0,!t.loading&&!t.items.length&&!t.hideNoData&&(((y=a["no-data"])==null?void 0:y.call(a))??e.createVNode(L,{class:"v-data-table-rows-no-data",key:"no-data"},{default:()=>[g(t.noDataText)]})),t.items.map((b,x)=>{var c;if(b.type==="group-header")return a["group-header"]?a["group-header"]({index:x,item:b,columns:r.value,isExpanded:s,toggleExpand:d,isSelected:u,toggleSelect:f,toggleGroup:l,isGroupOpen:m}):e.createVNode(je,{key:`group-header_${b.id}`,item:b},a);const v={index:x,item:b,columns:r.value,isExpanded:s,toggleExpand:d,isSelected:u,toggleSelect:f};return e.createVNode(e.Fragment,null,[a.item?a.item(v):e.createVNode(L,{key:`item_${b.value}`,onClick:h=>{i.value&&d(b),n("click:row",h,{item:b})},index:x,item:b},a),s(b)&&((c=a["expanded-row"])==null?void 0:c.call(a,v))])})])}),{}}});const Je=S({page:{type:[Number,String],default:1},itemsPerPage:{type:[Number,String],default:10}},"v-data-table-paginate"),ne=Symbol.for("vuetify:data-table-pagination");function Qe(t){const o=B(t,"page",void 0,a=>+(a??1)),n=B(t,"itemsPerPage",void 0,a=>+(a??10));return{page:o,itemsPerPage:n}}function Xe(t){const{page:o,itemsPerPage:n,itemsLength:a}=t,r=e.computed(()=>n.value===-1?0:n.value*(o.value-1)),i=e.computed(()=>n.value===-1?a.value:Math.min(a.value,r.value+n.value)),d=e.computed(()=>n.value===-1||a.value===0?1:Math.ceil(a.value/n.value));function s(f){n.value=f,o.value=1}const u={page:o,itemsPerPage:n,itemsLength:a,startIndex:r,stopIndex:i,pageCount:d,setItemsPerPage:s};return e.provide(ne,u),u}function Ye(){const t=e.inject(ne);if(!t)throw new Error("Missing pagination!");return t}function Ze(t){const{items:o,startIndex:n,stopIndex:a,itemsPerPage:r}=t;return{paginatedItems:e.computed(()=>r.value<=0?o.value:o.value.slice(n.value,a.value))}}const et=F()({name:"VDataTableFooter",props:{prevIcon:{type:String,default:"$prev"},nextIcon:{type:String,default:"$next"},firstIcon:{type:String,default:"$first"},lastIcon:{type:String,default:"$last"},itemsPerPageText:{type:String,default:"$vuetify.dataFooter.itemsPerPageText"},pageText:{type:String,default:"$vuetify.dataFooter.pageText"},firstPageLabel:{type:String,default:"$vuetify.dataFooter.firstPage"},prevPageLabel:{type:String,default:"$vuetify.dataFooter.prevPage"},nextPageLabel:{type:String,default:"$vuetify.dataFooter.nextPage"},lastPageLabel:{type:String,default:"$vuetify.dataFooter.lastPage"},itemsPerPageOptions:{type:Array,default:()=>[{value:10,title:"10"},{value:25,title:"25"},{value:50,title:"50"},{value:100,title:"100"},{value:-1,title:"$vuetify.dataFooter.itemsPerPageAll"}]},showCurrentPage:Boolean},setup(t,o){let{slots:n}=o;const{t:a}=z(),{page:r,pageCount:i,startIndex:d,stopIndex:s,itemsLength:u,itemsPerPage:f,setItemsPerPage:l}=Ye(),m=e.computed(()=>t.itemsPerPageOptions.map(g=>({...g,title:a(g.title)})));return()=>{var g;return e.createVNode("div",{class:"v-data-table-footer"},[(g=n.prepend)==null?void 0:g.call(n),e.createVNode("div",{class:"v-data-table-footer__items-per-page"},[e.createVNode("span",null,[a(t.itemsPerPageText)]),e.createVNode(ge,{items:m.value,modelValue:f.value,"onUpdate:modelValue":p=>l(Number(p)),density:"compact",variant:"outlined","hide-details":!0},null)]),e.createVNode("div",{class:"v-data-table-footer__info"},[e.createVNode("div",null,[a(t.pageText,u.value?d.value+1:0,s.value,u.value)])]),e.createVNode("div",{class:"v-data-table-footer__pagination"},[e.createVNode(D,{icon:t.firstIcon,variant:"plain",onClick:()=>r.value=1,disabled:r.value===1,"aria-label":a(t.firstPageLabel)},null),e.createVNode(D,{icon:t.prevIcon,variant:"plain",onClick:()=>r.value=Math.max(1,r.value-1),disabled:r.value===1,"aria-label":a(t.prevPageLabel)},null),t.showCurrentPage&&e.createVNode("span",{key:"page",class:"v-data-table-footer__page"},[r.value]),e.createVNode(D,{icon:t.nextIcon,variant:"plain",onClick:()=>r.value=Math.min(i.value,r.value+1),disabled:r.value===i.value,"aria-label":a(t.nextPageLabel)},null),e.createVNode(D,{icon:t.lastIcon,variant:"plain",onClick:()=>r.value=i.value,disabled:r.value===i.value,"aria-label":a(t.lastPageLabel)},null)])])}}}),tt=S({...pe({itemValue:"id"})},"v-data-table-item");function at(t,o,n){const a=o.split(".");for(;a.length>1;){const r=a.shift();t[r]==null&&(t[r]={}),typeof t[r]=="object"&&(t=t[r])}t[a[0]]=n}function nt(t,o){const{items:n}=he(t);return{items:e.computed(()=>n.value.map(r=>({...r,type:"item",columns:o.value.reduce((i,d)=>(at(i,d.key,q(r.raw,d.value??d.key)),i),{})})))}}function ot(t){let{page:o,itemsPerPage:n,sortBy:a,groupBy:r,search:i}=t;const d=ye("VDataTable"),s=e.computed(()=>({page:o.value,itemsPerPage:n.value,sortBy:a.value,groupBy:r.value}));e.watch(()=>i==null?void 0:i.value,()=>{o.value=1});let u=null;e.watch(s,()=>{be(u,s.value)||(d.emit("update:options",s.value),u=s.value)},{deep:!0,immediate:!0})}const lt=S({...tt(),...Te(),hideNoData:Boolean,hover:Boolean,noDataText:{type:String,default:"$vuetify.noDataText"},height:[String,Number],width:[String,Number],fixedHeader:Boolean,fixedFooter:Boolean},"v-data-table"),rt=F()({name:"VDataTable",props:{search:String,...lt(),...qe(),...Ge(),...Ie(),...Ee(),...Je(),...xe()},emits:{"update:modelValue":t=>!0,"update:page":t=>!0,"update:itemsPerPage":t=>!0,"update:sortBy":t=>!0,"update:options":t=>!0,"update:groupBy":t=>!0,"update:expanded":t=>!0,"click:row":(t,o)=>!0},setup(t,o){let{emit:n,slots:a}=o;const{groupBy:r}=He(t),{sortBy:i,multiSort:d,mustSort:s}=Fe(t),{page:u,itemsPerPage:f}=Qe(t),{columns:l}=De(t,{groupBy:r,showSelect:e.toRef(t,"showSelect"),showExpand:e.toRef(t,"showExpand")}),{items:m}=nt(t,l),g=e.computed(()=>l.value.map(k=>"columns."+k.key)),p=e.toRef(t,"search"),{filteredItems:y}=_e(t,m,p,{filterKeys:g});$e({sortBy:i,multiSort:d,mustSort:s,page:u});const{sortByWithGroups:b,opened:x,extractRows:v}=Me({groupBy:r,sortBy:i}),{sortedItems:c}=Oe(y,b,l),{flatItems:h}=We(c,r,x),V=e.computed(()=>h.value.length),{startIndex:w,stopIndex:E}=Xe({page:u,itemsPerPage:f,itemsLength:V}),{paginatedItems:N}=Ze({items:h,startIndex:w,stopIndex:E,itemsPerPage:f}),C=e.computed(()=>v(N.value));return Be(t,C),ze(t),ot({page:u,itemsPerPage:f,sortBy:i,groupBy:r,search:p}),we({VDataTableRows:{hideNoData:e.toRef(t,"hideNoData"),noDataText:e.toRef(t,"noDataText")}}),R(()=>e.createVNode(Ve,{class:["v-data-table",{"v-data-table--show-select":t.showSelect}],fixedHeader:t.fixedHeader,fixedFooter:t.fixedFooter,height:t.height,hover:t.hover},{top:a.top,default:a.default??(()=>{var k,T,_,P;return e.createVNode(e.Fragment,null,[(k=a.colgroup)==null?void 0:k.call(a,{columns:l}),e.createVNode("thead",null,[a.headers?a.headers():e.createVNode(Le,{sticky:t.fixedHeader,multiSort:t.multiSort},a)]),(T=a.thead)==null?void 0:T.call(a),e.createVNode("tbody",null,[a.body?a.body():e.createVNode(Ke,{items:N.value,"onClick:row":(le,re)=>n("click:row",le,re)},a)]),(_=a.tbody)==null?void 0:_.call(a),(P=a.tfoot)==null?void 0:P.call(a)])}),bottom:a.bottom??(()=>e.createVNode(et,null,{prepend:a["footer.prepend"]}))})),{}}}),dt={class:"font-weight-bold"},ut=e.createElementVNode("div",{class:"font-weight-bold"},"前价",-1),st=e.createElementVNode("div",{class:"font-weight-bold"},"现价",-1),it=e.createElementVNode("div",{class:"font-weight-bold"},"涨幅",-1),ct=e.createElementVNode("span",null,"市场行情",-1),ft=e.createElementVNode("span",null,"排名",-1),oe={__name:"admin",setup(t){const o=e.ref("1"),n=Ne(),a=e.ref(null);function r(){const f=Se();a.value=new WebSocket(`ws://${Ce}/api/user/rank/ws?token=${f}`),a.value.onopen=()=>{a.value.send("request_latest_data"),setInterval(()=>{a.value.send("request_latest_data")},2e3)},a.value.onmessage=l=>{if(l.data==="update_data"){a.value.send("request_latest_data");return}const m=JSON.parse(l.data);Object.assign(n.adminRankData,m.data)},a.value.onclose=l=>{console.log("WebSocket closed:",l),setTimeout(j,Pe)},a.value.onerror=l=>{console.error("WebSocket Error:",l)}}const i=e.ref([{key:"total_funds",order:"desc"}]),d=e.ref(""),s=[{title:"排名",key:"rank",sortable:!1},{title:"用户名",align:"start",sortable:!1,key:"username"},{title:"资产总额",key:"total_funds"},{title:"现金",key:"balance"},{title:"持仓",key:"total_position"}],u=e.computed(()=>n.adminRankData.map(f=>({...f,total_funds:parseFloat(f.total_funds).toFixed(2),balance:parseFloat(f.balance).toFixed(2),total_position:parseFloat(f.total_position).toFixed(2)})));return e.onMounted(()=>{j(),r()}),(f,l)=>{const m=de,g=e.resolveComponent("v-card-title"),p=e.resolveComponent("v-list-item-title"),y=e.resolveComponent("v-list-item"),b=e.resolveComponent("v-list"),x=e.resolveComponent("v-card"),v=e.resolveComponent("v-col"),c=e.resolveComponent("v-row"),h=e.resolveComponent("v-container"),V=e.resolveComponent("v-window-item"),w=e.resolveComponent("v-spacer"),E=e.resolveComponent("v-text-field"),N=e.resolveComponent("v-window"),C=e.resolveComponent("v-icon"),k=e.resolveComponent("v-btn"),T=e.resolveComponent("v-bottom-navigation");return e.openBlock(),e.createBlock(h,null,{default:e.withCtx(()=>[e.createVNode(N,{modelValue:e.unref(o),"onUpdate:modelValue":l[2]||(l[2]=_=>e.isRef(o)?o.value=_:null)},{default:e.withCtx(()=>[e.createVNode(V,{value:"1"},{default:e.withCtx(()=>[e.createVNode(h,null,{default:e.withCtx(()=>[e.createVNode(m),e.createVNode(c,{class:"overflow-y-auto h-100"},{default:e.withCtx(()=>[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(e.unref(n).stock_data,(_,P)=>(e.openBlock(),e.createBlock(v,{cols:"12",md:"4",key:P},{default:e.withCtx(()=>[e.createVNode(x,null,{default:e.withCtx(()=>[e.createVNode(g,null,{default:e.withCtx(()=>[e.createElementVNode("div",dt,e.toDisplayString(P),1)]),_:2},1024),e.createVNode(b,null,{default:e.withCtx(()=>[e.createVNode(y,null,{default:e.withCtx(()=>[e.createVNode(p,{class:"d-flex justify-space-between"},{default:e.withCtx(()=>[ut,e.createElementVNode("div",null,e.toDisplayString(_.previous),1)]),_:2},1024)]),_:2},1024),e.createVNode(y,null,{default:e.withCtx(()=>[e.createVNode(p,{class:"d-flex justify-space-between"},{default:e.withCtx(()=>[st,e.createElementVNode("div",null,e.toDisplayString(_.now),1)]),_:2},1024)]),_:2},1024),e.createVNode(y,null,{default:e.withCtx(()=>[e.createVNode(p,{class:"d-flex justify-space-between"},{default:e.withCtx(()=>[it,e.createElementVNode("div",null,e.toDisplayString(_.change),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1}),e.createVNode(V,{value:"2"},{default:e.withCtx(()=>[e.createVNode(h,null,{default:e.withCtx(()=>[e.createVNode(x,null,{default:e.withCtx(()=>[e.createVNode(g,null,{default:e.withCtx(()=>[e.createVNode(w),e.createVNode(E,{modelValue:e.unref(d),"onUpdate:modelValue":l[0]||(l[0]=_=>e.isRef(d)?d.value=_:null),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),e.createVNode(e.unref(rt),{"sort-by":e.unref(i),"onUpdate:sortBy":l[1]||(l[1]=_=>e.isRef(i)?i.value=_:null),headers:s,"items-per-page":"20",items:e.unref(u),search:e.unref(d)},{"item.rank":e.withCtx(({item:_,index:P})=>[e.createTextVNode(e.toDisplayString(P+1),1)]),_:1},8,["sort-by","items","search"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e.createVNode(T,{grow:""},{default:e.withCtx(()=>[e.createVNode(k,{onClick:l[3]||(l[3]=_=>o.value="1")},{default:e.withCtx(()=>[e.createVNode(C,null,{default:e.withCtx(()=>[e.createTextVNode("mdi-store-clock-outline")]),_:1}),ct]),_:1}),e.createVNode(k,{onClick:l[4]||(l[4]=_=>o.value="2")},{default:e.withCtx(()=>[e.createVNode(C,null,{default:e.withCtx(()=>[e.createTextVNode("mdi-chart-bell-curve-cumulative")]),_:1}),ft]),_:1})]),_:1})]),_:1})}}};typeof M=="function"&&M(oe);const gt=ke(oe,[["__file","/home/runner/work/garden_party_stock_game/garden_party_stock_game/src/pages/admin.vue"]]);export{gt as default};
