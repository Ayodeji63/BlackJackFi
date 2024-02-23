(self.webpackChunkblackjack_frontend=self.webpackChunkblackjack_frontend||[]).push([[383],{1383:(e,t,s)=>{"use strict";s.r(t),s.d(t,{AlchemyWebSocketProvider:()=>E});var n=s(5375),i=s(4152),o=s(1610),r=s(7442),c=s(3161),l=s(6032),a=s(5651),h=s(576);let u=null;try{if(u=WebSocket,null==u)throw new Error("inject please")}catch(R){const e=new a.Vy(h.r);u=function(){e.throwError("WebSockets not supported in this environment",a.Vy.errors.UNSUPPORTED_OPERATION,{operation:"new WebSocket()"})}}var d=function(e,t,s,n){return new(s||(s=Promise))((function(i,o){function r(e){try{l(n.next(e))}catch(t){o(t)}}function c(e){try{l(n.throw(e))}catch(t){o(t)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(r,c)}l((n=n.apply(e,t||[])).next())}))};const f=new a.Vy(h.r);let p=1;class b extends l.F{constructor(e,t){"any"===t&&f.throwError("WebSocketProvider does not support 'any' network yet",a.Vy.errors.UNSUPPORTED_OPERATION,{operation:"network:any"}),super("string"===typeof e?e:"_websocket",t),this._pollingInterval=-1,this._wsReady=!1,"string"===typeof e?(0,c.yY)(this,"_websocket",new u(this.connection.url)):(0,c.yY)(this,"_websocket",e),(0,c.yY)(this,"_requests",{}),(0,c.yY)(this,"_subs",{}),(0,c.yY)(this,"_subIds",{}),(0,c.yY)(this,"_detectNetwork",super.detectNetwork()),this.websocket.onopen=()=>{this._wsReady=!0,Object.keys(this._requests).forEach((e=>{this.websocket.send(this._requests[e].payload)}))},this.websocket.onmessage=e=>{const t=e.data,s=JSON.parse(t);if(null!=s.id){const e=String(s.id),n=this._requests[e];if(delete this._requests[e],void 0!==s.result)n.callback(null,s.result),this.emit("debug",{action:"response",request:JSON.parse(n.payload),response:s.result,provider:this});else{let e=null;s.error?(e=new Error(s.error.message||"unknown error"),(0,c.yY)(e,"code",s.error.code||null),(0,c.yY)(e,"response",t)):e=new Error("unknown error"),n.callback(e,void 0),this.emit("debug",{action:"response",error:e,request:JSON.parse(n.payload),provider:this})}}else if("eth_subscription"===s.method){const e=this._subs[s.params.subscription];e&&e.processFunc(s.params.result)}else console.warn("this should not happen")};const s=setInterval((()=>{this.emit("poll")}),1e3);s.unref&&s.unref()}get websocket(){return this._websocket}detectNetwork(){return this._detectNetwork}get pollingInterval(){return 0}resetEventsBlock(e){f.throwError("cannot reset events block on WebSocketProvider",a.Vy.errors.UNSUPPORTED_OPERATION,{operation:"resetEventBlock"})}set pollingInterval(e){f.throwError("cannot set polling interval on WebSocketProvider",a.Vy.errors.UNSUPPORTED_OPERATION,{operation:"setPollingInterval"})}poll(){return d(this,void 0,void 0,(function*(){return null}))}set polling(e){e&&f.throwError("cannot set polling on WebSocketProvider",a.Vy.errors.UNSUPPORTED_OPERATION,{operation:"setPolling"})}send(e,t){const s=p++;return new Promise(((n,i)=>{const o=JSON.stringify({method:e,params:t,id:s,jsonrpc:"2.0"});this.emit("debug",{action:"request",request:JSON.parse(o),provider:this}),this._requests[String(s)]={callback:function(e,t){return e?i(e):n(t)},payload:o},this._wsReady&&this.websocket.send(o)}))}static defaultUrl(){return"ws://localhost:8546"}_subscribe(e,t,s){return d(this,void 0,void 0,(function*(){let n=this._subIds[e];null==n&&(n=Promise.all(t).then((e=>this.send("eth_subscribe",e))),this._subIds[e]=n);const i=yield n;this._subs[i]={tag:e,processFunc:s}}))}_startEvent(e){switch(e.type){case"block":this._subscribe("block",["newHeads"],(e=>{const t=o.gH.from(e.number).toNumber();this._emitted.block=t,this.emit("block",t)}));break;case"pending":this._subscribe("pending",["newPendingTransactions"],(e=>{this.emit("pending",e)}));break;case"filter":this._subscribe(e.tag,["logs",this._getFilter(e.filter)],(t=>{null==t.removed&&(t.removed=!1),this.emit(e.filter,this.formatter.filterLog(t))}));break;case"tx":{const t=e=>{const t=e.hash;this.getTransactionReceipt(t).then((e=>{e&&this.emit(t,e)}))};t(e),this._subscribe("tx",["newHeads"],(e=>{this._events.filter((e=>"tx"===e.type)).forEach(t)}));break}case"debug":case"poll":case"willPoll":case"didPoll":case"error":break;default:console.log("unhandled:",e)}}_stopEvent(e){let t=e.tag;if("tx"===e.type){if(this._events.filter((e=>"tx"===e.type)).length)return;t="tx"}else if(this.listenerCount(e.event))return;const s=this._subIds[t];s&&(delete this._subIds[t],s.then((e=>{this._subs[e]&&(delete this._subs[e],this.send("eth_unsubscribe",[e]))})))}destroy(){return d(this,void 0,void 0,(function*(){this.websocket.readyState===u.CONNECTING&&(yield new Promise((e=>{this.websocket.onopen=function(){e(!0)},this.websocket.onerror=function(){e(!1)}}))),this.websocket.close(1e3)}))}}var m=s(4498);class v{constructor(e){this.provider=e,this.maxBackfillBlocks=120}getNewHeadsBackfill(e,t,s){return(0,n._)(this,void 0,void 0,(function*(){w(e);const i=yield this.getBlockNumber();if(w(e),0===t.length)return this.getHeadEventsInRange(Math.max(s,i-this.maxBackfillBlocks)+1,i+1);const o=(0,n.f)(t[t.length-1].number),r=i-this.maxBackfillBlocks+1;if(o<=r)return this.getHeadEventsInRange(r,i+1);const c=yield this.getReorgHeads(e,t);w(e);const l=yield this.getHeadEventsInRange(o+1,i+1);return w(e),[...c,...l]}))}getLogsBackfill(e,t,s,i){return(0,n._)(this,void 0,void 0,(function*(){w(e);const o=yield this.getBlockNumber();if(w(e),0===s.length)return this.getLogsInRange(t,Math.max(i,o-this.maxBackfillBlocks)+1,o+1);const r=(0,n.f)(s[s.length-1].blockNumber),c=o-this.maxBackfillBlocks+1;if(r<c)return this.getLogsInRange(t,c,o+1);const l=yield this.getCommonAncestor(e,s);w(e);const a=s.filter((e=>(0,n.f)(e.blockNumber)>l.blockNumber)).map((e=>Object.assign(Object.assign({},e),{removed:!0}))),h=l.blockNumber===Number.NEGATIVE_INFINITY?(0,n.f)(s[0].blockNumber):l.blockNumber;let u=yield this.getLogsInRange(t,h,o+1);return u=u.filter((e=>e&&((0,n.f)(e.blockNumber)>l.blockNumber||(0,n.f)(e.logIndex)>l.logIndex))),w(e),[...a,...u]}))}setMaxBackfillBlock(e){this.maxBackfillBlocks=e}getBlockNumber(){return(0,n._)(this,void 0,void 0,(function*(){const e=yield this.provider.send("eth_blockNumber");return(0,n.f)(e)}))}getHeadEventsInRange(e,t){return(0,n._)(this,void 0,void 0,(function*(){if(e>=t)return[];const s=[];for(let i=e;i<t;i++)s.push({method:"eth_getBlockByNumber",params:[(0,n.t)(i),!1]});return(yield this.provider.sendBatch(s)).map(y)}))}getReorgHeads(e,t){return(0,n._)(this,void 0,void 0,(function*(){const s=[];for(let i=t.length-1;i>=0;i--){const o=t[i],r=yield this.getBlockByNumber((0,n.f)(o.number));if(w(e),o.hash===r.hash)break;s.push(y(r))}return s.reverse()}))}getBlockByNumber(e){return(0,n._)(this,void 0,void 0,(function*(){return this.provider.send("eth_getBlockByNumber",[(0,n.t)(e),!1])}))}getCommonAncestor(e,t){return(0,n._)(this,void 0,void 0,(function*(){let s=yield this.getBlockByNumber((0,n.f)(t[t.length-1].blockNumber));w(e);for(let e=t.length-1;e>=0;e--){const i=t[e];if(i.blockNumber!==s.number&&(s=yield this.getBlockByNumber((0,n.f)(i.blockNumber))),i.blockHash===s.hash)return{blockNumber:(0,n.f)(i.blockNumber),logIndex:(0,n.f)(i.logIndex)}}return{blockNumber:Number.NEGATIVE_INFINITY,logIndex:Number.NEGATIVE_INFINITY}}))}getLogsInRange(e,t,s){return(0,n._)(this,void 0,void 0,(function*(){if(t>=s)return[];const i=Object.assign(Object.assign({},e),{fromBlock:(0,n.t)(t),toBlock:(0,n.t)(s-1)});return this.provider.send("eth_getLogs",[i])}))}}function y(e){const t=Object.assign({},e);return delete t.totalDifficulty,delete t.transactions,delete t.uncles,t}function g(e,t){const s=new Set,n=[];return e.forEach((e=>{const i=t(e);s.has(i)||(s.add(i),n.push(e))})),n}const k=new Error("Cancelled");function w(e){if(e())throw k}const _=10;class E extends b{constructor(e,t){var o;const r=m.AlchemyProvider.getApiKey(e.apiKey),c=m.AlchemyProvider.getAlchemyNetwork(e.network),l=m.AlchemyProvider.getAlchemyConnectionInfo(c,r,"wss"),a="alchemy-sdk-".concat(n.V);super(new i.A(null!==(o=e.url)&&void 0!==o?o:l.url,a,{wsConstructor:null!==t&&void 0!==t?t:"undefined"!==typeof process&&null!=process&&null!=process.versions&&null!=process.versions.node?s(3180).w3cwebsocket:WebSocket}),n.E[c]),this._events=[],this.virtualSubscriptionsById=new Map,this.virtualIdsByPhysicalId=new Map,this.handleMessage=e=>{const t=JSON.parse(e.data);if(!function(e){return!function(e){return Array.isArray(e)||"2.0"===e.jsonrpc&&void 0!==e.id}(e)}(t))return;const s=t.params.subscription,n=this.virtualIdsByPhysicalId.get(s);if(!n)return;const i=this.virtualSubscriptionsById.get(n);if("eth_subscribe"===i.method)switch(i.params[0]){case"newHeads":{const e=i,o=t,{isBackfilling:r,backfillBuffer:c}=e,{result:l}=o.params;r?function(e,t){P(e,t,S)}(c,l):s!==n?this.emitAndRememberEvent(n,l,S):this.rememberEvent(n,l,S);break}case"logs":{const e=i,o=t,{isBackfilling:r,backfillBuffer:c}=e,{result:l}=o.params;r?function(e,t){P(e,t,A)}(c,l):n!==s?this.emitAndRememberEvent(n,l,A):this.rememberEvent(n,l,A);break}default:if(s!==n){const{result:e}=t.params;this.emitEvent(n,e)}}},this.handleReopen=()=>{this.virtualIdsByPhysicalId.clear();const{cancel:e,isCancelled:t}=function(){let e=!1;return{cancel:()=>e=!0,isCancelled:()=>e}}();this.cancelBackfill=e;for(const s of this.virtualSubscriptionsById.values())(()=>{(0,n._)(this,void 0,void 0,(function*(){try{yield this.resubscribeAndBackfill(t,s)}catch(R){t()||console.error('Error while backfilling "'.concat(s.params[0],'" subscription. Some events may be missing.'),R)}}))})();this.startHeartbeat()},this.stopHeartbeatAndBackfill=()=>{null!=this.heartbeatIntervalId&&(clearInterval(this.heartbeatIntervalId),this.heartbeatIntervalId=void 0),this.cancelBackfill()},this.apiKey=r,this.backfiller=new v(this),this.addSocketListeners(),this.startHeartbeat(),this.cancelBackfill=n.n}static getNetwork(e){return"string"===typeof e&&e in n.C?n.C[e]:(0,r.N)(e)}on(e,t){return this._addEventListener(e,t,!1)}once(e,t){return this._addEventListener(e,t,!0)}off(e,t){return(0,n.i)(e)?this._off(e,t):super.off(e,t)}removeAllListeners(e){return void 0!==e&&(0,n.i)(e)?this._removeAllListeners(e):super.removeAllListeners(e)}listenerCount(e){return void 0!==e&&(0,n.i)(e)?this._listenerCount(e):super.listenerCount(e)}listeners(e){return void 0!==e&&(0,n.i)(e)?this._listeners(e):super.listeners(e)}_addEventListener(e,t,s){if((0,n.i)(e)){(0,n.v)(e);const i=new n.c((0,n.e)(e),t,s);return this._events.push(i),this._startEvent(i),this}return super._addEventListener(e,t,s)}_startEvent(e){[...n.A,"block","filter"].includes(e.type)?this.customStartEvent(e):super._startEvent(e)}_subscribe(e,t,s,i){return(0,n._)(this,void 0,void 0,(function*(){let n=this._subIds[e];const o=yield this.getBlockNumber();null==n&&(n=Promise.all(t).then((e=>this.send("eth_subscribe",e))),this._subIds[e]=n);const r=yield n,c=yield Promise.all(t);this.virtualSubscriptionsById.set(r,{event:i,method:"eth_subscribe",params:c,startingBlockNumber:o,virtualId:r,physicalId:r,sentEvents:[],isBackfilling:!1,backfillBuffer:[]}),this.virtualIdsByPhysicalId.set(r,r),this._subs[r]={tag:e,processFunc:s}}))}emit(e){for(var t=arguments.length,s=new Array(t>1?t-1:0),i=1;i<t;i++)s[i-1]=arguments[i];if((0,n.i)(e)){let t=!1;const i=[],o=(0,n.e)(e);return this._events=this._events.filter((e=>e.tag!==o||(setTimeout((()=>{e.listener.apply(this,s)}),0),t=!0,!e.once||(i.push(e),!1)))),i.forEach((e=>{this._stopEvent(e)})),t}return super.emit(e,...s)}sendBatch(e){return(0,n._)(this,void 0,void 0,(function*(){let t=0;const s=e.map((e=>{let{method:s,params:n}=e;return{method:s,params:n,jsonrpc:"2.0",id:"alchemy-sdk:".concat(t++)}}));return this.sendBatchConcurrently(s)}))}destroy(){return this.removeSocketListeners(),this.stopHeartbeatAndBackfill(),super.destroy()}isCommunityResource(){return this.apiKey===n.D}_stopEvent(e){let t=e.tag;if(n.A.includes(e.type)){if(this._events.filter((e=>n.A.includes(e.type))).length)return}else if("tx"===e.type){if(this._events.filter((e=>"tx"===e.type)).length)return;t="tx"}else if(this.listenerCount(e.event))return;const s=this._subIds[t];s&&(delete this._subIds[t],s.then((e=>{this._subs[e]&&(delete this._subs[e],this.send("eth_unsubscribe",[e]))})))}addSocketListeners(){this._websocket.addEventListener("message",this.handleMessage),this._websocket.addEventListener("reopen",this.handleReopen),this._websocket.addEventListener("down",this.stopHeartbeatAndBackfill)}removeSocketListeners(){this._websocket.removeEventListener("message",this.handleMessage),this._websocket.removeEventListener("reopen",this.handleReopen),this._websocket.removeEventListener("down",this.stopHeartbeatAndBackfill)}resubscribeAndBackfill(e,t){return(0,n._)(this,void 0,void 0,(function*(){const{virtualId:s,method:n,params:i,sentEvents:o,backfillBuffer:r,startingBlockNumber:c}=t;t.isBackfilling=!0,r.length=0;try{const l=yield this.send(n,i);switch(w(e),t.physicalId=l,this.virtualIdsByPhysicalId.set(l,s),i[0]){case"newHeads":{const t=yield O((()=>B(this.backfiller.getNewHeadsBackfill(e,o,c),6e4)),5,(()=>!e()));w(e);(function(e){return g(e,(e=>e.hash))})([...t,...r]).forEach((e=>this.emitNewHeadsEvent(s,e)));break}case"logs":{const t=i[1]||{},n=yield O((()=>B(this.backfiller.getLogsBackfill(e,t,o,c),6e4)),5,(()=>!e()));w(e);(function(e){return g(e,(e=>"".concat(e.blockHash,"/").concat(e.logIndex)))})([...n,...r]).forEach((e=>this.emitLogsEvent(s,e)));break}}}finally{t.isBackfilling=!1,r.length=0}}))}emitNewHeadsEvent(e,t){this.emitAndRememberEvent(e,t,S)}emitLogsEvent(e,t){this.emitAndRememberEvent(e,t,A)}emitAndRememberEvent(e,t,s){this.rememberEvent(e,t,s),this.emitEvent(e,t)}emitEvent(e,t){const s=this.virtualSubscriptionsById.get(e);s&&this.emitGenericEvent(s,t)}rememberEvent(e,t,s){const n=this.virtualSubscriptionsById.get(e);n&&P(n.sentEvents,Object.assign({},t),s)}emitGenericEvent(e,t){this.emitProcessFn(e.event)(t)}startHeartbeat(){null==this.heartbeatIntervalId&&(this.heartbeatIntervalId=setInterval((()=>(0,n._)(this,void 0,void 0,(function*(){try{yield B(this.send("net_version"),1e4)}catch(e){this._websocket.reconnect()}}))),3e4))}sendBatchConcurrently(e){return(0,n._)(this,void 0,void 0,(function*(){return Promise.all(e.map((e=>this.send(e.method,e.params))))}))}customStartEvent(e){if(e.type===n.h){const{fromAddress:t,toAddress:s,hashesOnly:i}=e;this._subscribe(e.tag,[n.j.PENDING_TRANSACTIONS,{fromAddress:t,toAddress:s,hashesOnly:i}],this.emitProcessFn(e),e)}else if(e.type===n.k){const{addresses:t,includeRemoved:s,hashesOnly:i}=e;this._subscribe(e.tag,[n.j.MINED_TRANSACTIONS,{addresses:t,includeRemoved:s,hashesOnly:i}],this.emitProcessFn(e),e)}else"block"===e.type?this._subscribe("block",["newHeads"],this.emitProcessFn(e),e):"filter"===e.type&&this._subscribe(e.tag,["logs",this._getFilter(e.filter)],this.emitProcessFn(e),e)}emitProcessFn(e){switch(e.type){case n.h:return t=>this.emit({method:n.j.PENDING_TRANSACTIONS,fromAddress:e.fromAddress,toAddress:e.toAddress,hashesOnly:e.hashesOnly},t);case n.k:return t=>this.emit({method:n.j.MINED_TRANSACTIONS,addresses:e.addresses,includeRemoved:e.includeRemoved,hashesOnly:e.hashesOnly},t);case"block":return e=>{const t=o.gH.from(e.number).toNumber();this._emitted.block=t,this.emit("block",t)};case"filter":return t=>{null==t.removed&&(t.removed=!1),this.emit(e.filter,this.formatter.filterLog(t))};default:throw new Error("Invalid event type to `emitProcessFn()`")}}_off(e,t){if(null==t)return this.removeAllListeners(e);const s=[];let i=!1;const o=(0,n.e)(e);return this._events=this._events.filter((e=>e.tag!==o||e.listener!=t||(!!i||(i=!0,s.push(e),!1)))),s.forEach((e=>{this._stopEvent(e)})),this}_removeAllListeners(e){let t=[];if(null==e)t=this._events,this._events=[];else{const s=(0,n.e)(e);this._events=this._events.filter((e=>e.tag!==s||(t.push(e),!1)))}return t.forEach((e=>{this._stopEvent(e)})),this}_listenerCount(e){if(!e)return this._events.length;const t=(0,n.e)(e);return this._events.filter((e=>e.tag===t)).length}_listeners(e){if(null==e)return this._events.map((e=>e.listener));const t=(0,n.e)(e);return this._events.filter((e=>e.tag===t)).map((e=>e.listener))}}const I=1e3,N=2,T=3e4;function O(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>!0;return(0,n._)(this,void 0,void 0,(function*(){let n=0,i=0;for(;;)try{return yield e()}catch(R){if(i++,i>=t||!s(R))throw R;if(yield C(n),!s(R))throw R;n=0===n?I:Math.min(T,N*n)}}))}function C(e){return new Promise((t=>setTimeout(t,e)))}function B(e,t){return Promise.race([e,new Promise(((e,s)=>setTimeout((()=>s(new Error("Timeout"))),t)))])}function S(e){return(0,n.f)(e.number)}function A(e){return(0,n.f)(e.blockNumber)}function P(e,t,s){const n=s(t),i=e.findIndex((e=>s(e)>n-_));-1===i?e.length=0:e.splice(0,i),e.push(t)}},3922:e=>{var t=function(){if("object"===typeof self&&self)return self;if("object"===typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};e.exports=function(){if(this)return this;if("object"===typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(e){return t()}try{return __global__||t()}finally{delete Object.prototype.__global__}}()},4152:(e,t)=>{"use strict";var s=function(){function e(t,s,i){if(void 0===i&&(i={}),this.url=t,this.onclose=null,this.onerror=null,this.onmessage=null,this.onopen=null,this.ondown=null,this.onreopen=null,this.CONNECTING=e.CONNECTING,this.OPEN=e.OPEN,this.CLOSING=e.CLOSING,this.CLOSED=e.CLOSED,this.hasBeenOpened=!1,this.isClosed=!1,this.messageBuffer=[],this.nextRetryTime=0,this.reconnectCount=0,this.lastKnownExtensions="",this.lastKnownProtocol="",this.listeners={},null==s||"string"===typeof s||Array.isArray(s)?this.protocols=s:i=s,this.options=n(i),!this.options.wsConstructor){if("undefined"===typeof WebSocket)throw new Error("WebSocket not present in global scope and no wsConstructor option was provided.");this.options.wsConstructor=WebSocket}this.openNewWebSocket()}return Object.defineProperty(e.prototype,"binaryType",{get:function(){return this.binaryTypeInternal||"blob"},set:function(e){this.binaryTypeInternal=e,this.ws&&(this.ws.binaryType=e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"bufferedAmount",{get:function(){var e=this.ws?this.ws.bufferedAmount:0,t=!1;return this.messageBuffer.forEach((function(s){var n=function(e){return"string"===typeof e?2*e.length:e instanceof ArrayBuffer?e.byteLength:e instanceof Blob?e.size:void 0}(s);null!=n?e+=n:t=!0})),t&&this.debugLog("Some buffered data had unknown length. bufferedAmount() return value may be below the correct amount."),e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"extensions",{get:function(){return this.ws?this.ws.extensions:this.lastKnownExtensions},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"protocol",{get:function(){return this.ws?this.ws.protocol:this.lastKnownProtocol},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"readyState",{get:function(){return this.isClosed?e.CLOSED:e.OPEN},enumerable:!0,configurable:!0}),e.prototype.close=function(e,t){this.disposeSocket(e,t),this.shutdown(),this.debugLog("WebSocket permanently closed by client.")},e.prototype.send=function(e){if(this.isClosed)throw new Error("WebSocket is already in CLOSING or CLOSED state.");this.ws&&this.ws.readyState===this.OPEN?this.ws.send(e):this.messageBuffer.push(e)},e.prototype.reconnect=function(){if(this.isClosed)throw new Error("Cannot call reconnect() on socket which is permanently closed.");this.disposeSocket(1e3,"Client requested reconnect."),this.handleClose(void 0)},e.prototype.addEventListener=function(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)},e.prototype.dispatchEvent=function(e){return this.dispatchEventOfType(e.type,e)},e.prototype.removeEventListener=function(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter((function(e){return e!==t})))},e.prototype.openNewWebSocket=function(){var e=this;if(!this.isClosed){var t=this.options,s=t.connectTimeout,n=t.wsConstructor;this.debugLog("Opening new WebSocket to "+this.url+".");var i=new n(this.url,this.protocols);i.onclose=function(t){return e.handleClose(t)},i.onerror=function(t){return e.handleError(t)},i.onmessage=function(t){return e.handleMessage(t)},i.onopen=function(t){return e.handleOpen(t)},this.connectTimeoutId=setTimeout((function(){e.clearConnectTimeout(),e.disposeSocket(),e.handleClose(void 0)}),s),this.ws=i}},e.prototype.handleOpen=function(e){var t=this;if(this.ws&&!this.isClosed){var s=this.options.allClearResetTime;this.debugLog("WebSocket opened."),null!=this.binaryTypeInternal?this.ws.binaryType=this.binaryTypeInternal:this.binaryTypeInternal=this.ws.binaryType,this.clearConnectTimeout(),this.hasBeenOpened?this.dispatchEventOfType("reopen",e):(this.dispatchEventOfType("open",e),this.hasBeenOpened=!0),this.messageBuffer.forEach((function(e){return t.send(e)})),this.messageBuffer=[],this.allClearTimeoutId=setTimeout((function(){t.clearAllClearTimeout(),t.nextRetryTime=0,t.reconnectCount=0;var e=s/1e3|0;t.debugLog("WebSocket remained open for "+e+" seconds. Resetting retry time and count.")}),s)}},e.prototype.handleMessage=function(e){this.isClosed||this.dispatchEventOfType("message",e)},e.prototype.handleClose=function(e){var t=this;if(!this.isClosed){var s=this.options,n=s.maxReconnectAttempts,i=s.shouldReconnect;if(this.clearConnectTimeout(),this.clearAllClearTimeout(),this.ws&&(this.lastKnownExtensions=this.ws.extensions,this.lastKnownProtocol=this.ws.protocol,this.disposeSocket()),this.dispatchEventOfType("down",e),this.reconnectCount>=n)this.stopReconnecting(e,this.getTooManyFailedReconnectsMessage());else{var o=!e||i(e);"boolean"===typeof o?this.handleWillReconnect(o,e,"Provided shouldReconnect() returned false. Closing permanently."):o.then((function(s){t.isClosed||t.handleWillReconnect(s,e,"Provided shouldReconnect() resolved to false. Closing permanently.")}))}}},e.prototype.handleError=function(e){this.dispatchEventOfType("error",e),this.debugLog("WebSocket encountered an error.")},e.prototype.handleWillReconnect=function(e,t,s){e?this.reestablishConnection():this.stopReconnecting(t,s)},e.prototype.reestablishConnection=function(){var e=this,t=this.options,s=t.minReconnectDelay,n=t.maxReconnectDelay,i=t.reconnectBackoffFactor;this.reconnectCount++;var o=this.nextRetryTime;this.nextRetryTime=Math.max(s,Math.min(this.nextRetryTime*i,n)),setTimeout((function(){return e.openNewWebSocket()}),o);var r=o/1e3|0;this.debugLog("WebSocket was closed. Re-opening in "+r+" seconds.")},e.prototype.stopReconnecting=function(e,t){this.debugLog(t),this.shutdown(),e&&this.dispatchEventOfType("close",e)},e.prototype.shutdown=function(){this.isClosed=!0,this.clearAllTimeouts(),this.messageBuffer=[],this.disposeSocket()},e.prototype.disposeSocket=function(e,t){this.ws&&(this.ws.onerror=i,this.ws.onclose=i,this.ws.onmessage=i,this.ws.onopen=i,this.ws.close(e,t),this.ws=void 0)},e.prototype.clearAllTimeouts=function(){this.clearConnectTimeout(),this.clearAllClearTimeout()},e.prototype.clearConnectTimeout=function(){null!=this.connectTimeoutId&&(clearTimeout(this.connectTimeoutId),this.connectTimeoutId=void 0)},e.prototype.clearAllClearTimeout=function(){null!=this.allClearTimeoutId&&(clearTimeout(this.allClearTimeoutId),this.allClearTimeoutId=void 0)},e.prototype.dispatchEventOfType=function(e,t){var s=this;switch(e){case"close":this.onclose&&this.onclose(t);break;case"error":this.onerror&&this.onerror(t);break;case"message":this.onmessage&&this.onmessage(t);break;case"open":this.onopen&&this.onopen(t);break;case"down":this.ondown&&this.ondown(t);break;case"reopen":this.onreopen&&this.onreopen(t)}return e in this.listeners&&this.listeners[e].slice().forEach((function(e){return s.callListener(e,t)})),!t||!t.defaultPrevented},e.prototype.callListener=function(e,t){"function"===typeof e?e.call(this,t):e.handleEvent.call(this,t)},e.prototype.debugLog=function(e){this.options.debug&&console.log(e)},e.prototype.getTooManyFailedReconnectsMessage=function(){var e,t=this.options.maxReconnectAttempts;return"Failed to reconnect after "+t+" "+(e="attempt",(1===t?e:e+"s")+". Closing permanently.")},e.DEFAULT_OPTIONS={allClearResetTime:5e3,connectTimeout:5e3,debug:!1,minReconnectDelay:1e3,maxReconnectDelay:3e4,maxReconnectAttempts:Number.POSITIVE_INFINITY,reconnectBackoffFactor:1.5,shouldReconnect:function(){return!0},wsConstructor:void 0},e.CONNECTING=0,e.OPEN=1,e.CLOSING=2,e.CLOSED=3,e}();function n(e){var t={};return Object.keys(s.DEFAULT_OPTIONS).forEach((function(n){var i=e[n];t[n]=void 0===i?s.DEFAULT_OPTIONS[n]:i})),t}function i(){}t.A=s},3180:(e,t,s)=>{var n;if("object"===typeof globalThis)n=globalThis;else try{n=s(3922)}catch(c){}finally{if(n||"undefined"===typeof window||(n=window),!n)throw new Error("Could not determine global this")}var i=n.WebSocket||n.MozWebSocket,o=s(4812);function r(e,t){return t?new i(e,t):new i(e)}i&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(e){Object.defineProperty(r,e,{get:function(){return i[e]}})})),e.exports={w3cwebsocket:i?r:null,version:o}},4812:(e,t,s)=>{e.exports=s(2918).version},2918:e=>{"use strict";e.exports={version:"1.0.34"}}}]);
//# sourceMappingURL=383.a986740b.chunk.js.map