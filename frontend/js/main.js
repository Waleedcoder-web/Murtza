/**
 * AURA LAB // E-COMMERCE CORE JAVASCRIPT ENGINE
 * Handles: Cart State (localStorage), Wishlist, Notification Toasts,
 * Quick-Bag Drawer, Search Filter, Navigation & Currency Switcher.
 */

// Global State
const STORAGE_KEYS = {
  CART: 'aura_cart_items',
  WISHLIST: 'aura_wishlist_items',
  CURRENCY: 'aura_currency_pref',
  ANNOUNCEMENT: 'aura_dismiss_announcement'
};

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  CHF: { symbol: 'CHF ', rate: 0.88, label: 'CHF' }
};

let currentCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';

// Initial default cart items if empty (matching the Stitch design showcase)
const DEFAULT_CART = [
  {
    id: 'prod-storm-shell',
    title: 'Aura Aerovent™ Storm Shell',
    size: 'L',
    color: 'Matte Obsidian',
    price: 220.00,
    qty: 1,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WnvWyVnFYd1n2oCSmfTDSRriqC56edzzytCNzW9t2Unt0Q6cCtEsUEfswsPUnAxSQMwsn3fEfEAH9lzYQBcqqSFJFxL8EA-5MFFtchj3RbdWxXno20LrFosYZzmldoFZfg6UvgedKf0zSFxBk3w7DQiZHa2DlgiZDu0sl-thmGOmHVb3x2CpQ-zsa2IKXgly7xxj-PGBS40s_RToRV9IuUfUW7mpm07l6iIaE0gkIRByEPvRd0bK9WIOKf'
  },
  {
    id: 'prod-seamless-set',
    title: 'Sculpt Seamless Compression Set',
    size: 'S',
    color: 'Mineral Slate',
    price: 145.00,
    qty: 1,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1Uz7fx5bGomJqieSdFI4mv_uw_3vgeOhkN1iPlCnX4QJxiJyQM7uaKEuTUFNBGudfUeeTMyaK2DuS_-JkyTwqLTwEtt7bbCCpyxVwKf3mZrlq6_IjcAlkkdlQ-biJM-4JLHwvZ4ZthDil0p4vk4-DlGP9ggJayjOrayBYSKHu6xB0mw8xkYbS6HkuHNQmaVSKURrke2TocAKvzXGpcw9Rd1enPihlzmah68gRdS8FdHS7EB1G5lbTQXeFD4'
  }
];

// --- CART CONTROLLER ---
function getCart() {
  const raw = localStorage.getItem(STORAGE_KEYS.CART);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(DEFAULT_CART));
    return DEFAULT_CART;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_CART;
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  renderCartDrawer();
  updateHeaderBadges();
}

function addToCart(product) {
  const cart = getCart();
  const existingIdx = cart.findIndex(item => item.id === product.id && item.size === product.size);
  if (existingIdx > -1) {
    cart[existingIdx].qty += (product.qty || 1);
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      size: product.size || 'M',
      color: product.color || 'Matte Obsidian',
      price: product.price,
      qty: product.qty || 1,
      image: product.image
    });
  }
  saveCart(cart);
  showToast('Item Added to Bag', `${product.title} (Size: ${product.size || 'M'}) — $${product.price.toFixed(2)}`);
  openCartDrawer();
}

function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
  showToast('Item Removed', 'Item removed from your shopping bag.');
}

function updateQuantity(id, size, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id, size);
      return;
    }
  }
  saveCart(cart);
}

function renderCartDrawer() {
  const cart = getCart();
  const container = document.getElementById('cart-items-container');
  const countDisplay = document.getElementById('cart-drawer-count');
  const subtotalDisplay = document.getElementById('cart-subtotal');
  const totalDisplay = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn-text');
  const shippingThreshold = 150.00;

  let totalCount = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalCount += item.qty;
    subtotal += item.price * item.qty;
  });

  if (countDisplay) countDisplay.textContent = `Your Bag (${totalCount} Item${totalCount === 1 ? '' : 's'})`;
  if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
  if (totalDisplay) totalDisplay.textContent = `$${subtotal.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.textContent = `Proceed to Checkout — $${subtotal.toFixed(2)}`;

  // Free Shipping Progress calculation
  const shippingProgress = document.getElementById('free-shipping-progress');
  const shippingText = document.getElementById('free-shipping-text');
  const shippingDiff = document.getElementById('free-shipping-diff');

  if (shippingProgress && shippingText && shippingDiff) {
    if (subtotal >= shippingThreshold) {
      shippingProgress.style.width = '100%';
      shippingText.textContent = 'Unlocked Free Express Shipping!';
      shippingDiff.textContent = 'QUALIFIED';
      shippingDiff.className = 'text-emerald-600 font-bold';
    } else {
      const remaining = (shippingThreshold - subtotal).toFixed(2);
      const pct = Math.min(100, Math.max(5, (subtotal / shippingThreshold) * 100));
      shippingProgress.style.width = `${pct}%`;
      shippingText.textContent = `Add $${remaining} more to qualify for complimentary worldwide express shipping.`;
      shippingDiff.textContent = `$${remaining} Away`;
      shippingDiff.className = 'text-secondary font-bold';
    }
  }

  // Render items list
  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center space-y-3">
          <div class="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span class="material-symbols-outlined text-[32px]">shopping_bag</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm font-bold text-primary">Your Bag is Empty</h3>
          <p class="font-body-sm text-body-sm text-secondary max-w-xs mx-auto">Explore high-performance activewear calibrated for peak human movement.</p>
          <a href="categories.html" class="inline-block mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-uppercase text-label-uppercase uppercase tracking-wider hover:bg-surface-tint transition-all">Explore Catalogue</a>
        </div>
      `;
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="flex gap-space-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 relative">
        <div class="w-20 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
          <img alt="${item.title}" class="w-full h-full object-cover" src="${item.image}">
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div class="space-y-0.5 pr-6">
            <h3 class="font-headline-sm text-[14px] font-bold text-primary leading-tight">${item.title}</h3>
            <div class="font-body-sm text-[12px] text-secondary">
              Size: <span class="font-medium text-primary">${item.size}</span> | Color: <span class="font-medium text-primary">${item.color}</span>
            </div>
          </div>
          <button onclick="removeFromCart('${item.id}', '${item.size}')" aria-label="Remove item" class="absolute top-3 right-3 text-secondary hover:text-error transition-colors">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-2 bg-surface-container rounded-lg px-2 py-1">
              <button onclick="updateQuantity('${item.id}', '${item.size}', -1)" aria-label="Decrease" class="text-primary hover:text-secondary text-[14px] leading-none font-bold px-1">−</button>
              <span class="font-label-numeric text-[12px] font-bold text-primary px-1">${item.qty}</span>
              <button onclick="updateQuantity('${item.id}', '${item.size}', 1)" aria-label="Increase" class="text-primary hover:text-secondary text-[14px] leading-none font-bold px-1">+</button>
            </div>
            <span class="font-headline-sm text-[15px] font-bold text-primary">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Drawer open / close
function openCartDrawer() {
  const drawer = document.getElementById('quick-cart-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('quick-cart-drawer');
  if (drawer) {
    drawer.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// --- WISHLIST CONTROLLER ---
function getWishlist() {
  const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  return raw ? JSON.parse(raw) : ['prod-training-tee', 'prod-storm-shell'];
}

function toggleWishlist(productId, btnElement) {
  let wishlist = getWishlist();
  const exists = wishlist.includes(productId);
  if (exists) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast('Removed from Wishlist', 'Item has been removed from your saved items.');
  } else {
    wishlist.push(productId);
    showToast('Saved to Wishlist', 'Item added to your performance wishlist.');
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));

  if (btnElement) {
    const icon = btnElement.querySelector('.material-symbols-outlined');
    if (icon) {
      if (!exists) {
        icon.style.fontVariationSettings = "'FILL' 1";
        icon.style.color = '#e11d48';
      } else {
        icon.style.fontVariationSettings = "'FILL' 0";
        icon.style.color = '';
      }
    }
  }
  updateHeaderBadges();
}

// Update header bag and wishlist counters
function updateHeaderBadges() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const bagBadge = document.getElementById('header-cart-count');
  if (bagBadge) bagBadge.textContent = totalQty;

  const wishlist = getWishlist();
  const wishBadge = document.getElementById('header-wishlist-count');
  if (wishBadge) wishBadge.textContent = wishlist.length;
}

// Toast notification
let toastTimer = null;
function showToast(title, desc) {
  const toast = document.getElementById('cart-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  if (!toast) return;
  if (toastTitle) toastTitle.textContent = title;
  if (toastDesc) toastDesc.textContent = desc;

  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    hideToast();
  }, 4000);
}

function hideToast() {
  const toast = document.getElementById('cart-toast');
  if (toast) {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }
}

// Quick Add helper
function quickAdd(productId, title, size, price, image) {
  addToCart({
    id: productId,
    title: title,
    size: size,
    color: 'Matte Obsidian',
    price: price,
    qty: 1,
    image: image
  });
}

// Quick Add Upsell Item
function addUpsellItem() {
  addToCart({
    id: 'prod-carbon-shorts',
    title: 'Kinetic Carbon Training Shorts',
    size: 'M',
    color: 'Matte Obsidian',
    price: 88.00,
    qty: 1,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1X5urk3CYU1AsUjF7idhC5hneGf0ckVTbwEA4h6BZllLQicYTvDiR88fc8Njp55J2yzr3weR78OFfIe9Zooj6JUmCVr8mL6lUcDZcsTmXum97f_S8PGISfnr_6kw1x27moXnKXgt-fo4CFQLchCmVM2pWw6MN1HyFOciNGvSpjvun7CSjhMwXgzCoFld9_i-2sbEUMagxSP8iVNWtLjSD-KoferxJsGB2zNTfnz8J-gZa9XUnI48Tdo1xs_'
  });
}

// Simulated Checkout Action
function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your bag is empty.');
    return;
  }
  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const confirmed = confirm(`Proceed to secure Stripe checkout for $${total.toFixed(2)} USD?\n\nFree carbon neutral express shipping included.`);
  if (confirmed) {
    alert('Thank you for choosing AURA Lab.\nOrder #AUR-98024 has been generated and dispatched to the Zurich Logistics Hub.');
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    renderCartDrawer();
    updateHeaderBadges();
    closeCartDrawer();
  }
}

// Search Modal Controls
function toggleSearchModal(show) {
  const modal = document.getElementById('search-modal');
  if (modal) {
    if (show) {
      modal.classList.remove('hidden');
      document.getElementById('search-input')?.focus();
    } else {
      modal.classList.add('hidden');
    }
  }
}

// Mobile Navigation Drawer
function toggleMobileMenu(show) {
  const menu = document.getElementById('mobile-nav-drawer');
  if (menu) {
    if (show) {
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  }
}

// Currency Switcher
function switchCurrency(code) {
  if (CURRENCIES[code]) {
    currentCurrency = code;
    localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
    const label = document.getElementById('current-currency-label');
    if (label) label.textContent = code;
    showToast('Currency Updated', `Display pricing converted to ${code}.`);
  }
}

// Dismiss Announcement Bar
function dismissAnnouncement() {
  const bar = document.getElementById('top-announcement-bar');
  if (bar) {
    bar.style.display = 'none';
    sessionStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, 'true');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderCartDrawer();
  updateHeaderBadges();

  if (sessionStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT) === 'true') {
    const bar = document.getElementById('top-announcement-bar');
    if (bar) bar.style.display = 'none';
  }

  // Keyboard escape handler for modals & drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      toggleSearchModal(false);
      toggleMobileMenu(false);
    }
  });
});
