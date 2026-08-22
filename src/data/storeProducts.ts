import batteryBankBox from "@/assets/products/battery-bank-box.png.asset.json";
import batteryBankDetails from "@/assets/products/battery-bank-details.png.asset.json";
import laptop1 from "@/assets/products/laptop-1.jpg";
import laptop2 from "@/assets/products/laptop-2.jpg";
import backpack1 from "@/assets/products/backpack-1.jpg";
import keyboardMouse1 from "@/assets/products/keyboard-mouse-1.jpg";
import usbcHub1 from "@/assets/products/usbc-hub-1.jpg";
import coolingPad1 from "@/assets/products/cooling-pad-1.jpg";
import phoneCase1 from "@/assets/products/phone-case-1.jpg";
import phoneCase2 from "@/assets/products/phone-case-2.jpg";
import charger1 from "@/assets/products/charger-1.jpg";
import earbuds1 from "@/assets/products/earbuds-1.jpg";
import headset1 from "@/assets/products/headset-1.jpg";
import roboticsKit1 from "@/assets/products/robotics-kit-1.jpg";

export const STORE_WHATSAPP_NUMBER = "2348068597140";

export type StoreCategory =
  | "Power & Charging"
  | "Laptops & Accessories"
  | "Phone Accessories"
  | "Audio & Classes"
  | "Learning Kits";

export const STORE_CATEGORIES: StoreCategory[] = [
  "Power & Charging",
  "Laptops & Accessories",
  "Phone Accessories",
  "Audio & Classes",
  "Learning Kits",
];

export interface StoreImage {
  src: string;
  alt: string;
}

export interface StoreProduct {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: StoreCategory;
  badges: string[];
  specs: string[];
  keywords: string[];
  images: StoreImage[];
  inStock: boolean;
}

export const storeProducts: StoreProduct[] = [
  {
    slug: "battery-bank-replaceable-power-bank",
    name: "Battery Bank — Replaceable Battery Power Bank",
    tagline: "Use any battery. Replace. Recharge. Reuse.",
    shortDescription:
      "The power bank you can repair yourself. Assembled in our Hardware & Robotics department in Nnewi and built for 18650 or AA batteries.",
    description:
      "Battery Bank is the power bank that never becomes waste. Instead of a sealed cell that dies after a year, you open it, swap in fresh 18650 lithium cells or ordinary AA (finger) batteries, and keep the same casing for years. It charges phones, earbuds, routers and small devices over USB-A and USB-C, shows exact battery level on a digital display, and comes with a one-year battery replacement guarantee at any of our Technology Incubation Centres. Assembled locally by the Hardware & Robotics Department at Tech Faculty NG, Nnewi. Buy it with batteries, without batteries, or grab extra cells to always stay powered.",
    price: 24500,
    compareAtPrice: 32000,
    category: "Power & Charging",
    badges: ["Made in Nigeria", "Assembled at Tech Faculty", "1-Year Battery Guarantee"],
    specs: [
      "Works with 18650 Li-ion (3.7V) or AA (1.2V) batteries",
      "USB-A + USB-C fast charging output",
      "Digital percentage display",
      "Available in black, white, blue, green, purple and pink",
      "In the box: casing, user guide, charging cable (batteries optional)",
    ],
    keywords: [
      "power bank Nigeria",
      "replaceable battery power bank",
      "buy power bank Nnewi",
      "18650 power bank Nigeria",
    ],
    images: [
      { src: batteryBankBox.url, alt: "Battery Bank replaceable battery power bank retail box, made in Nigeria" },
      {
        src: batteryBankDetails.url,
        alt: "Battery Bank features: works with 18650 and AA batteries, colour options, 1-year battery replacement guarantee",
      },
    ],
    inStock: true,
  },
  {
    slug: "student-business-laptop-core-i5",
    name: "Student Business Laptop — Core i5, 8GB RAM, 256GB SSD",
    tagline: "A clean, tested laptop that can actually run your bootcamp work.",
    shortDescription:
      "UK-used Core i5 business laptop, tested and set up for coding, data analysis and design classes. Affordable and ready to work.",
    description:
      "Most students fail their first tech course because of the laptop, not the lessons. This is a tested, refurbished business-class laptop — Intel Core i5, 8GB RAM and a fast 256GB SSD — the exact spec we recommend for web development, data analytics, design and cybersecurity training. Every unit is cleaned, battery-checked and delivered with Windows, VS Code, Python and Chrome already installed so you can start learning the same day. Nationwide delivery, pay on delivery available, or pick it up at any Technology Incubation Centre.",
    price: 285000,
    compareAtPrice: 340000,
    category: "Laptops & Accessories",
    badges: ["Tested & Set Up", "Student Favourite"],
    specs: [
      "Intel Core i5 processor, 8GB RAM, 256GB SSD",
      "14\" or 15.6\" display (subject to available stock)",
      "Windows installed with VS Code, Python and Chrome",
      "Battery health checked before dispatch",
      "3-month hardware support from Tech Faculty NG",
    ],
    keywords: [
      "affordable laptop for students Nigeria",
      "cheap coding laptop Nigeria",
      "UK used laptop Core i5 price Nigeria",
    ],
    images: [
      { src: laptop1, alt: "Refurbished Core i5 student business laptop open on a light background" },
      { src: laptop2, alt: "Side profile of the student business laptop showing USB and USB-C ports" },
    ],
    inStock: true,
  },
  {
    slug: "anti-theft-laptop-backpack",
    name: "Anti-Theft Laptop Backpack with USB Port",
    tagline: "Carry your laptop to class and client meetings without stress.",
    shortDescription:
      "Water-resistant 15.6\" laptop backpack with padded sleeve, hidden zips and a built-in USB charging port.",
    description:
      "A daily-carry backpack built for Nigerian roads, bikes and buses. Water-resistant fabric, a padded compartment that fits laptops up to 15.6 inches, concealed anti-theft zips, and a built-in USB pass-through so you can charge your phone from your power bank while it stays inside the bag. Comfortable breathable straps for long commutes to campus or the office.",
    price: 18500,
    category: "Laptops & Accessories",
    badges: ["Water Resistant", "Fits 15.6\" Laptops"],
    specs: [
      "Fits laptops up to 15.6 inches",
      "Water-resistant outer fabric",
      "Hidden anti-theft zip compartment",
      "Built-in USB charging pass-through port",
      "Padded breathable shoulder straps",
    ],
    keywords: ["laptop bag price in Nigeria", "anti theft laptop backpack Nigeria"],
    images: [{ src: backpack1, alt: "Black water-resistant anti-theft laptop backpack with USB charging port" }],
    inStock: true,
  },
  {
    slug: "wireless-keyboard-mouse-combo",
    name: "Wireless Keyboard & Mouse Combo",
    tagline: "Work faster and stop hunching over your laptop.",
    shortDescription:
      "Slim 2.4GHz wireless keyboard and silent mouse set — one USB receiver, long battery life, quiet keys.",
    description:
      "A comfortable desk setup for anyone who codes, writes or analyses data for hours. The slim keyboard has quiet scissor-switch keys and a full number pad for spreadsheets, while the mouse is silent-click with adjustable DPI. Both share a single nano USB receiver, so setup is plug and play on any laptop or desktop. Ideal when you pair the laptop with a stand or external monitor.",
    price: 14500,
    category: "Laptops & Accessories",
    badges: ["Plug & Play", "Silent Keys"],
    specs: [
      "2.4GHz wireless with single nano USB receiver",
      "Full-size keyboard with number pad",
      "Silent-click mouse, adjustable DPI",
      "Works with Windows, macOS and Linux",
      "Long battery life (AAA batteries included)",
    ],
    keywords: ["wireless keyboard and mouse price in Nigeria", "buy keyboard mouse combo Nigeria"],
    images: [{ src: keyboardMouse1, alt: "Slim black wireless keyboard and silent mouse combo" }],
    inStock: true,
  },
  {
    slug: "usb-c-multiport-hub",
    name: "USB-C Multiport Hub — HDMI, USB 3.0 & Card Reader",
    tagline: "Turn one port into everything your laptop is missing.",
    shortDescription:
      "Aluminium 6-in-1 USB-C hub with 4K HDMI, USB 3.0 ports, SD/microSD reader and USB-C power delivery.",
    description:
      "Modern slim laptops give you two ports and expect you to manage. This aluminium 6-in-1 hub adds 4K HDMI output for presentations and projectors, two USB 3.0 ports for drives and dongles, an SD and microSD card reader for photographers and videographers, and USB-C power delivery so you can still charge while connected. Compact enough to live in your laptop bag.",
    price: 16500,
    category: "Laptops & Accessories",
    badges: ["6-in-1", "4K HDMI"],
    specs: [
      "4K HDMI video output",
      "2 × USB 3.0 data ports",
      "SD + microSD card reader",
      "USB-C power delivery pass-through",
      "Aluminium body, plug and play — no drivers",
    ],
    keywords: ["usb c hub price in Nigeria", "laptop adapter hdmi Nigeria"],
    images: [{ src: usbcHub1, alt: "Aluminium USB-C multiport hub with HDMI, USB 3.0 and card reader" }],
    inStock: true,
  },
  {
    slug: "laptop-cooling-pad-stand",
    name: "Laptop Cooling Pad & Adjustable Stand",
    tagline: "Keep your laptop cool through long training sessions.",
    shortDescription:
      "Adjustable-height laptop stand with silent cooling fans — better posture, cooler machine, longer laptop life.",
    description:
      "Nigerian heat plus long coding sessions is how laptops die early. This stand lifts your laptop to eye level for better posture and runs quiet USB-powered fans underneath to pull heat away from the base. Adjustable angles, anti-slip stoppers, and a folding frame that fits in a backpack. A small purchase that visibly extends the life of an expensive laptop.",
    price: 12500,
    category: "Laptops & Accessories",
    badges: ["Silent Fans", "Adjustable Height"],
    specs: [
      "Fits 10\"–17\" laptops",
      "USB-powered silent cooling fans",
      "Multiple height and angle settings",
      "Anti-slip front stoppers",
      "Foldable, lightweight frame",
    ],
    keywords: ["laptop cooling pad Nigeria", "laptop stand price Nigeria"],
    images: [{ src: coolingPad1, alt: "Black laptop cooling pad stand with a laptop resting on it" }],
    inStock: true,
  },
  {
    slug: "custom-phone-case-made-in-nigeria",
    name: "Custom Phone Case — Printed in Nigeria",
    tagline: "Your name, your brand, your design — printed on demand.",
    shortDescription:
      "Personalised shockproof phone case printed locally. Send your name, photo, logo or Ankara-inspired pattern.",
    description:
      "Custom phone cases printed right here in Nigeria, usually within 48 hours. Send us your name, your photo, your business logo or pick from our Ankara and geometric pattern library, and we print it on a shockproof matte case with raised camera protection. Great for personal use, and popular with small businesses and churches ordering in bulk for branding. Available for most iPhone, Samsung, Tecno, Infinix and Redmi models — just tell us your exact phone model on WhatsApp.",
    price: 8500,
    category: "Phone Accessories",
    badges: ["Made in Nigeria", "Personalised", "Bulk Orders Welcome"],
    specs: [
      "Printed on shockproof matte hard case",
      "Raised camera and screen edge protection",
      "Send any name, photo, logo or pattern",
      "Fits iPhone, Samsung, Tecno, Infinix, Redmi and more",
      "Bulk pricing for 10+ units",
    ],
    keywords: [
      "custom phone case Nigeria",
      "personalised phone case Nigeria",
      "print phone case with name Nigeria",
    ],
    images: [
      { src: phoneCase1, alt: "Row of custom printed phone cases with Ankara patterns and personalised names" },
      { src: phoneCase2, alt: "Single custom printed phone case with a bold geometric design on a phone" },
    ],
    inStock: true,
  },
  {
    slug: "fast-charger-usb-c-cable-bundle",
    name: "Fast Charger + Braided USB-C Cable Bundle",
    tagline: "Full charge in under an hour, with a cable that survives.",
    shortDescription:
      "20W fast-charging adapter with a braided USB-C cable that does not tear after two weeks.",
    description:
      "A safe, properly rated 20W fast charging adapter paired with a nylon-braided USB-C cable built to survive real daily use — bent, coiled, thrown in a bag. Fast-charges modern iPhone and Android phones, tablets and USB-C earbuds, with built-in over-voltage and over-heat protection so your battery is not damaged by cheap electronics. Also available with a Lightning or micro-USB cable — just say which on WhatsApp.",
    price: 9500,
    category: "Power & Charging",
    badges: ["20W Fast Charge", "Braided Cable"],
    specs: [
      "20W USB-C power delivery adapter",
      "1.5m nylon-braided USB-C cable included",
      "Over-voltage, over-current and heat protection",
      "Compatible with iPhone, Samsung, Tecno, Infinix and tablets",
      "Lightning or micro-USB cable option available",
    ],
    keywords: ["fast charger price in Nigeria", "original usb c cable Nigeria"],
    images: [{ src: charger1, alt: "White 20W fast charging adapter with a coiled braided USB-C cable" }],
    inStock: true,
  },
  {
    slug: "wireless-earbuds-online-classes",
    name: "Wireless Earbuds with Charging Case",
    tagline: "Clear calls and classes, all day battery.",
    shortDescription:
      "Bluetooth 5.3 earbuds with noise-reducing mic and a charging case — made for online classes and client calls.",
    description:
      "Bluetooth 5.3 earbuds tuned for talking, not just music: a noise-reducing microphone keeps your voice clear on Zoom, Google Meet and WhatsApp calls even with generators and traffic around you. Touch controls, stable connection for online classes, around 4–5 hours per charge and up to 20 hours with the pocket charging case. Comfortable enough to wear through a full training session.",
    price: 15500,
    category: "Audio & Classes",
    badges: ["Bluetooth 5.3", "Clear Call Mic"],
    specs: [
      "Bluetooth 5.3, stable connection for calls and classes",
      "Noise-reducing microphone",
      "4–5 hours playback, ~20 hours with case",
      "Touch controls, USB-C charging case",
      "Works with any phone, laptop or tablet",
    ],
    keywords: ["wireless earbuds price in Nigeria", "earbuds for online classes Nigeria"],
    images: [{ src: earbuds1, alt: "Black wireless earbuds floating above an open charging case" }],
    inStock: true,
  },
  {
    slug: "usb-headset-with-microphone",
    name: "USB Headset with Microphone — For Online Classes & Support Work",
    tagline: "The standard headset remote employers ask for.",
    shortDescription:
      "Padded over-ear USB headset with boom mic and inline mute — the spec required for most remote support and virtual assistant jobs.",
    description:
      "If you are applying for remote customer support, virtual assistant, sales or transcription roles, employers almost always require a wired USB headset with a boom microphone — and this is that headset. Padded over-ear cushions for long shifts, a noise-cancelling boom mic positioned close to your mouth, inline volume and mute controls, and plug-and-play USB so it works instantly with Windows, macOS and Chromebooks. Also the headset we recommend for our own online cohorts.",
    price: 13500,
    category: "Audio & Classes",
    badges: ["Remote-Work Ready", "Noise-Cancelling Mic"],
    specs: [
      "Wired USB plug-and-play connection",
      "Noise-cancelling boom microphone",
      "Padded over-ear cushions and adjustable headband",
      "Inline volume and mute controls",
      "Works with Zoom, Google Meet, Teams and dialer software",
    ],
    keywords: ["usb headset with microphone Nigeria", "headset for remote work Nigeria"],
    images: [{ src: headset1, alt: "Black over-ear USB headset with boom microphone for online classes" }],
    inStock: true,
  },
  {
    slug: "robotics-electronics-starter-kit",
    name: "Robotics & Electronics Starter Kit (Arduino Compatible)",
    tagline: "Build your first real hardware project this week.",
    shortDescription:
      "Arduino-compatible board, breadboard, sensors, LEDs and jumper wires with beginner project guides from our Hardware & Robotics department.",
    description:
      "The starter kit we hand to learners in our Hardware & Robotics Department — and the perfect gift for a curious teenager. It includes an Arduino-compatible microcontroller board, breadboard, jumper wires, LEDs, resistors, buttons and common sensors (temperature, light, motion), plus guided beginner projects: a blinking traffic light, a temperature monitor, a motion alarm and a simple smart-home switch. Kids and teens on our holiday bootcamps use this same kit, and support is available at any of our centres.",
    price: 32500,
    category: "Learning Kits",
    badges: ["Great for Teens", "Project Guides Included"],
    specs: [
      "Arduino-compatible microcontroller board + USB cable",
      "Breadboard, jumper wires, resistors, LEDs, buttons",
      "Sensor set: temperature, light and motion",
      "Guided beginner projects included",
      "Hands-on support at any Technology Incubation Centre",
    ],
    keywords: [
      "arduino starter kit Nigeria",
      "robotics kit for kids Nigeria",
      "electronics kit price Nigeria",
    ],
    images: [
      {
        src: roboticsKit1,
        alt: "Arduino-compatible robotics and electronics starter kit with breadboard, sensors and jumper wires",
      },
    ],
    inStock: true,
  },
];

export const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export const productWhatsAppUrl = (product: StoreProduct) => {
  const message = `Hello Tech Faculty, I want to order: ${product.name} — ${formatNaira(
    product.price,
  )}. Please confirm availability, delivery to my location and payment options (including pay on delivery).`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const storeWhatsAppUrl = (message: string) =>
  `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
