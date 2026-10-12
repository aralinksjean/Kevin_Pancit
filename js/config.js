/**
 * Centralized branding & restaurant configuration for Kevin's Panciteria.
 * Edit the values below to rebrand the site — every page reads from this single object.
 * Leave a value empty ("") or null when the real information has not been provided yet;
 * the site will hide placeholders gracefully instead of showing fake details.
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
    phone: "",
    email: "",
    // Google Maps (or similar) directions URL — shown only when provided.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=P.F.+Alviar%2C+Vintar%2C+Ilocos+Norte%2C+Philippines"
  },

  hours: [
    { day: "Monday – Friday", time: "" },
    { day: "Saturday – Sunday", time: "" }
  ],

  social: {
    facebook: "",
    instagram: "",
    tiktok: ""
  }
};
