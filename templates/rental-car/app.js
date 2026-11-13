/* Harbor Rent demo - reads cars.json and renders the list. Vanilla JS, no deps. */
const harborConfig = {
  lineUrl: "https://line.me/R/ti/p/@example", // 示意連結，換成自己的 LINE 官方帳號
  dataUrl: "cars.json",
  categoryOrder: ["豪華轎車", "商務車", "國產代步車", "休旅 SUV"],
};
const harborTones = {
  navy:["#1d3557","#3d5a80"], slate:["#2b3a4a","#5c6b7a"], wine:["#4a1c2b","#8a3b52"],
  teal:["#0f4c5c","#2a8c9a"], sand:["#8a7350","#cdb78b"], green:["#1f4a3a","#4f8f72"],
};
const harborEl = (id) => document.getElementById(id);
const harborState = { cars: [], active: "全部" };

function harborLineHref(car) {
  const text = car ? `您好，想詢問「${car.name}」的檔期與價格` : "您好，想詢問租車";
  return harborConfig.lineUrl; // 假連結不帶參數；正式帳號可改用 ?text= 預填
}
function harborEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
/* 示意插圖：沒有 image 欄位時，用 SVG 畫車側影 */
function harborIllustration(car) {
  const [a, b] = harborTones[car.tone] || harborTones.navy;
  const van = car.category === "商務車", suv = car.category === "休旅 SUV";
  const body = van
    ? "M30 118 L36 78 Q40 66 54 64 L190 62 Q214 64 226 86 L236 108 Q240 118 232 120 L40 120 Z"
    : suv
    ? "M28 118 L36 84 Q40 72 56 70 L100 68 L124 46 Q130 42 142 42 L184 44 Q198 46 206 62 L220 76 Q238 82 240 104 L242 118 Z"
    : "M26 118 L34 96 Q40 86 58 84 L96 80 L124 56 Q132 50 146 50 L186 52 Q198 56 208 74 L224 82 Q240 88 242 106 L244 118 Z";
  const win = van
    ? "M56 70 L88 70 L88 92 L52 92 Z M96 70 L144 70 L144 92 L96 92 Z M152 70 L196 70 Q208 76 214 92 L152 92 Z"
    : "M104 80 L128 58 Q132 55 142 55 L180 57 Q190 60 198 76 Z";
  const id = "g" + car.id.replace(/\W/g, "");
  return `<svg viewBox="0 0 270 170" role="img" aria-label="${harborEsc(car.name)} 示意圖" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="270" height="170" fill="url(#${id})"/>
  <circle cx="215" cy="38" r="22" fill="#fff" opacity=".12"/>
  <rect y="132" width="270" height="38" fill="#000" opacity=".22"/>
  <ellipse cx="135" cy="134" rx="108" ry="6" fill="#000" opacity=".35"/>
  <path d="${body}" fill="#f4f1ea" opacity=".95"/>
  <path d="${win}" fill="${a}" opacity=".75"/>
  <g fill="#1a1f26"><circle cx="76" cy="122" r="17"/><circle cx="198" cy="122" r="17"/></g>
  <g fill="#cfd5dc"><circle cx="76" cy="122" r="8"/><circle cx="198" cy="122" r="8"/></g>
  </svg>`;
}
function harborCard(car) {
  const photo = car.image
    ? `<img src="${harborEsc(car.image)}" alt="${harborEsc(car.name)}" loading="lazy">`
    : harborIllustration(car);
  const ok = car.available !== false;
  const price = Number(car.price_per_day);
  return `<article class="car">
    <div class="photo">${photo}<span class="tag">${harborEsc(car.category)}</span>${ok ? "" : '<div class="sold">目前已出租</div>'}</div>
    <div class="body">
      <h3>${harborEsc(car.name)}</h3>
      <p class="for">適合：${harborEsc(car.best_for)}</p>
      <ul class="specs">${(car.specs || []).map((s) => `<li>${harborEsc(s)}</li>`).join("")}</ul>
      <div class="price"><strong>NT$ ${Number.isFinite(price) ? price.toLocaleString() : "洽詢"}<small> / 日</small></strong>
        ${car.deposit ? `<span class="dep">押金 NT$ ${Number(car.deposit).toLocaleString()}</span>` : ""}</div>
      <a class="btn btn-line" href="${harborLineHref(car)}" target="_blank" rel="noopener" aria-disabled="${!ok}">${ok ? "LINE 詢價此車款" : "詢問其他車款"}</a>
    </div></article>`;
}
function harborRender() {
  const { cars, active } = harborState;
  const list = active === "全部" ? cars : cars.filter((c) => c.category === active);
  harborEl("car-grid").innerHTML = list.length
    ? list.map(harborCard).join("")
    : '<div class="notice" style="grid-column:1/-1"><b>這個分類暫時沒有車款</b>請改選其他分類，或直接 LINE 詢問。</div>';
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === active)));
}
function harborFilters() {
  const cats = harborConfig.categoryOrder.filter((c) => harborState.cars.some((x) => x.category === c));
  harborState.cars.forEach((x) => { if (!cats.includes(x.category)) cats.push(x.category); });
  const count = (c) => (c === "全部" ? harborState.cars.length : harborState.cars.filter((x) => x.category === c).length);
  harborEl("filters").innerHTML = ["全部", ...cats]
    .map((c) => `<button class="chip" type="button" data-cat="${harborEsc(c)}" aria-pressed="false">${harborEsc(c)}<em>${count(c)}</em></button>`).join("");
  harborEl("filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    harborState.active = b.dataset.cat; harborRender();
  });
}
function harborFail(detail) {
  harborEl("car-grid").innerHTML = `<div class="notice" style="grid-column:1/-1"><b>車款資料暫時無法載入</b>
    請稍後重新整理，或直接點下方按鈕 LINE 詢問，我們會立即回覆。<br><br>
    <a class="btn btn-line" href="${harborConfig.lineUrl}" target="_blank" rel="noopener">加 LINE 詢價</a>
    <p style="font-size:.78rem;margin-top:14px">${harborEsc(detail)}</p></div>`;
}
async function harborLoad() {
  let data;
  try {
    const res = await fetch(harborConfig.dataUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    data = await res.json();
  } catch (err) {
    // file:// 預覽時瀏覽器禁止 fetch，改用備援資料；兩者都沒有才顯示友善訊息
    if (window.CARS_FALLBACK) data = window.CARS_FALLBACK;
    else return harborFail("（技術訊息：cars.json 讀取失敗 — " + err.message + "）");
  }
  const cars = Array.isArray(data) ? data : data && data.cars;
  if (!Array.isArray(cars) || !cars.length) return harborFail("（技術訊息：cars.json 格式不正確或沒有車款）");
  harborState.cars = cars;
  harborFilters(); harborRender();
}
document.querySelectorAll("[data-line]").forEach((a) => { a.href = harborConfig.lineUrl; });
harborLoad();
