// js/app.js
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

function show(el){ el.style.display = "flex"; el.setAttribute("aria-hidden","false"); }
function hide(el){ el.style.display = "none"; el.setAttribute("aria-hidden","true"); }
function pad2(n){ return String(n).padStart(2, "0"); }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function addImgFallback(img){
  if (!img) return;
  img.addEventListener("error", () => {
    if (img.dataset.fallbackTried) return;
    img.dataset.fallbackTried = "1";
    const src = img.getAttribute("src") || "";
    if (src.includes("/assets/")){
      img.src = src.replace("/assets/","/");
      return;
    }
    if (!src.includes("/assets/")){
      img.src = src.replace(/^(\.\/)?/, "./assets/");
    }
  });
}

// ===== Guest name from ?to=
(function initGuest(){
  const params = new URLSearchParams(location.search);
  const to = params.get("to");
  if (to) $("#guestName").textContent = decodeURIComponent(to);
})();

// ===== Fill content from config
(function hydrate(){
  const c = window.INVITE;

  $("#topNames").textContent = c.couple.topNames;
  $("#heroNames").innerHTML = `${escapeHtml(c.couple.bride)}<br>&amp; ${escapeHtml(c.couple.groom)}`;
  $("#coupleLine").innerHTML = `${escapeHtml(c.couple.bride)} &amp; ${escapeHtml(c.couple.groom)}`;
  $("#heroMonogram").textContent = c.couple.monogram;
  $("#heroDateTag").textContent = c.couple.monthTag;

  $("#brideAddr").textContent = c.families.brideSide.address;
  $("#brideDad").textContent = c.families.brideSide.dad;
  $("#brideMom").textContent = c.families.brideSide.mom;

  $("#groomAddr").textContent = c.families.groomSide.address;
  $("#groomDad").textContent = c.families.groomSide.dad;
  $("#groomMom").textContent = c.families.groomSide.mom;

  $("#heroPlace").textContent = c.location.placeName;
  $("#heroAddr").textContent = c.location.addressLine;

  // events
  $("#partyDate").textContent = c.events.party.dateText;
  $("#partyTime").textContent = c.events.party.timeText;
  $("#partyLunar").textContent = c.events.party.lunarText;

  $("#weddingDate").textContent = c.events.wedding.dateText;
  $("#weddingTime").textContent = c.events.wedding.timeText;
  $("#weddingLunar").textContent = c.events.wedding.lunarText;

  $("#eventPlace1").textContent = "Tại " + c.location.placeName;
  $("#eventAddr1").textContent = c.location.addressLine;
  $("#eventPlace2").textContent = "Tại " + c.location.placeName;
  $("#eventAddr2").textContent = c.location.addressLine;

  $("#mapAddrText").textContent = `${c.location.addressLine} — ${c.location.placeName}`;

  // directions links
  $("#partyDirections").href = c.location.directionsUrl;
  $("#weddingDirections").href = c.location.directionsUrl;

  // map iframe
  $("#mapIframe").src = c.location.embedSrc;

  // gift info
  const gift = c.gift || {};
  const giftBank = $("#giftBank");
  const giftOwner = $("#giftOwner");
  const giftBranch = $("#giftBranch");
  const giftNumber = $("#giftNumber");
  const giftCopy = $("#giftCopy");
  const giftQr = $("#giftQr");
  if (giftBank) giftBank.textContent = `Ngân hàng: ${gift.bankName || ""}`.trim();
  if (giftOwner) giftOwner.textContent = `Chủ TK: ${gift.accountName || ""}`.trim();
  if (giftBranch) giftBranch.textContent = `Chi nhánh: ${gift.bankBranch || ""}`.trim();
  if (giftNumber) giftNumber.textContent = `Số TK: ${gift.accountNumber || ""}`.trim();
  if (giftCopy && gift.accountNumber) giftCopy.setAttribute("data-copy", gift.accountNumber);
  if (giftQr && gift.qrImage){
    giftQr.src = gift.qrImage;
    addImgFallback(giftQr);
  }

  // images
  $("#heroImg").src = c.images.hero;
  addImgFallback($("#heroImg"));

  // album
  const gallery = $("#gallery");
  gallery.innerHTML = c.images.album.map((it) => `
    <button class="shot reveal" data-img="${it.src}">
      <img alt="${escapeHtml(it.label)}" src="${it.src}" loading="lazy">
      <span>${escapeHtml(it.label)}</span>
    </button>
  `).join("");
  $$(".shot img").forEach(addImgFallback);
})();

// ===== Gate open
$("#btnOpen").addEventListener("click", async () => {
  $("#gate").style.display = "none";
  try { await $("#bgm").play(); $("#btnMusic").dataset.on = "1"; $("#btnMusic").textContent = "❚❚ Nhạc"; } catch {}
});
$("#btnQuick").addEventListener("click", () => { $("#gate").style.display = "none"; });

// ===== Reveal
(function initReveal(){
  const io = new IntersectionObserver((entries) => {
    for (const e of entries){
      if (e.isIntersecting){ e.target.classList.add("show"); io.unobserve(e.target); }
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));
})();

// ===== Countdown
(function initCountdown(){
  const targetStr = window.INVITE.events.countdownTarget;
  const target = new Date(targetStr);

  function tick(){
    const now = new Date();
    let diff = target - now;
    if (diff <= 0){
      $("#d").textContent = "00"; $("#h").textContent = "00"; $("#m").textContent = "00"; $("#s").textContent = "00";
      return;
    }
    const sec = Math.floor(diff/1000);
    const days = Math.floor(sec/86400);
    const hours = Math.floor((sec%86400)/3600);
    const mins = Math.floor((sec%3600)/60);
    const secs = sec%60;

    $("#d").textContent = pad2(days);
    $("#h").textContent = pad2(hours);
    $("#m").textContent = pad2(mins);
    $("#s").textContent = pad2(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

// ===== Music
(function initMusic(){
  const bgm = $("#bgm");
  const vol = $("#vol");
  bgm.volume = Number(vol.value);

  $("#btnMusic").addEventListener("click", async () => {
    const on = $("#btnMusic").dataset.on === "1";
    if (on){
      bgm.pause();
      $("#btnMusic").dataset.on = "0";
      $("#btnMusic").textContent = "♫ Nhạc";
    } else {
      try { await bgm.play(); $("#btnMusic").dataset.on = "1"; $("#btnMusic").textContent = "❚❚ Nhạc"; } catch {}
    }
  });

  vol.addEventListener("input", (e) => { bgm.volume = Number(e.target.value); });
})();

// ===== Gift modal + copy
$("#btnGift").addEventListener("click", () => show($("#giftModal")));
$("#giftClose").addEventListener("click", () => hide($("#giftModal")));
$("#giftModal").addEventListener("click", (e) => { if (e.target === $("#giftModal")) hide($("#giftModal")); });

$$("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy");
    try{
      await navigator.clipboard.writeText(text);
      btn.textContent = "✅ Đã copy";
      setTimeout(()=> btn.textContent = "📋 Copy STK", 1200);
    } catch {
      alert("Không copy được. Bạn copy thủ công: " + text);
    }
  });
});

// ===== Image modal
const imgModal = $("#imgModal");
const imgView = $("#imgView");
addImgFallback(imgView);
$("#imgClose").addEventListener("click", () => hide(imgModal));
imgModal.addEventListener("click", (e) => { if (e.target === imgModal) hide(imgModal); });
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".shot");
  if (!btn) return;
  imgView.src = btn.dataset.img;
  show(imgModal);
});

// ===== RSVP (demo)
$("#rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#rsvpToast").style.display = "block";
  setTimeout(()=> $("#rsvpToast").style.display = "none", 1600);
  e.target.reset();
});

// ===== Wishes (localStorage demo)
const wishList = $("#wishList");
function loadWishes(){
  const data = JSON.parse(localStorage.getItem("wishes") || "[]");
  wishList.innerHTML = data.map(w => `
    <div class="wish">
      <div class="top">
        <b>${escapeHtml(w.name)}${w.rel ? ` <small>• ${escapeHtml(w.rel)}</small>` : ""}</b>
        <small>${new Date(w.ts).toLocaleString()}</small>
      </div>
      <p>${escapeHtml(w.text)}</p>
    </div>
  `).join("");
}
$("#wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#wishName").value.trim();
  const rel = $("#wishRel").value.trim();
  const text = $("#wishText").value.trim();
  if (!name || !text) return;

  const data = JSON.parse(localStorage.getItem("wishes") || "[]");
  data.unshift({ name, rel, text, ts: Date.now() });
  localStorage.setItem("wishes", JSON.stringify(data));

  e.target.reset();
  $("#wishToast").style.display = "block";
  setTimeout(()=> $("#wishToast").style.display = "none", 1400);
  loadWishes();
});
loadWishes();

// ===== Calendar Feb 2026 (highlight 6 & 7)
(function renderCalendar(){
  const holder = $("#calendar");
  const year = 2026, monthIndex = 1; // Feb = 1
  const highlights = new Set([6,7]);

  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex+1, 0).getDate();

  // VN headers
  const headers = ["T2","T3","T4","T5","T6","T7","CN"];

  // JS: Sun=0..Sat=6 => convert to Monday-first
  const jsDay = first.getDay(); // 0=CN
  const offset = (jsDay + 6) % 7; // 0 if Monday

  let html = `<div class="cal">
    <div class="cal-head">${headers.map(h=>`<div>${h}</div>`).join("")}</div>
    <div class="cal-grid">`;

  // blanks
  for (let i=0;i<offset;i++) html += `<div class="cal-cell empty"></div>`;

  for (let d=1; d<=daysInMonth; d++){
    const cls = highlights.has(d) ? "cal-cell hot" : "cal-cell";
    html += `<div class="${cls}"><span>${d}</span></div>`;
  }

  html += `</div></div>`;
  holder.innerHTML = html;
})();

// ===== ICS Export
function downloadICS({ title, startISO, durationHours, locationText, descriptionText }){
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationHours*60*60*1000);

  const toICS = (d) => {
    const z = (n) => String(n).padStart(2,"0");
    // Local time format (floating)
    return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}T${z(d.getHours())}${z(d.getMinutes())}00`;
  };

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invite//VI
BEGIN:VEVENT
DTSTART:${toICS(start)}
DTEND:${toICS(end)}
SUMMARY:${title}
LOCATION:${locationText}
DESCRIPTION:${descriptionText}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^\w\- ]+/g,"").slice(0,40)}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
}

$("#btnIcsParty").addEventListener("click", () => {
  const c = window.INVITE;
  downloadICS({
    title: c.events.party.title,
    startISO: c.events.party.startISO,
    durationHours: c.events.party.durationHours,
    locationText: `${c.location.placeName} — ${c.location.addressLine}`,
    descriptionText: "Trân trọng kính mời bạn đến chung vui."
  });
});
$("#btnIcsWedding").addEventListener("click", () => {
  const c = window.INVITE;
  downloadICS({
    title: c.events.wedding.title,
    startISO: c.events.wedding.startISO,
    durationHours: c.events.wedding.durationHours,
    locationText: `${c.location.placeName} — ${c.location.addressLine}`,
    descriptionText: "Trân trọng kính mời bạn đến chung vui."
  });
});
