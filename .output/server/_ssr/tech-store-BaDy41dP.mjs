import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $t as Banknote, Bt as ChevronLeft, Ht as Check, O as ShieldCheck, Y as MapPin, h as Truck, j as Search, q as MessageCircle, zt as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { i as CardFooter, n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-Co1-8MUG.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/tech-store-BaDy41dP.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var ProductGallery = ({ images, className }) => {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [touchStart, setTouchStart] = (0, import_react.useState)(null);
	const go = (next) => {
		if (images.length < 2) return;
		setIndex((next % images.length + images.length) % images.length);
	};
	const onTouchEnd = (endX) => {
		if (touchStart === null) return;
		const delta = touchStart - endX;
		if (Math.abs(delta) > 40) go(delta > 0 ? index + 1 : index - 1);
		setTouchStart(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-lg bg-secondary/30", className),
		onTouchStart: (e) => setTouchStart(e.touches[0].clientX),
		onTouchEnd: (e) => onTouchEnd(e.changedTouches[0].clientX),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full transition-transform duration-300 ease-out",
			style: { transform: `translateX(-${index * 100}%)` },
			children: images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image.src,
				alt: image.alt,
				loading: "lazy",
				width: 1024,
				height: 1024,
				className: "h-full w-full shrink-0 object-contain"
			}, image.src))
		}), images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Previous product image",
				onClick: () => go(index - 1),
				className: "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-xs transition hover:bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Next product image",
				onClick: () => go(index + 1),
				className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-xs transition hover:bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5",
				children: images.map((image, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Show image ${i + 1}`,
					onClick: () => go(i),
					className: cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/50")
				}, image.src))
			})
		] })]
	});
};
var battery_bank_box_default = "/assets/battery-bank-box-DHWbvBQo.jpg";
var battery_bank_details_default = "/assets/battery-bank-details-FOUPSt8H.jpg";
var laptop_1_default = "/assets/laptop-1-rtuUaY2I.jpg";
var laptop_2_default = "/assets/laptop-2-RkuDsI4s.jpg";
var backpack_1_default = "/assets/backpack-1-BFCkcQRq.jpg";
var keyboard_mouse_1_default = "/assets/keyboard-mouse-1-D7YoOiy0.jpg";
var usbc_hub_1_default = "/assets/usbc-hub-1-Ce5AkrRT.jpg";
var cooling_pad_1_default = "/assets/cooling-pad-1-APpi1N3p.jpg";
var phone_case_1_default = "/assets/phone-case-1-DidChYo4.jpg";
var phone_case_2_default = "/assets/phone-case-2-BBbt5570.jpg";
var charger_1_default = "/assets/charger-1-6Yositu6.jpg";
var earbuds_1_default = "/assets/earbuds-1-Brggg5TM.jpg";
var headset_1_default = "/assets/headset-1-Bs5MpZoW.jpg";
var robotics_kit_1_default = "/assets/robotics-kit-1-DGeTGozp.jpg";
var STORE_WHATSAPP_NUMBER = "2348068597140";
var STORE_CATEGORIES = [
	"Power & Charging",
	"Laptops & Accessories",
	"Phone Accessories",
	"Audio & Classes",
	"Learning Kits"
];
var storeProducts = [
	{
		slug: "battery-bank-replaceable-power-bank",
		name: "Battery Bank — Replaceable Battery Power Bank",
		tagline: "Use any battery. Replace. Recharge. Reuse.",
		shortDescription: "The power bank you can repair yourself. Assembled in our Hardware & Robotics department in Nnewi and built for 18650 or AA batteries.",
		description: "Battery Bank is the power bank that never becomes waste. Instead of a sealed cell that dies after a year, you open it, swap in fresh 18650 lithium cells or ordinary AA (finger) batteries, and keep the same casing for years. It charges phones, earbuds, routers and small devices over USB-A and USB-C, shows exact battery level on a digital display, and comes with a one-year battery replacement guarantee at any of our Technology Incubation Centres. Assembled locally by the Hardware & Robotics Department at Tech Faculty NG, Nnewi. Buy it with batteries, without batteries, or grab extra cells to always stay powered.",
		price: 24500,
		compareAtPrice: 32e3,
		category: "Power & Charging",
		badges: [
			"Made in Nigeria",
			"Assembled at Tech Faculty",
			"1-Year Battery Guarantee"
		],
		specs: [
			"Works with 18650 Li-ion (3.7V) or AA (1.2V) batteries",
			"USB-A + USB-C fast charging output",
			"Digital percentage display",
			"Available in black, white, blue, green, purple and pink",
			"In the box: casing, user guide, charging cable (batteries optional)"
		],
		keywords: [
			"power bank Nigeria",
			"replaceable battery power bank",
			"buy power bank Nnewi",
			"18650 power bank Nigeria"
		],
		images: [{
			src: battery_bank_box_default,
			alt: "Battery Bank replaceable battery power bank retail box, made in Nigeria"
		}, {
			src: battery_bank_details_default,
			alt: "Battery Bank features: works with 18650 and AA batteries, colour options, 1-year battery replacement guarantee"
		}],
		inStock: true
	},
	{
		slug: "student-business-laptop-core-i5",
		name: "Student Business Laptop — Core i5, 8GB RAM, 256GB SSD",
		tagline: "A clean, tested laptop that can actually run your bootcamp work.",
		shortDescription: "UK-used Core i5 business laptop, tested and set up for coding, data analysis and design classes. Affordable and ready to work.",
		description: "Most students fail their first tech course because of the laptop, not the lessons. This is a tested, refurbished business-class laptop — Intel Core i5, 8GB RAM and a fast 256GB SSD — the exact spec we recommend for web development, data analytics, design and cybersecurity training. Every unit is cleaned, battery-checked and delivered with Windows, VS Code, Python and Chrome already installed so you can start learning the same day. Nationwide delivery, pay on delivery available, or pick it up at any Technology Incubation Centre.",
		price: 285e3,
		compareAtPrice: 34e4,
		category: "Laptops & Accessories",
		badges: ["Tested & Set Up", "Student Favourite"],
		specs: [
			"Intel Core i5 processor, 8GB RAM, 256GB SSD",
			"14\" or 15.6\" display (subject to available stock)",
			"Windows installed with VS Code, Python and Chrome",
			"Battery health checked before dispatch",
			"3-month hardware support from Tech Faculty NG"
		],
		keywords: [
			"affordable laptop for students Nigeria",
			"cheap coding laptop Nigeria",
			"UK used laptop Core i5 price Nigeria"
		],
		images: [{
			src: laptop_1_default,
			alt: "Refurbished Core i5 student business laptop open on a light background"
		}, {
			src: laptop_2_default,
			alt: "Side profile of the student business laptop showing USB and USB-C ports"
		}],
		inStock: true
	},
	{
		slug: "anti-theft-laptop-backpack",
		name: "Anti-Theft Laptop Backpack with USB Port",
		tagline: "Carry your laptop to class and client meetings without stress.",
		shortDescription: "Water-resistant 15.6\" laptop backpack with padded sleeve, hidden zips and a built-in USB charging port.",
		description: "A daily-carry backpack built for Nigerian roads, bikes and buses. Water-resistant fabric, a padded compartment that fits laptops up to 15.6 inches, concealed anti-theft zips, and a built-in USB pass-through so you can charge your phone from your power bank while it stays inside the bag. Comfortable breathable straps for long commutes to campus or the office.",
		price: 18500,
		category: "Laptops & Accessories",
		badges: ["Water Resistant", "Fits 15.6\" Laptops"],
		specs: [
			"Fits laptops up to 15.6 inches",
			"Water-resistant outer fabric",
			"Hidden anti-theft zip compartment",
			"Built-in USB charging pass-through port",
			"Padded breathable shoulder straps"
		],
		keywords: ["laptop bag price in Nigeria", "anti theft laptop backpack Nigeria"],
		images: [{
			src: backpack_1_default,
			alt: "Black water-resistant anti-theft laptop backpack with USB charging port"
		}],
		inStock: true
	},
	{
		slug: "wireless-keyboard-mouse-combo",
		name: "Wireless Keyboard & Mouse Combo",
		tagline: "Work faster and stop hunching over your laptop.",
		shortDescription: "Slim 2.4GHz wireless keyboard and silent mouse set — one USB receiver, long battery life, quiet keys.",
		description: "A comfortable desk setup for anyone who codes, writes or analyses data for hours. The slim keyboard has quiet scissor-switch keys and a full number pad for spreadsheets, while the mouse is silent-click with adjustable DPI. Both share a single nano USB receiver, so setup is plug and play on any laptop or desktop. Ideal when you pair the laptop with a stand or external monitor.",
		price: 14500,
		category: "Laptops & Accessories",
		badges: ["Plug & Play", "Silent Keys"],
		specs: [
			"2.4GHz wireless with single nano USB receiver",
			"Full-size keyboard with number pad",
			"Silent-click mouse, adjustable DPI",
			"Works with Windows, macOS and Linux",
			"Long battery life (AAA batteries included)"
		],
		keywords: ["wireless keyboard and mouse price in Nigeria", "buy keyboard mouse combo Nigeria"],
		images: [{
			src: keyboard_mouse_1_default,
			alt: "Slim black wireless keyboard and silent mouse combo"
		}],
		inStock: true
	},
	{
		slug: "usb-c-multiport-hub",
		name: "USB-C Multiport Hub — HDMI, USB 3.0 & Card Reader",
		tagline: "Turn one port into everything your laptop is missing.",
		shortDescription: "Aluminium 6-in-1 USB-C hub with 4K HDMI, USB 3.0 ports, SD/microSD reader and USB-C power delivery.",
		description: "Modern slim laptops give you two ports and expect you to manage. This aluminium 6-in-1 hub adds 4K HDMI output for presentations and projectors, two USB 3.0 ports for drives and dongles, an SD and microSD card reader for photographers and videographers, and USB-C power delivery so you can still charge while connected. Compact enough to live in your laptop bag.",
		price: 16500,
		category: "Laptops & Accessories",
		badges: ["6-in-1", "4K HDMI"],
		specs: [
			"4K HDMI video output",
			"2 × USB 3.0 data ports",
			"SD + microSD card reader",
			"USB-C power delivery pass-through",
			"Aluminium body, plug and play — no drivers"
		],
		keywords: ["usb c hub price in Nigeria", "laptop adapter hdmi Nigeria"],
		images: [{
			src: usbc_hub_1_default,
			alt: "Aluminium USB-C multiport hub with HDMI, USB 3.0 and card reader"
		}],
		inStock: true
	},
	{
		slug: "laptop-cooling-pad-stand",
		name: "Laptop Cooling Pad & Adjustable Stand",
		tagline: "Keep your laptop cool through long training sessions.",
		shortDescription: "Adjustable-height laptop stand with silent cooling fans — better posture, cooler machine, longer laptop life.",
		description: "Nigerian heat plus long coding sessions is how laptops die early. This stand lifts your laptop to eye level for better posture and runs quiet USB-powered fans underneath to pull heat away from the base. Adjustable angles, anti-slip stoppers, and a folding frame that fits in a backpack. A small purchase that visibly extends the life of an expensive laptop.",
		price: 12500,
		category: "Laptops & Accessories",
		badges: ["Silent Fans", "Adjustable Height"],
		specs: [
			"Fits 10\"–17\" laptops",
			"USB-powered silent cooling fans",
			"Multiple height and angle settings",
			"Anti-slip front stoppers",
			"Foldable, lightweight frame"
		],
		keywords: ["laptop cooling pad Nigeria", "laptop stand price Nigeria"],
		images: [{
			src: cooling_pad_1_default,
			alt: "Black laptop cooling pad stand with a laptop resting on it"
		}],
		inStock: true
	},
	{
		slug: "custom-phone-case-made-in-nigeria",
		name: "Custom Phone Case — Printed in Nigeria",
		tagline: "Your name, your brand, your design — printed on demand.",
		shortDescription: "Personalised shockproof phone case printed locally. Send your name, photo, logo or Ankara-inspired pattern.",
		description: "Custom phone cases printed right here in Nigeria, usually within 48 hours. Send us your name, your photo, your business logo or pick from our Ankara and geometric pattern library, and we print it on a shockproof matte case with raised camera protection. Great for personal use, and popular with small businesses and churches ordering in bulk for branding. Available for most iPhone, Samsung, Tecno, Infinix and Redmi models — just tell us your exact phone model on WhatsApp.",
		price: 8500,
		category: "Phone Accessories",
		badges: [
			"Made in Nigeria",
			"Personalised",
			"Bulk Orders Welcome"
		],
		specs: [
			"Printed on shockproof matte hard case",
			"Raised camera and screen edge protection",
			"Send any name, photo, logo or pattern",
			"Fits iPhone, Samsung, Tecno, Infinix, Redmi and more",
			"Bulk pricing for 10+ units"
		],
		keywords: [
			"custom phone case Nigeria",
			"personalised phone case Nigeria",
			"print phone case with name Nigeria"
		],
		images: [{
			src: phone_case_1_default,
			alt: "Row of custom printed phone cases with Ankara patterns and personalised names"
		}, {
			src: phone_case_2_default,
			alt: "Single custom printed phone case with a bold geometric design on a phone"
		}],
		inStock: true
	},
	{
		slug: "fast-charger-usb-c-cable-bundle",
		name: "Fast Charger + Braided USB-C Cable Bundle",
		tagline: "Full charge in under an hour, with a cable that survives.",
		shortDescription: "20W fast-charging adapter with a braided USB-C cable that does not tear after two weeks.",
		description: "A safe, properly rated 20W fast charging adapter paired with a nylon-braided USB-C cable built to survive real daily use — bent, coiled, thrown in a bag. Fast-charges modern iPhone and Android phones, tablets and USB-C earbuds, with built-in over-voltage and over-heat protection so your battery is not damaged by cheap electronics. Also available with a Lightning or micro-USB cable — just say which on WhatsApp.",
		price: 9500,
		category: "Power & Charging",
		badges: ["20W Fast Charge", "Braided Cable"],
		specs: [
			"20W USB-C power delivery adapter",
			"1.5m nylon-braided USB-C cable included",
			"Over-voltage, over-current and heat protection",
			"Compatible with iPhone, Samsung, Tecno, Infinix and tablets",
			"Lightning or micro-USB cable option available"
		],
		keywords: ["fast charger price in Nigeria", "original usb c cable Nigeria"],
		images: [{
			src: charger_1_default,
			alt: "White 20W fast charging adapter with a coiled braided USB-C cable"
		}],
		inStock: true
	},
	{
		slug: "wireless-earbuds-online-classes",
		name: "Wireless Earbuds with Charging Case",
		tagline: "Clear calls and classes, all day battery.",
		shortDescription: "Bluetooth 5.3 earbuds with noise-reducing mic and a charging case — made for online classes and client calls.",
		description: "Bluetooth 5.3 earbuds tuned for talking, not just music: a noise-reducing microphone keeps your voice clear on Zoom, Google Meet and WhatsApp calls even with generators and traffic around you. Touch controls, stable connection for online classes, around 4–5 hours per charge and up to 20 hours with the pocket charging case. Comfortable enough to wear through a full training session.",
		price: 15500,
		category: "Audio & Classes",
		badges: ["Bluetooth 5.3", "Clear Call Mic"],
		specs: [
			"Bluetooth 5.3, stable connection for calls and classes",
			"Noise-reducing microphone",
			"4–5 hours playback, ~20 hours with case",
			"Touch controls, USB-C charging case",
			"Works with any phone, laptop or tablet"
		],
		keywords: ["wireless earbuds price in Nigeria", "earbuds for online classes Nigeria"],
		images: [{
			src: earbuds_1_default,
			alt: "Black wireless earbuds floating above an open charging case"
		}],
		inStock: true
	},
	{
		slug: "usb-headset-with-microphone",
		name: "USB Headset with Microphone — For Online Classes & Support Work",
		tagline: "The standard headset remote employers ask for.",
		shortDescription: "Padded over-ear USB headset with boom mic and inline mute — the spec required for most remote support and virtual assistant jobs.",
		description: "If you are applying for remote customer support, virtual assistant, sales or transcription roles, employers almost always require a wired USB headset with a boom microphone — and this is that headset. Padded over-ear cushions for long shifts, a noise-cancelling boom mic positioned close to your mouth, inline volume and mute controls, and plug-and-play USB so it works instantly with Windows, macOS and Chromebooks. Also the headset we recommend for our own online cohorts.",
		price: 13500,
		category: "Audio & Classes",
		badges: ["Remote-Work Ready", "Noise-Cancelling Mic"],
		specs: [
			"Wired USB plug-and-play connection",
			"Noise-cancelling boom microphone",
			"Padded over-ear cushions and adjustable headband",
			"Inline volume and mute controls",
			"Works with Zoom, Google Meet, Teams and dialer software"
		],
		keywords: ["usb headset with microphone Nigeria", "headset for remote work Nigeria"],
		images: [{
			src: headset_1_default,
			alt: "Black over-ear USB headset with boom microphone for online classes"
		}],
		inStock: true
	},
	{
		slug: "robotics-electronics-starter-kit",
		name: "Robotics & Electronics Starter Kit (Arduino Compatible)",
		tagline: "Build your first real hardware project this week.",
		shortDescription: "Arduino-compatible board, breadboard, sensors, LEDs and jumper wires with beginner project guides from our Hardware & Robotics department.",
		description: "The starter kit we hand to learners in our Hardware & Robotics Department — and the perfect gift for a curious teenager. It includes an Arduino-compatible microcontroller board, breadboard, jumper wires, LEDs, resistors, buttons and common sensors (temperature, light, motion), plus guided beginner projects: a blinking traffic light, a temperature monitor, a motion alarm and a simple smart-home switch. Kids and teens on our holiday bootcamps use this same kit, and support is available at any of our centres.",
		price: 32500,
		category: "Learning Kits",
		badges: ["Great for Teens", "Project Guides Included"],
		specs: [
			"Arduino-compatible microcontroller board + USB cable",
			"Breadboard, jumper wires, resistors, LEDs, buttons",
			"Sensor set: temperature, light and motion",
			"Guided beginner projects included",
			"Hands-on support at any Technology Incubation Centre"
		],
		keywords: [
			"arduino starter kit Nigeria",
			"robotics kit for kids Nigeria",
			"electronics kit price Nigeria"
		],
		images: [{
			src: robotics_kit_1_default,
			alt: "Arduino-compatible robotics and electronics starter kit with breadboard, sensors and jumper wires"
		}],
		inStock: true
	}
];
var formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;
var productWhatsAppUrl = (product) => {
	const message = `Hello Tech Faculty, I want to order: ${product.name} — ${formatNaira(product.price)}. Please confirm availability, delivery to my location and payment options (including pay on delivery).`;
	return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
var storeWhatsAppUrl = (message) => `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
var ProductCard = ({ product, onOpenDetails }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
	className: "flex flex-col overflow-hidden border-border/70 transition-shadow hover:shadow-lg",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGallery, {
			images: product.images,
			className: "aspect-square rounded-none"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-1 flex-col gap-3 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: product.badges.slice(0, 2).map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "text-[11px] font-medium",
						children: badge
					}, badge))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold leading-snug",
					children: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: product.shortDescription
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-bold",
						children: formatNaira(product.price)
					}), product.compareAtPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground line-through",
						children: formatNaira(product.compareAtPrice)
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: productWhatsAppUrl(product),
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": `Order ${product.name} on WhatsApp`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							className: "mr-2",
							size: 18
						}), " Order on WhatsApp"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "w-full",
					onClick: () => onOpenDetails(product),
					children: "View details & specs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[11px] text-muted-foreground",
					children: "Pay on delivery available · Nationwide delivery"
				})
			]
		})
	]
});
var ProductDialog = ({ product, onOpenChange }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
	open: !!product,
	onOpenChange,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
		className: "max-h-[90vh] max-w-2xl overflow-y-auto",
		children: product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-left text-xl",
				children: product.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "text-left",
				children: product.tagline
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGallery, {
				images: product.images,
				className: "aspect-square w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: product.badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: badge
				}, badge))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl font-bold",
					children: formatNaira(product.price)
				}), product.compareAtPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground line-through",
					children: formatNaira(product.compareAtPrice)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: product.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "mb-2 text-sm font-semibold",
				children: "What you get"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: product.specs.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						size: 16,
						className: "mt-0.5 shrink-0 text-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: spec })]
				}, spec))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-lg border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
							size: 16,
							className: "text-primary"
						}), " Nationwide delivery"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, {
							size: 16,
							className: "text-primary"
						}), " Pay on delivery"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							size: 16,
							className: "text-primary"
						}), " Centre pickup"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: productWhatsAppUrl(product),
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-label": `Order ${product.name} on WhatsApp`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
						className: "mr-2",
						size: 18
					}), " Order on WhatsApp"]
				})
			})
		] })
	})
});
var CANONICAL = "https://techfaculty.ng/tech-store";
var priceOf = (slug) => formatNaira(storeProducts.find((p) => p.slug === slug)?.price ?? 0);
var faqs = [
	{
		q: "How do I buy from the Tech Faculty tech store?",
		a: "Tap “Order on WhatsApp” on any product. That opens a chat with the product and its naira price already written in the message. We confirm availability, take your delivery address, agree payment and dispatch the order. You do not need an account or an online checkout to buy from us."
	},
	{
		q: "Do you deliver nationwide in Nigeria?",
		a: "Yes. We deliver to every state in Nigeria through trusted courier partners. Delivery usually takes 1–2 working days within the South East and Lagos, and 2–4 working days to other states. The fee depends on your location and the item's size, and we tell you the exact amount before you pay."
	},
	{
		q: "Is pay on delivery available?",
		a: "Yes, pay on delivery is available for most locations and most items. For high-value items such as laptops, we may ask for a part payment to cover logistics, and you pay the balance when the item reaches you. We confirm on WhatsApp which option applies to your order before dispatch."
	},
	{
		q: "Can I pick up my order instead of paying for delivery?",
		a: "Yes, and pickup is free. Collect your order at our Nnewi headquarters or at any Technology Incubation Centre where we operate, including Onitsha, Awka, Enugu, Owerri, Aba, Abakaliki, Abuja, Lagos and other major cities. Tell us your preferred centre in the WhatsApp chat and we confirm when it is ready."
	},
	{
		q: "What is the Battery Bank power bank and why is it different?",
		a: `Battery Bank is a ${priceOf("battery-bank-replaceable-power-bank")} power bank assembled by our Hardware & Robotics Department in Nnewi. Instead of a sealed battery that dies and becomes waste, you open it and replace the 18650 or AA batteries yourself, so one casing lasts for years. It comes with a one-year battery replacement guarantee.`
	},
	{
		q: "Are the laptops new or used?",
		a: `Our student laptops are tested, refurbished business-class machines, commonly called UK-used, from ${priceOf("student-business-laptop-core-i5")} for a Core i5 with 8GB RAM and a 256GB SSD. Each one is cleaned, battery-checked and set up with Windows, VS Code, Python and Chrome, and comes with three months of hardware support.`
	},
	{
		q: "Do Tech Faculty students get a discount?",
		a: "Yes. Send your Faculty ID in the WhatsApp chat and we apply the current student price on accessories and learning kits before you pay. You receive a Faculty ID when you create your Tech Faculty account, so new students can claim the discount from their first order onwards."
	},
	{
		q: "Can I order in bulk for a school, church or company?",
		a: "Yes. We handle bulk orders of custom phone cases, robotics kits, headsets and laptops for schools, churches, companies and NGOs, with bulk pricing and proper invoices. Message us on WhatsApp with the product and quantity you need, and we send a written quote in naira before you commit to anything."
	},
	{
		q: "Do the products have a warranty?",
		a: "Yes. Accessories carry a 7-day replacement window for defects, laptops carry three months of hardware support, and Battery Bank carries a one-year battery replacement guarantee at our centres. Keep your receipt or your WhatsApp order chat as proof of purchase when you bring an item back."
	}
];
var TechStore = () => {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All");
	const [active, setActive] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return storeProducts.filter((product) => {
			const matchesCategory = category === "All" || product.category === category;
			const matchesQuery = !q || product.name.toLowerCase().includes(q) || product.shortDescription.toLowerCase().includes(q) || product.keywords.some((keyword) => keyword.toLowerCase().includes(q));
			return matchesCategory && matchesQuery;
		});
	}, [query, category]);
	const cheapest = Math.min(...storeProducts.map((p) => p.price));
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Tech Faculty NG Tech Store — Affordable Tech Products in Nigeria",
		numberOfItems: storeProducts.length,
		itemListElement: storeProducts.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Product",
				name: product.name,
				description: product.shortDescription,
				category: product.category,
				brand: {
					"@type": "Brand",
					name: "Tech Faculty NG"
				},
				image: product.images.map((image) => image.src.startsWith("http") ? image.src : `https://techfaculty.ng${image.src}`),
				offers: {
					"@type": "Offer",
					price: product.price,
					priceCurrency: "NGN",
					availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
					url: CANONICAL,
					areaServed: {
						"@type": "Country",
						name: "Nigeria"
					},
					seller: {
						"@type": "Organization",
						name: "Tech Faculty NG",
						url: "https://techfaculty.ng"
					}
				}
			}
		}))
	};
	const storeSchema = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: "Tech Faculty NG Tech Store",
		description: "Affordable tech products in Nigeria — locally assembled power banks, student laptops, laptop accessories, custom phone cases and robotics kits. Order on WhatsApp with nationwide delivery and pay on delivery.",
		url: CANONICAL,
		telephone: "+2348068597140",
		currenciesAccepted: "NGN",
		paymentAccepted: "Cash on delivery, Bank transfer",
		priceRange: `${formatNaira(cheapest)}+`,
		address: {
			"@type": "PostalAddress",
			streetAddress: "Technology Incubation Centre, NBTI South-East Zonal Office",
			addressLocality: "Nnewi",
			addressRegion: "Anambra",
			postalCode: "435101",
			addressCountry: "NG"
		},
		areaServed: {
			"@type": "Country",
			name: "Nigeria"
		},
		parentOrganization: {
			"@type": "Organization",
			name: "Tech Faculty NG",
			url: "https://techfaculty.ng"
		}
	};
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.a
			}
		}))
	};
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: "https://techfaculty.ng"
		}, {
			"@type": "ListItem",
			position: 2,
			name: "Tech Store",
			item: CANONICAL
		}]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(storeSchema)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(itemListSchema)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(faqSchema)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(breadcrumbSchema)
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-24 pb-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 py-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Breadcrumb",
							className: "mb-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/",
									className: "hover:text-foreground",
									children: "Home"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: "Tech Store"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "mb-4",
									children: "Prices in Naira · Order on WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl font-bold leading-tight md:text-5xl",
									children: "Tech Store — Affordable Tech Gear in Nigeria"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-lg text-muted-foreground",
									children: "The everyday tech Nigerians actually search for: our locally assembled Battery Bank power bank, tested student laptops, laptop accessories, custom phone cases printed in Nigeria, and robotics kits from our Hardware & Robotics department. Pick what you need, message us on WhatsApp, and we deliver."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
												size: 16,
												className: "text-primary"
											}), " Nationwide delivery"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, {
												size: 16,
												className: "text-primary"
											}), " Pay on delivery available"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
												size: 16,
												className: "text-primary"
											}), " Pickup at Technology Incubation Centres"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
												size: 16,
												className: "text-primary"
											}), " Tested before dispatch"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: storeWhatsAppUrl("Hello Tech Faculty, I want to buy from your tech store. Please send me what is currently available and prices."),
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 18
											}), " Chat with a sales rep"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/locations",
											children: "Find a pickup centre"
										})
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4",
						"aria-label": "Search and filter products",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/70 bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 16,
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search power bank, laptop, phone case, headset…",
									"aria-label": "Search products",
									className: "pl-9"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: ["All", ...STORE_CATEGORIES].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: category === option ? "default" : "outline",
									onClick: () => setCategory(option),
									children: option
								}, option))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 py-10",
						"aria-label": "Products",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-6 text-2xl font-bold",
							children: [
								category === "All" ? "All products" : category,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base font-normal text-muted-foreground",
									children: [
										"(",
										filtered.length,
										")"
									]
								})
							]
						}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border p-10 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Nothing matches that search. Tell us what you need on WhatsApp and we will source it for you."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: storeWhatsAppUrl(`Hello Tech Faculty, I am looking for: ${query || "a specific tech product"}. Can you source it for me?`),
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
										className: "mr-2",
										size: 18
									}), " Request it on WhatsApp"]
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
							children: filtered.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
								product,
								onOpenDetails: setActive
							}, product.slug))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 py-10",
						"aria-label": "How ordering works",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold",
							children: "How ordering works"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-4 md:grid-cols-3",
							children: [
								{
									step: "1",
									title: "Message us on WhatsApp",
									body: "Tap “Order on WhatsApp” on any product. The product name and price are already in the message — just hit send."
								},
								{
									step: "2",
									title: "Confirm details & payment",
									body: "We confirm stock, delivery cost to your location, and how you want to pay: bank transfer, or pay on delivery where available."
								},
								{
									step: "3",
									title: "Delivery or free pickup",
									body: "We dispatch nationwide within 1–4 working days, or you collect free at any Technology Incubation Centre near you."
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/70 bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary",
										children: item.step
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: item.body
									})
								]
							}, item.step))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 py-10",
						"aria-label": "Delivery, payment and pickup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/70 bg-secondary/30 p-6 md:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold",
									children: "Delivery, payment & pickup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid gap-6 md:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
												size: 18,
												className: "text-primary"
											}), " Nationwide delivery"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-muted-foreground",
											children: "We ship to all 36 states and the FCT. 1–2 working days across the South East and Lagos, 2–4 working days elsewhere. You get the exact delivery fee before you pay anything."
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, {
												size: 18,
												className: "text-primary"
											}), " Pay on delivery"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-muted-foreground",
											children: "Pay on delivery is available for most locations and items. For high-value items like laptops we may take a part payment for logistics, and you settle the balance on arrival."
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
												size: 18,
												className: "text-primary"
											}), " Free centre pickup"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-sm text-muted-foreground",
											children: [
												"Collect free from our Nnewi headquarters or any Technology Incubation Centre we operate from — Onitsha, Awka, Enugu, Owerri, Aba, Abakaliki, Abuja, Lagos and more.",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: "/locations",
													className: "text-primary underline",
													children: "See all centres"
												}),
												"."
											]
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-sm text-muted-foreground",
									children: "Studying with us? Send your Faculty ID in the chat to get the current student price on accessories and learning kits."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 py-10",
						"aria-label": "Frequently asked questions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold",
							children: "Frequently asked questions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "mt-4",
							children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: `faq-${index}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left",
									children: faq.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
									className: "text-muted-foreground",
									children: faq.a
								})]
							}, faq.q))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 py-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/70 bg-card p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold md:text-3xl",
									children: "Ready to order?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-3 max-w-xl text-muted-foreground",
									children: "Send one message and we handle the rest — availability, delivery to your address or free pickup, and payment on delivery where available."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: storeWhatsAppUrl("Hello Tech Faculty, I want to place an order from your tech store. Please help me."),
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 18
										}), " Order on WhatsApp"]
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
				product: active,
				onOpenChange: (open) => !open && setActive(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = TechStore;
//#endregion
export { SplitComponent as component };
