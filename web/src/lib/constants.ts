export const BASE_URL =
  process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

export const AUTH_SESSION = "__com.listings.taskSync-session";
export const fallBackListingImage = "/svg/fallback-img.svg";
export const fallbackProfilePicture = "https://github.com/shadcn.png";

export const PROVINCES = [
  { id: "Lusaka_Province", name: "Lusaka Province" },
  { id: "Central_Province", name: "Central Province" },
  { id: "Copperbelt_Province", name: "Copperbelt Province" },
  { id: "Eastern_Province", name: "Eastern Province" },
  { id: "Luapula_Province", name: "Luapula Province" },
  { id: "Muchinga_Province", name: "Muchinga Province" },
  { id: "Northern_Province", name: "Northern Province" },
  { id: "North-Western", name: "North-Western Province" },
  { id: "Southern_Province", name: "Southern Province" },
  { id: "Western_Province", name: "Western Province" },
];

// ANIMATION_VARIANTS
export const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      // staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
};

export const staggerContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      // staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
};

export const staggerContainerItemVariants = {
  hidden: { opacity: 0, y: -60 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
};

export const slideDownInView = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const whileTabInView = {
  opacity: [0, 1],
  scaleX: [0.8, 1],
  transition: {
    type: "spring",
    stiffness: 300,
    ease: "easeInOut",
    duration: 0.2,
  },
};

// REGEX
export const MTN_NO = /^0(96|76)[0-9]{7}$/;
export const AIRTEL_NO = /^0(97|77)[0-9]{7}$/;
export const ZAMTEL_NO = /^0(95|75)[0-9]{7}$/;

export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const MIN_KREDIT_PRICE = 1;

export const QUERY_KEYS = {
  LISTINGS: "listings",
  USER: "user-profile",
  PACKAGES: "package-plans",
  PROPERTY_LIST: "property-list",
  PROPERTY: "property",
  PROPERTY_ROOMS: "property-rooms",
  ROOMS: "rooms",
  COUNTRIES: "countries",
  ROLES: "roles",
  UNIVERSITIES: "universities",
  ROOM_TYPES: "room_types",
  PROPERTY_REVIEWS: "reviews",
  SYSTEM_ACTIONS: "system-actions",
};
