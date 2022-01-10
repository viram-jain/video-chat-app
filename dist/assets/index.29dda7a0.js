import{j as g,r as i,B as P,S as T,R as m,a as w,b as O}from"./vendor.e4bf304c.js";const A=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const d of t.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}};A();const N="http://localhost:8000/",D="ws://localhost:8000/",L="stun:stun.l.google.com:19302";var p={REACT_APP_URL:N,REACT_APP_WEBSOCKET_URL:D,REACT_APP_RTC_PEER_CONNECTION_URL:L};const o=g.exports.jsx,C=g.exports.jsxs,S=f=>o("div",{children:o("button",{onClick:async c=>{c.preventDefault();const a=await fetch(p.REACT_APP_URL+"create"),{room_id:e}=await a.json();f.history.push(`/room/${e}`)},children:"Create Room"})}),I=f=>{const s=i.exports.useRef(),c=i.exports.useRef(),a=i.exports.useRef(),e=i.exports.useRef(),t=i.exports.useRef(),d=async()=>{const l=(await navigator.mediaDevices.enumerateDevices()).filter(u=>u.kind=="videoinput"),n={audio:!0,video:{deviceId:l[0].deviceId}};try{return await navigator.mediaDevices.getUserMedia(n)}catch(u){console.log(u)}};i.exports.useEffect(()=>{d().then(r=>{s.current.srcObject=r,c.current=r,t.current=new WebSocket(p.REACT_APP_WEBSOCKET_URL+`join?roomID=${f.match.params.roomID}`),t.current.addEventListener("open",()=>{t.current.send(JSON.stringify({join:!0}))}),t.current.addEventListener("message",async l=>{const n=JSON.parse(l.data);if(n.join&&h(),n.offer&&E(n.offer),n.answer&&(console.log("Receiving asnwer"),e.current.setRemoteDescription(new RTCSessionDescription(n.answer))),n.iceCandidate){console.log("Receiving and adding ICE candidate");try{await e.current.addIceCandidate(n.iceCandidate)}catch(u){console.log("Error receiving ICE candidate",u)}}})})});const E=async r=>{console.log("Received offer. Creating answer"),e.current=R(),await e.current.setRemoteDescription(new RTCSessionDescription(r)),c.current.getTracks().forEach(n=>{e.current.addTrack(n,c.current)});const l=await e.current.createAnswer();await e.current.setLocalDescription(l),t.current.send(JSON.stringify({answer:e.current.localDescription}))},h=()=>{console.log("Calling other user"),e.current=R(),c.current.getTracks().forEach(r=>{e.current.addTrack(r,c.current)})},R=()=>{console.log("Creating peer connection");const r=new RTCPeerConnection({iceServers:[{urls:p.REACT_APP_RTC_PEER_CONNECTION_URL}]});return r.onnegotiationneeded=v,r.onicecandidate=_,r.ontrack=y,r},v=async()=>{console.log("Creating offer");try{const r=await e.current.createOffer();await e.current.setLocalDescription(r),t.current.send(JSON.stringify({offer:e.current.localDescription}))}catch(r){console.log(r)}},_=r=>{console.log("Found Ice Candidate"),r.candidate&&(console.log(r.candidate),t.current.send(JSON.stringify({iceCandidate:r.candidate})))},y=r=>{console.log("Received Tracks"),a.current.srcObject=r.streams[0]};return C("div",{children:[o("video",{autoPlay:!0,controls:!0,ref:s}),o("video",{autoPlay:!0,controls:!0,ref:a})]})};function x(){return o("div",{className:"App",children:o(P,{children:C(T,{children:[o(m,{path:"/",exact:!0,component:S}),o(m,{path:"/room/:roomID",component:I})]})})})}w.render(o(O.StrictMode,{children:o(x,{})}),document.getElementById("root"));
