import{u as X,a as Y,r as F,n as Z,p as ee,b as p,c as i,d as c,e as v,w as l,f as a,j as o,t as _,C as ae,k as g,m as R,_ as le}from"./index-6728f951.js";const te=g("span",{class:"text-h6"},"存入",-1),ne={class:"pe-4"},ue=g("span",{class:"text-h6"},"取出",-1),oe={class:"pe-4"},se=g("span",{class:"text-h6"},"借款",-1),re={class:"pe-4"},ie=g("span",{class:"text-h6"},"还款",-1),de={class:"pe-4"},ce={__name:"bank",setup(ve){const U=X(),I=Y(),u=F({deposit:!1,withdraw:!1,loan:!1,repay:!1}),N=F(!0),C=Z(`${ee}/bank`,{auth:{token:localStorage.getItem("token")},transports:["websocket"]});C.on("connect",async()=>{await G()}),C.on("disconnect",()=>{console.log("socket disconnected"),setTimeout(()=>{C.connect()},5e3)}),C.on("game_status",async t=>{t.status==="pending"||t.status==="settling"?(N.value=!0,u.value.deposit=!1,u.value.withdraw=!1,u.value.loan=!1,u.value.repay=!1):t.status==="running"?(U.year=t.current_year,N.value=!1):t.status==="finished"&&await I.push("/result")});async function G(){const t=await p.get("/game/get_game_status");t.data.status==="pending"||t.data.status==="settling"?(N.value=!0,u.value.deposit=!1,u.value.withdraw=!1,u.value.loan=!1,u.value.repay=!1):t.data.status==="running"?(U.year=t.data.current_year,N.value=!1):t.data.status==="finished"&&await I.push("/result")}async function L(){u.value.deposit=!0,e.value.loading=!0,e.value.money=0,e.value.requesting=!1,e.value.exchangeNumber=0,e.value.maxExchangeNumber=0;const t=await p.post("/user/money");if(t.data.status==="error"){e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,u.value.buy=!1;return}e.value.money=t.data.money,e.value.maxExchangeNumber=t.data.money,e.value.loading=!1}async function P(){u.value.withdraw=!0,e.value.loading=!0,e.value.money=0,e.value.requesting=!1,e.value.exchangeNumber=0,e.value.maxExchangeNumber=0;const t=await p.post("/user/bank");if(t.data.status==="error"){e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,u.value.buy=!1;return}e.value.money=t.data.money,e.value.maxExchangeNumber=t.data.money,e.value.loading=!1}async function W(){u.value.loan=!0,e.value.loading=!0,e.value.money=0,e.value.warningText="",e.value.requesting=!1,e.value.exchangeNumber=0,e.value.maxExchangeNumber=0;const t=await p.post("/user/loan/max");if(console.log(t),t.data.status==="error"){e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,u.value.buy=!1;return}else if(t.data.status==="warning"){e.value.warningText=t.data.message,e.value.loading=!1;return}e.value.money=t.data.max_loan,e.value.maxExchangeNumber=t.data.max_loan,e.value.loading=!1}async function A(){u.value.repay=!0,e.value.loading=!0,e.value.warningText="",e.value.requesting=!1,e.value.total=0,e.value.money=0,e.value.period=0,e.value.interest=0,u.value.buy=!0;const t=await p.post("/user/repay/info");if(console.log(t),t.data.status==="error"){e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,u.value.buy=!1;return}else if(t.data.status==="warning"){e.value.warningText=t.data.message,e.value.loading=!1;return}e.value.total=t.data.total,e.value.period=t.data.period,e.value.interest=t.data.interest,e.value.money=t.data.loan,e.value.loading=!1}async function H(){e.value.requesting=!0;try{if((await p.post("/user/deposit",{money:e.value.exchangeNumber})).data.status==="success"){u.value.deposit=!1,e.value.requesting=!1;return}}catch(t){console.log(t)}e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,e.value.requesting=!1}async function J(){e.value.requesting=!0;try{if((await p.post("/user/withdraw",{money:e.value.exchangeNumber})).data.status==="success"){u.value.withdraw=!1,e.value.requesting=!1;return}}catch(t){console.log(t)}e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,e.value.requesting=!1}async function K(){e.value.requesting=!0;try{if((await p.post("/user/loan",{money:e.value.exchangeNumber,year:U.year})).data.status==="success"){u.value.loan=!1,e.value.requesting=!1;return}}catch(t){console.log(t)}e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,e.value.requesting=!1}async function M(){e.value.requesting=!0;try{if((await p.post("/user/repay")).data.status==="success"){u.value.repay=!1,e.value.requesting=!1;return}}catch(t){console.log(t)}e.value.text="网络波动，请稍后再试",e.value.snackbar=!0,e.value.requesting=!1}const e=F({loading:!0,snackbar:!1,text:"",valid:!1,money:0,maxExchangeNumber:0,exchangeNumber:0,requesting:!1,hold:0,warningText:"",total:0,period:0,interest:0}),T=[t=>!!t||"必填",t=>/^([1-9]\d*|0)(\.\d{1,2})?$/.test(t)||"请输入有效数字"];return(t,n)=>{const d=i("v-btn"),O=i("v-snackbar"),f=i("v-icon"),V=i("v-chip"),r=i("v-col"),k=i("v-row"),x=i("v-card-text"),y=i("v-spacer"),b=i("v-card-actions"),m=i("v-card"),q=i("v-dialog"),h=i("v-divider"),$=i("v-progress-circular"),E=i("v-list-item"),z=i("v-list"),w=i("v-card-title"),j=i("v-text-field"),S=i("v-form"),B=i("v-alert"),D=i("v-container"),Q=le;return N.value?(c(),v(D,{key:1},{default:l(()=>[a(Q)]),_:1})):(c(),v(D,{key:0,fluid:"",class:"fill-height align-content-start"},{default:l(()=>[a(O,{modelValue:e.value.snackbar,"onUpdate:modelValue":n[1]||(n[1]=s=>e.value.snackbar=s)},{actions:l(()=>[a(d,{color:"pink",variant:"text",onClick:n[0]||(n[0]=s=>e.value.snackbar=!1)},{default:l(()=>[o(" 关闭 ")]),_:1})]),default:l(()=>[o(_(e.value.text)+" ",1)]),_:1},8,["modelValue"]),a(D,{class:"fill-height d-flex align-center justify-center w-100 text-center flex-column"},{default:l(()=>[a(f,{size:"150"},{default:l(()=>[o("mdi-bank")]),_:1}),a(q,{"max-width":"450"},{activator:l(({props:s})=>[a(d,ae(s,{color:"surface-variant","prepend-icon":"mdi-information",text:"重要信息",variant:"outlined"}),null,16)]),default:l(({isActive:s})=>[a(m,{title:"银行信息"},{default:l(()=>[a(x,null,{default:l(()=>[a(k,null,{default:l(()=>[a(r,{cols:"12"},{default:l(()=>[o(" 借款利率: "),a(V,{color:"error"},{default:l(()=>[o("2.0%")]),_:1})]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 借款利息计算公式: ")]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 存款利率: "),a(V,{color:"success"},{default:l(()=>[o("1.5%")]),_:1})]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 存款利息计算公式: ")]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 最大借款额度: 当年开盘时所持总资产的 "),a(V,null,{default:l(()=>[o("20%")]),_:1})]),_:1})]),_:1})]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"我已知晓",block:"",onClick:me=>s.value=!1,variant:"elevated"},null,8,["onClick"])]),_:2},1024)]),_:2},1024)]),_:1}),a(h,{class:"my-2"}),a(k,null,{default:l(()=>[a(r,{cols:"6",class:"d-flex justify-center align-center"},{default:l(()=>[a(q,{"max-width":"500",modelValue:u.value.deposit,"onUpdate:modelValue":n[5]||(n[5]=s=>u.value.deposit=s)},{activator:l(()=>[a(m,{onClick:L,height:"180",width:"180",class:"d-flex flex-column justify-center align-center",color:"primary"},{default:l(()=>[a(f,{size:"40"},{default:l(()=>[o("mdi-bank-transfer-in")]),_:1}),te]),_:1})]),default:l(()=>[e.value.loading?(c(),v(z,{key:0,class:"py-2",color:"primary",elevation:"12",rounded:"lg"},{default:l(()=>[a(E,{"prepend-icon":"mdi-scale-balance",title:"正在与服务端同步..."},{prepend:l(()=>[g("div",ne,[a(f,{color:"primary",size:"x-large"})])]),append:l(()=>[a($,{color:"primary",indeterminate:"disable-shrink",size:"16",width:"2"})]),_:1})]),_:1})):(c(),v(m,{key:1},{default:l(()=>[a(w,null,{default:l(()=>[o(" 存款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(k,null,{default:l(()=>[a(r,{cols:"12",md:"6"},{default:l(()=>[o(" 现金余额: $"+_(e.value.money),1)]),_:1}),a(r,{cols:"12",md:"6"},{default:l(()=>[o(" 固定利率: "),a(V,{color:"success"},{default:l(()=>[o("1.5%")]),_:1})]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 存入金额: "),a(S,{modelValue:e.value.valid,"onUpdate:modelValue":n[3]||(n[3]=s=>e.value.valid=s)},{default:l(()=>[a(j,{min:"0.01",disabled:e.value.maxExchangeNumber<=0,modelValue:e.value.exchangeNumber,"onUpdate:modelValue":n[2]||(n[2]=s=>e.value.exchangeNumber=s),max:e.value.maxExchangeNumber,rules:T,type:"number",step:"0.01"},null,8,["disabled","modelValue","max"])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"取消",color:"primary",variant:"elevated",onClick:n[4]||(n[4]=s=>u.value.deposit=!1)}),a(d,{text:"确定",color:"error",variant:"elevated",loading:e.value.requesting,disabled:!e.value.valid||e.value.exchangeNumber<=0||e.value.exchangeNumber>e.value.maxExchangeNumber||e.value.exchangeNumber===0,onClick:H},null,8,["loading","disabled"])]),_:1})]),_:1}))]),_:1},8,["modelValue"])]),_:1}),a(r,{cols:"6",class:"d-flex justify-center align-center"},{default:l(()=>[a(q,{"max-width":"500",modelValue:u.value.withdraw,"onUpdate:modelValue":n[9]||(n[9]=s=>u.value.withdraw=s)},{activator:l(()=>[a(m,{onClick:P,height:"180",width:"180",class:"d-flex flex-column justify-center align-center"},{default:l(()=>[a(f,{size:"40"},{default:l(()=>[o("mdi-bank-transfer-out")]),_:1}),ue]),_:1})]),default:l(()=>[e.value.loading?(c(),v(z,{key:0,class:"py-2",color:"primary",elevation:"12",rounded:"lg"},{default:l(()=>[a(E,{"prepend-icon":"mdi-scale-balance",title:"正在与服务端同步..."},{prepend:l(()=>[g("div",oe,[a(f,{color:"primary",size:"x-large"})])]),append:l(()=>[a($,{color:"primary",indeterminate:"disable-shrink",size:"16",width:"2"})]),_:1})]),_:1})):(c(),v(m,{key:1},{default:l(()=>[a(w,null,{default:l(()=>[o(" 取款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(k,null,{default:l(()=>[a(r,{cols:"12",md:"6"},{default:l(()=>[o(" 银行余额: $"+_(e.value.money),1)]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 取出金额: "),a(S,{modelValue:e.value.valid,"onUpdate:modelValue":n[7]||(n[7]=s=>e.value.valid=s)},{default:l(()=>[a(j,{min:"0.01",disabled:e.value.maxExchangeNumber<=0,modelValue:e.value.exchangeNumber,"onUpdate:modelValue":n[6]||(n[6]=s=>e.value.exchangeNumber=s),max:e.value.maxExchangeNumber,rules:T,type:"number",step:"0.01"},null,8,["disabled","modelValue","max"])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"取消",color:"primary",variant:"elevated",onClick:n[8]||(n[8]=s=>u.value.withdraw=!1)}),a(d,{text:"确定",color:"error",variant:"elevated",loading:e.value.requesting,disabled:!e.value.valid||e.value.exchangeNumber<=0||e.value.exchangeNumber>e.value.maxExchangeNumber||e.value.exchangeNumber===0,onClick:J},null,8,["loading","disabled"])]),_:1})]),_:1}))]),_:1},8,["modelValue"])]),_:1}),a(r,{cols:"6",class:"d-flex justify-center align-center"},{default:l(()=>[a(q,{"max-width":"500",modelValue:u.value.loan,"onUpdate:modelValue":n[14]||(n[14]=s=>u.value.loan=s)},{activator:l(()=>[a(m,{onClick:W,height:"180",width:"180",class:"d-flex flex-column justify-center align-center",color:"primary"},{default:l(()=>[a(f,{size:"40"},{default:l(()=>[o("mdi-cash-plus")]),_:1}),se]),_:1})]),default:l(()=>[e.value.loading?(c(),v(z,{key:0,class:"py-2",color:"primary",elevation:"12",rounded:"lg"},{default:l(()=>[a(E,{"prepend-icon":"mdi-scale-balance",title:"正在与服务端同步..."},{prepend:l(()=>[g("div",re,[a(f,{color:"primary",size:"x-large"})])]),append:l(()=>[a($,{color:"primary",indeterminate:"disable-shrink",size:"16",width:"2"})]),_:1})]),_:1})):e.value.warningText?(c(),v(m,{key:1},{default:l(()=>[a(w,null,{default:l(()=>[o(" 借款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(B,{density:"compact",text:"您必须还清之前的借款才能再次借款",title:e.value.warningText,icon:"mdi-scale-balance",type:"warning"},null,8,["title"])]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"确定",color:"primary",variant:"elevated",onClick:n[10]||(n[10]=s=>u.value.loan=!1)})]),_:1})]),_:1})):(c(),v(m,{key:2},{default:l(()=>[a(w,null,{default:l(()=>[o(" 借款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(k,null,{default:l(()=>[a(r,{cols:"12"},{default:l(()=>[a(B,{color:"info",density:"compact",text:"借款存在期间，您将无法再次借款",icon:"mdi-information",type:"success"})]),_:1}),a(r,{cols:"12",md:"6"},{default:l(()=>[o(" 您的最大借款额度: $"+_(e.value.money),1)]),_:1}),a(r,{cols:"12",md:"6"},{default:l(()=>[o(" 借款利息: "),a(V,{color:"error"},{default:l(()=>[o("2.0%")]),_:1})]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 借款金额: "),a(S,{modelValue:e.value.valid,"onUpdate:modelValue":n[12]||(n[12]=s=>e.value.valid=s)},{default:l(()=>[a(j,{min:"0.01",disabled:e.value.maxExchangeNumber<=0,modelValue:e.value.exchangeNumber,"onUpdate:modelValue":n[11]||(n[11]=s=>e.value.exchangeNumber=s),max:e.value.maxExchangeNumber,rules:T,type:"number",step:"0.01"},null,8,["disabled","modelValue","max"])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"取消",color:"primary",variant:"elevated",onClick:n[13]||(n[13]=s=>u.value.loan=!1)}),a(d,{text:"确定",color:"error",variant:"elevated",loading:e.value.requesting,disabled:!e.value.valid||e.value.exchangeNumber<=0||e.value.exchangeNumber>e.value.maxExchangeNumber||e.value.exchangeNumber===0,onClick:K},null,8,["loading","disabled"])]),_:1})]),_:1}))]),_:1},8,["modelValue"])]),_:1}),a(r,{cols:"6",class:"d-flex justify-center align-center"},{default:l(()=>[a(q,{"max-width":"500",modelValue:u.value.repay,"onUpdate:modelValue":n[17]||(n[17]=s=>u.value.repay=s)},{activator:l(()=>[a(m,{onClick:A,height:"180",width:"180",class:"d-flex flex-column justify-center align-center"},{default:l(()=>[a(f,{size:"40"},{default:l(()=>[o("mdi-cash-refund")]),_:1}),ie]),_:1})]),default:l(()=>[e.value.loading?(c(),v(z,{key:0,class:"py-2",color:"primary",elevation:"12",rounded:"lg"},{default:l(()=>[a(E,{"prepend-icon":"mdi-scale-balance",title:"正在与服务端同步..."},{prepend:l(()=>[g("div",de,[a(f,{color:"primary",size:"x-large"})])]),append:l(()=>[a($,{color:"primary",indeterminate:"disable-shrink",size:"16",width:"2"})]),_:1})]),_:1})):e.value.warningText?(c(),v(m,{key:1},{default:l(()=>[a(w,null,{default:l(()=>[o(" 还款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(B,{density:"compact",text:"您可以使用借款功能来借款",title:e.value.warningText,icon:"mdi-check-bold",type:"success"},null,8,["title"])]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"确定",color:"primary",variant:"elevated",onClick:n[15]||(n[15]=s=>u.value.repay=!1)})]),_:1})]),_:1})):(c(),v(m,{key:2},{default:l(()=>[a(w,null,{default:l(()=>[o(" 还款 ")]),_:1}),a(h),a(x,null,{default:l(()=>[a(k,null,{default:l(()=>[a(r,{cols:"12",md:"4"},{default:l(()=>[o(" 您借款的金额: $"+_(e.value.money.toFixed(2)),1)]),_:1}),a(r,{cols:"12",md:"4"},{default:l(()=>[o(" 需付利息: $"+_(e.value.interest.toFixed(2)),1)]),_:1}),a(r,{cols:"12",md:"4"},{default:l(()=>[o(" 已借款周期: "+_(e.value.period),1)]),_:1}),a(r,{cols:"12"},{default:l(()=>[o(" 总计: $"+_(e.value.total.toFixed(2)),1)]),_:1})]),_:1})]),_:1}),a(b,null,{default:l(()=>[a(y),a(d,{text:"取消",color:"primary",variant:"elevated",onClick:n[16]||(n[16]=s=>u.value.repay=!1)}),a(d,{text:"确定还款",color:"error",variant:"elevated",loading:e.value.requesting,onClick:M},null,8,["loading"])]),_:1})]),_:1}))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}}};typeof R=="function"&&R(ce);export{ce as default};
