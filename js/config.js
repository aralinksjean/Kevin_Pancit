/**
 * Centralized branding & restaurant configuration for Kevin's Panciteria.
 * Edit the values below to rebrand the site — every page reads from this single object.
 * Phone, email, hours, and social links below are placeholder/demo values — replace with real details when available.
 * Leave a value empty ("") or null to hide a field gracefully instead of showing it.
 */
const SITE_CONFIG = {
  restaurantName: "Kevin's Panciteria",
  shortName: "Kevin's",
  tagline: "A Taste of the Philippines, One Pancit at a Time.",

  // Set logo.imagePath to e.g. "assets/branding/logo.png" to replace the text wordmark.
  logo: {
    imagePath: "",
    altText: "Kevin's Panciteria logo"
  },

  contact: {
    address: "P.F. Alviar, Vintar, Ilocos Norte, Philippines",
    phone: "+63 917 123 4567",
    email: "hello@kevinspanciteria.ph",
    // Google Maps (or similar) directions URL — shown only when provided.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=P.F.+Alviar%2C+Vintar%2C+Ilocos+Norte%2C+Philippines"
  },

  hours: [
    { day: "Monday – Friday", time: "10:00 AM – 9:00 PM" },
    { day: "Saturday – Sunday", time: "9:00 AM – 10:00 PM" }
  ],

  social: {
    facebook: "https://facebook.com/kevinspanciteria",
    instagram: "https://instagram.com/kevinspanciteria",
    tiktok: "https://tiktok.com/@kevinspanciteria"
  }
};
