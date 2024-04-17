import{a as A,n as G,p as H,u as J,r as D,q as K,s as O,b as I,c as r,d as u,e as c,w as t,f as e,j as l,t as s,i as h,g as L,k as a,h as v,F as S,l as $,v as Q,x as W,m as M,_ as X}from"./index-d3d8deae.js";const Y=a("tr",null,[a("th",{style:{"font-weight":"bold"}},"股票名称"),a("th",{style:{"font-weight":"bold"}},"持有数量"),a("th",{style:{"font-weight":"bold"}},"持有市值")],-1),Z=a("th",null,null,-1),tt=a("tr",null,[a("th",null,"股票名"),a("th",null,"数量"),a("th",null,"开盘价"),a("th",null,"收盘价")],-1),et={__name:"profile",setup(lt){const B=A(),{name:P}=G(),N=H(()=>P.value==="xs"),V=J(),n=D(null);D(null);const m=D(!0),k=K(`${O}/profile`,{auth:{token:localStorage.getItem("token")},transports:["websocket"]});k.on("connect",async()=>{const o=await I.get("/game/get_game_status");o.data.status==="pending"||o.data.status==="settling"?m.value=!0:o.data.status==="running"?(await C(),V.year=o.data.current_year,m.value=!1):o.data.status==="finished"&&await B.push("/result")}),k.on("disconnect",()=>{console.log("socket disconnected"),setTimeout(()=>{k.connect()},5e3)}),k.on("game_status",async o=>{o.status==="pending"||o.status==="settling"?m.value=!0:o.status==="running"?(await C(),m.value=!1):o.status==="finished"&&await B.push("/result")});async function C(){const o=await I.post("/game/profile");n.value=o.data.data,V.profile=o.data.data.current_year}return(o,at)=>{const g=r("v-card-title"),b=r("v-divider"),d=r("v-icon"),i=r("v-list-item-title"),f=r("v-list-item-subtitle"),_=r("v-list-item"),T=r("v-list"),x=r("v-card"),j=r("v-alert"),q=r("v-card-text"),R=r("v-chip"),E=r("v-table"),w=r("v-container"),U=X;return n.value&&!m.value?(u(),c(w,{key:0,fluid:"",class:"fill-height align-content-start"},{default:t(()=>[e(w,null,{default:t(()=>[e(x,null,{default:t(()=>[e(g,null,{default:t(()=>[l(" 账户信息 ")]),_:1}),e(b),e(T,null,{default:t(()=>[e(_,null,{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-cash")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("现金")]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.money.toFixed(2)),1)]),_:1})]),_:1}),e(_,null,{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-bank")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("银行存款")]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.bank.toFixed(2)),1)]),_:1})]),_:1})]),_:1})]),_:1}),e(x,{class:"mt-3"},{default:t(()=>[e(g,null,{default:t(()=>[l("借款")]),_:1}),e(b),n.value.loan?(u(),c(q,{key:0},{default:t(()=>[e(j,{density:"compact",text:"您必须还清之前的借款才能再次借款",icon:"mdi-scale-balance",type:"warning"})]),_:1})):h("",!0),e(T,null,{default:t(()=>[L(N)&&!n.value.loan?(u(),c(_,{key:0},{default:t(()=>[e(j,{density:"compact",text:"借款额度为当年开盘时所持总资产的20%",icon:"mdi-scale-balance",type:"info"})]),_:1})):h("",!0),n.value.loan?(u(),c(_,{key:2},{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-currency-usd")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("您当前借款")]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.loan.loan.toFixed(2)),1)]),_:1})]),_:1})):(u(),c(_,{key:1},{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-currency-usd")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("您今年的借款额度 "),L(N)?h("",!0):(u(),c(R,{key:0},{default:t(()=>[l("当年开盘时所持总资产的20%")]),_:1}))]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.max_loan.toFixed(2)),1)]),_:1})]),_:1})),n.value.loan?(u(),c(_,{key:3},{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-currency-usd")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("借款周期")]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.loan.loan_period),1)]),_:1})]),_:1})):h("",!0),n.value.loan?(u(),c(_,{key:4},{prepend:t(()=>[e(d,{color:"primary"},{default:t(()=>[l("mdi-currency-usd")]),_:1})]),default:t(()=>[e(i,null,{default:t(()=>[l("需要偿还 (本金+利息)")]),_:1}),e(f,null,{default:t(()=>[l(s(n.value.loan.total_amount.toFixed(2)),1)]),_:1})]),_:1})):h("",!0)]),_:1})]),_:1}),e(x,{class:"mt-3"},{default:t(()=>[e(g,null,{default:t(()=>[l("当年持仓")]),_:1}),e(b),e(E,null,{default:t(()=>[a("tbody",null,[Y,(u(!0),v(S,null,$(n.value.current_year_stock,(y,p)=>Q((u(),v("tr",null,[a("td",null,s(p),1),a("td",null,s(y)+" 股",1),a("td",null,"$"+s((y*n.value.current_year_stock_data[p]).toFixed(2)),1)],512)),[[W,y>0]])),256))])]),_:1})]),_:1}),e(x,{class:"mt-3"},{default:t(()=>[e(g,null,{default:t(()=>[l("历史记录")]),_:1}),e(b),n.value.history?(u(),c(E,{key:0},{default:t(()=>[(u(!0),v(S,null,$(n.value.history,(y,p)=>(u(),v("tbody",null,[a("tr",null,[a("th",null,s(p),1),Z]),tt,(u(!0),v(S,null,$(y,(z,F)=>(u(),v("tr",null,[a("td",null,s(F),1),a("td",null,s(z)+" 股",1),a("td",null,"$"+s(n.value.previous_year_stock_data[F][p].open),1),a("td",null,"$"+s(n.value.previous_year_stock_data[F][p].close),1)]))),256))]))),256))]),_:1})):(u(),c(q,{key:1},{default:t(()=>[l(" 暂无数据 ")]),_:1}))]),_:1})]),_:1})]),_:1})):(u(),c(w,{key:1},{default:t(()=>[e(U)]),_:1}))}}};typeof M=="function"&&M(et);export{et as default};
