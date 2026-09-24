/**
 * AURA LAB // PRODUCT DETAIL INTERACTION ENGINE (PDP)
 * Handles: Multi-angle gallery switching, size selection matrix,
 * color swatches, quantity controls, and technical accordions.
 */

// PDP Gallery Views
const PRODUCT_VIEWS = [
  'https://lh3.googleusercontent.com/aida/AEtjO1XhmTK9Zk7HhARA54Cck6EDWx2JYs7o5rkdfJ9Rrkj0ZVsVji0Xt_tfSX_8F6WqRM2bnNasSb6B5wDpMabtDFxVC5bauWpnX2z9Tl2UVQXvhlij8n8YqPQWDKva8tCBkDEqAQ-dl5z6lGOBfjjjdRy7YQDkpEM-1sBB-FzBlLlgQ0dVhi4WrebasEntrqWKmtwpkgnRhWJ4Y9YKdIdjxoIb6wwQY1UZi48xCkPNMgz2VKv3UnX8N3ZmTGph',
  'https://lh3.googleusercontent.com/aida/AEtjO1X5urk3CYU1AsUjF7idhC5hneGf0ckVTbwEA4h6BZllLQicYTvDiR88fc8Njp55J2yzr3weR78OFfIe9Zooj6JUmCVr8mL6lUcDZcsTmXum97f_S8PGISfnr_6kw1x27moXnKXgt-fo4CFQLchCmVM2pWw6MN1HyFOciNGvSpjvun7CSjhMwXgzCoFld9_i-2sbEUMagxSP8iVNWtLjSD-KoferxJsGB2zNTfnz8J-gZa9XUnI48Tdo1xs_',
  'https://lh3.googleusercontent.com/aida/AEtjO1Uz7fx5bGomJqieSdFI4mv_uw_3vgeOhkN1iPlCnX4QJxiJyQM7uaKEuTUFNBGudfUeeTMyaK2DuS_-JkyTwqLTwEtt7bbCCpyxVwKf3mZrlq6_IjcAlkkdlQ-biJM-4JLHwvZ4ZthDil0p4vk4-DlGP9ggJayjOrayBYSKHu6xB0mw8xkYbS6HkuHNQmaVSKURrke2TocAKvzXGpcw9Rd1enPihlzmah68gRdS8FdHS7EB1G5lbTQXeFD4',
  'https://lh3.googleusercontent.com/aida/AEtjO1WnvWyVnFYd1n2oCSmfTDSRriqC56edzzytCNzW9t2Unt0Q6cCtEsUEfswsPUnAxSQMwsn3fEfEAH9lzYQBcqqSFJFxL8EA-5MFFtchj3RbdWxXno20LrFosYZzmldoFZfg6UvgedKf0zSFxBk3w7DQiZHa2DlgiZDu0sl-thmGOmHVb3x2CpQ-zsa2IKXgly7xxj-PGBS40s_RToRV9IuUfUW7mpm07l6iIaE0gkIRByEPvRd0bK9WIOKf'
];

let selectedSize = 'M';
let selectedColor = 'Matte Obsidian';
let pdpQuantity = 1;

// Change Active Main Gallery Image
function changeView(viewIndex, btnElement) {
  const mainImg = document.getElementById('main-product-image');
  if (mainImg && PRODUCT_VIEWS[viewIndex]) {
    mainImg.style.opacity = '0.5';
    mainImg.src = PRODUCT_VIEWS[viewIndex];
    setTimeout(() => {
      mainImg.style.opacity = '1';
    }, 150);
  }

  const thumbBtns = document.querySelectorAll('.thumbnail-btn');
  thumbBtns.forEach((btn, idx) => {
    if (idx === viewIndex) {
      btn.className = 'thumbnail-btn aspect-square rounded-xl bg-surface-container-low overflow-hidden transition-all duration-200 shadow-sm ring-2 ring-primary opacity-100';
    } else {
      btn.className = 'thumbnail-btn aspect-square rounded-xl bg-surface-container-low overflow-hidden transition-all duration-200 shadow-sm opacity-60 hover:opacity-100';
    }
  });
}

// Select Product Size
function selectPdpSize(size, btn) {
  selectedSize = size;
  const label = document.getElementById('current-selected-size');
  if (label) label.textContent = size;

  const sizeBtns = document.querySelectorAll('.size-select-btn');
  sizeBtns.forEach(b => {
    b.className = 'size-select-btn py-2.5 rounded-xl bg-surface-container font-label-numeric text-label-numeric font-bold text-primary hover:bg-surface-container-high transition-colors text-center cursor-pointer';
  });

  btn.className = 'size-select-btn py-2.5 rounded-xl bg-primary text-on-primary font-label-numeric text-label-numeric font-bold transition-colors text-center cursor-pointer';
}

// Select Product Color Swatch
function selectPdpColor(colorName, hex, btn) {
  selectedColor = colorName;
  const label = document.getElementById('current-selected-color');
  if (label) label.textContent = colorName;

  const colorBtns = document.querySelectorAll('.color-swatch-btn');
  colorBtns.forEach(b => {
    b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary');
  });

  btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
}

// Modify Quantity
function adjustPdpQty(delta) {
  pdpQuantity = Math.max(1, Math.min(10, pdpQuantity + delta));
  const qtyDisplay = document.getElementById('pdp-qty-display');
  if (qtyDisplay) qtyDisplay.textContent = pdpQuantity;
}

// Toggle Specifications Accordion
function togglePdpAccordion(sectionId) {
  const content = document.getElementById(sectionId);
  const icon = document.getElementById('icon-' + sectionId);

  if (content) {
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      content.classList.add('hidden');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  }
}

// Add Current Product to Cart
function addPdpProductToCart() {
  const mainImg = document.getElementById('main-product-image');
  addToCart({
    id: 'prod-training-tee',
    title: 'Performance Essential Training T-Shirt',
    size: selectedSize,
    color: selectedColor,
    price: 95.00,
    qty: pdpQuantity,
    image: mainImg ? mainImg.src : PRODUCT_VIEWS[0]
  });
}
