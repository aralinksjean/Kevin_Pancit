/**
 * Menu data loading, rendering, search, filters, and dish-detail modal.
 * Used by both index.html (featured dishes) and menu.html (full interactive menu).
 */
(function () {
  "use strict";

  // Kept in sync with data/menu.json. Used only as a fallback when fetch() cannot
  // reach the JSON file (for example when the site is opened directly via file://).
  const FALLBACK_MENU = [
    { id: "pancit-canton", name: "Pancit Canton", description: "A beloved stir-fried wheat noodle dish tossed with mixed vegetables and your choice of meat or seafood in a savory soy-based sauce.", region: "Nationwide", category: "Classic Pancit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pancit_Canton_in_white_plate.jpg/960px-Pancit_Canton_in_white_plate.jpg", price: 130, featured: true, available: true, ingredients: [], allergens: [], culturalNote: "Long noodles like canton are traditionally served at Filipino birthdays and celebrations, symbolizing a long life." },
    { id: "pancit-bihon", name: "Pancit Bihon", description: "A light, savory dish of thin rice noodles stir-fried with julienned vegetables, meat, and a touch of soy sauce.", region: "Nationwide", category: "Classic Pancit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Pancit_bihon_%28Philippines%29_06.jpg/960px-Pancit_bihon_%28Philippines%29_06.jpg", price: 120, featured: false, available: true, ingredients: [], allergens: [], culturalNote: "One of the most common pancit variations found in homes and gatherings across the Philippines." },
    { id: "pancit-malabon", name: "Pancit Malabon", description: "Thick rice noodles bathed in a rich, orange-hued shrimp sauce and generously topped with seafood and vegetables.", region: "Malabon City", category: "Seafood Pancit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Pancit_Malabon.jpg/960px-Pancit_Malabon.jpg", price: 150, featured: true, available: true, ingredients: [], allergens: [], culturalNote: "Named after Malabon City, a coastal community known for its abundant seafood." },
    { id: "pancit-palabok", name: "Pancit Palabok", description: "Rice noodles covered in a savory shrimp and annatto sauce, topped with crushed chicharrón, shrimp, egg, and scallions.", region: "Manila / Luzon-wide", category: "Regional Specialties", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Pancit_Palabok_2.jpg/960px-Pancit_Palabok_2.jpg", price: 180, featured: true, available: true, ingredients: [], allergens: [], culturalNote: "A festive favorite often prepared for fiestas and special family occasions." },
    { id: "pancit-batil-patung", name: "Pancit Batil Patung", description: "A hearty noodle dish from Tuguegarao, topped with a cracked fried egg (\"batil\") and a ladle of flavorful beef broth and toppings (\"patung\").", region: "Tuguegarao City, Cagayan", category: "Regional Specialties", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pancit_Batil_Patong.jpg/960px-Pancit_Batil_Patong.jpg", price: 60, featured: true, available: true, ingredients: [], allergens: [], culturalNote: "A signature street-food dish of the Cagayan Valley, often sold by vendors called 'miki houses'." },
    { id: "pancit-habhab", name: "Pancit Habhab", description: "A Lucban specialty traditionally served on a banana leaf and eaten utensil-free, straight from the leaf — a style known as 'habhab'.", region: "Lucban, Quezon", category: "Regional Specialties", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Pansit_Habhab.jpg/960px-Pansit_Habhab.jpg", price: 35, featured: false, available: false, ingredients: [], allergens: [], culturalNote: "The 'habhab' eating style is a playful Lucban tradition said to have started among students in a hurry between classes." },
    { id: "pancit-lomi", name: "Pancit Lomi", description: "A hearty, thick egg-noodle soup simmered in a starchy pork or chicken broth — comforting on any rainy day.", region: "Batangas", category: "Soup-Based Noodles", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/BATANGAS_LOMI.jpg/960px-BATANGAS_LOMI.jpg", price: 90, featured: false, available: true, ingredients: [], allergens: [], culturalNote: "A Batangas comfort food enjoyed as a warm snack or meal, especially during cooler weather." },
    { id: "pancit-molo", name: "Pancit Molo", description: "A savory dumpling soup inspired by Chinese wonton soup, featuring delicate meat-filled dumplings in a clear, flavorful broth.", region: "Molo, Iloilo City", category: "Soup-Based Noodles", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pancit_Molo.jpg/960px-Pancit_Molo.jpg", price: 140, featured: false, available: true, ingredients: [], allergens: [], culturalNote: "Named after the Molo district of Iloilo City, reflecting the area's long history of Chinese-Filipino cuisine." }
  ];

  const state = {
    allDishes: [],
    activeCategory: "All Dishes",
    searchTerm: "",
    featuredOnly: false,
    lastFocusedElement: null
  };

  document.addEventListener("DOMContentLoaded", function () {
    loadMenuData().then(function (dishes) {
      state.allDishes = dishes;
      renderHomeFeatured();
      initCategoryFilters();
      renderMenuPage();
      attachControlEvents();
    });
    initModal();
  });

  function loadMenuData() {
    return fetch("data/menu.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .catch(function () {
        return FALLBACK_MENU;
      });
  }

  // ---------- Homepage featured grid ----------

  function renderHomeFeatured() {
    const grid = document.getElementById("homeFeaturedGrid");
    if (!grid) return;
    grid.innerHTML = "";
    state.allDishes.forEach(function (dish) {
      grid.appendChild(buildDishCard(dish));
    });
  }

  // ---------- Menu page ----------

  function renderMenuPage() {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    applyFiltersAndRender();
  }

  function initCategoryFilters() {
    const container = document.getElementById("categoryFilters");
    if (!container) return;

    const categories = ["All Dishes"].concat(
      Array.from(new Set(state.allDishes.map(function (d) { return d.category; })))
    );

    container.innerHTML = "";
    categories.forEach(function (category) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.textContent = category;
      button.setAttribute("data-category", category);
      button.setAttribute("aria-pressed", category === "All Dishes" ? "true" : "false");
      if (category === "All Dishes") button.classList.add("is-active");
      button.addEventListener("click", function () {
        state.activeCategory = category;
        container.querySelectorAll(".filter-chip").forEach(function (btn) {
          const isActive = btn === button;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-pressed", String(isActive));
        });
        applyFiltersAndRender();
      });
      container.appendChild(button);
    });
  }

  function attachControlEvents() {
    const searchInput = document.getElementById("menuSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.searchTerm = searchInput.value.trim().toLowerCase();
        applyFiltersAndRender();
      });
    }

    const featuredToggle = document.getElementById("featuredToggle");
    if (featuredToggle) {
      featuredToggle.addEventListener("change", function () {
        state.featuredOnly = featuredToggle.checked;
        applyFiltersAndRender();
      });
    }

    const resetButton = document.getElementById("resetFilters");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        state.activeCategory = "All Dishes";
        state.searchTerm = "";
        state.featuredOnly = false;
        if (searchInput) searchInput.value = "";
        if (featuredToggle) featuredToggle.checked = false;
        document.querySelectorAll(".filter-chip").forEach(function (btn) {
          const isActive = btn.getAttribute("data-category") === "All Dishes";
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-pressed", String(isActive));
        });
        applyFiltersAndRender();
      });
    }
  }

  function applyFiltersAndRender() {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;

    const filtered = state.allDishes.filter(function (dish) {
      const matchesCategory = state.activeCategory === "All Dishes" || dish.category === state.activeCategory;
      const matchesSearch = !state.searchTerm ||
        dish.name.toLowerCase().includes(state.searchTerm) ||
        dish.description.toLowerCase().includes(state.searchTerm) ||
        dish.region.toLowerCase().includes(state.searchTerm);
      const matchesFeatured = !state.featuredOnly || dish.featured;
      return matchesCategory && matchesSearch && matchesFeatured;
    });

    grid.innerHTML = "";
    filtered.forEach(function (dish) {
      grid.appendChild(buildDishCard(dish));
    });

    const emptyState = document.getElementById("emptyState");
    if (emptyState) emptyState.hidden = filtered.length !== 0;

    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
      const label = state.activeCategory === "All Dishes" ? "dishes" : state.activeCategory.toLowerCase();
      resultsCount.textContent = filtered.length + " " + (filtered.length === 1 ? "dish" : label) + " shown";
    }
  }

  // ---------- Card + modal rendering ----------

  function buildDishCard(dish) {
    const card = document.createElement("article");
    card.className = "dish-card";

    const figure = document.createElement("div");
    figure.className = "dish-card-image";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = dish.image;
    img.alt = dish.name + " — Filipino pancit dish";
    img.addEventListener("error", function () {
      figure.classList.add("image-fallback");
      img.remove();
      const fallbackLabel = document.createElement("span");
      fallbackLabel.textContent = dish.name;
      figure.appendChild(fallbackLabel);
    });
    figure.appendChild(img);
    if (!dish.available) {
      const badge = document.createElement("span");
      badge.className = "badge badge-unavailable";
      badge.textContent = "Currently Unavailable";
      figure.appendChild(badge);
    } else if (dish.featured) {
      const badge = document.createElement("span");
      badge.className = "badge badge-featured";
      badge.textContent = "Featured";
      figure.appendChild(badge);
    }
    card.appendChild(figure);

    const body = document.createElement("div");
    body.className = "dish-card-body";

    const name = document.createElement("h3");
    name.textContent = dish.name;
    body.appendChild(name);

    const region = document.createElement("p");
    region.className = "dish-region";
    region.textContent = dish.region;
    body.appendChild(region);

    const description = document.createElement("p");
    description.className = "dish-description";
    description.textContent = dish.description;
    body.appendChild(description);

    const footer = document.createElement("div");
    footer.className = "dish-card-footer";

    const price = document.createElement("span");
    price.className = "dish-price";
    price.textContent = dish.price != null ? "₱" + dish.price : "Price coming soon";
    footer.appendChild(price);

    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "btn btn-outline btn-small";
    detailsButton.textContent = "View Details";
    detailsButton.addEventListener("click", function () {
      openModal(dish, detailsButton);
    });
    footer.appendChild(detailsButton);

    body.appendChild(footer);
    card.appendChild(body);

    return card;
  }

  function initModal() {
    const modal = document.getElementById("dishModal");
    if (!modal) return;
    const closeButton = document.getElementById("modalClose");
    const backdrop = modal.querySelector(".modal-backdrop");

    if (closeButton) closeButton.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }

  function openModal(dish, triggerElement) {
    const modal = document.getElementById("dishModal");
    if (!modal) return;

    state.lastFocusedElement = triggerElement || document.activeElement;

    setText("modalDishName", dish.name);
    setText("modalDishRegion", dish.region);
    setText("modalDishDescription", dish.description);
    setText("modalDishCategory", dish.category);
    setText("modalDishNote", dish.culturalNote || "");

    const img = document.getElementById("modalDishImage");
    if (img) {
      img.src = dish.image;
      img.alt = dish.name + " — Filipino pancit dish";
      img.onerror = function () {
        img.src = "";
        img.alt = dish.name + " photo unavailable";
      };
    }

    setText("modalDishPrice", dish.price != null ? "₱" + dish.price : "Price coming soon");

    const availabilityEl = document.getElementById("modalDishAvailability");
    if (availabilityEl) {
      availabilityEl.textContent = dish.available ? "Available" : "Currently Unavailable";
      availabilityEl.className = "badge " + (dish.available ? "badge-featured" : "badge-unavailable");
    }

    renderListOrFallback("modalDishIngredients", dish.ingredients, "Ingredient details coming soon.");
    renderListOrFallback("modalDishAllergens", dish.allergens, "Allergen information coming soon.");

    modal.hidden = false;
    document.body.classList.add("modal-open");

    const closeButton = document.getElementById("modalClose");
    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    const modal = document.getElementById("dishModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      state.lastFocusedElement.focus();
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderListOrFallback(id, items, fallbackText) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    if (!items || items.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = fallbackText;
      el.appendChild(li);
      return;
    }
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    });
  }
})();
