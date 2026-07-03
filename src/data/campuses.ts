export type CampusZone =
  | "South-East"
  | "South-South"
  | "South-West"
  | "North-Central"
  | "North-East"
  | "North-West";

export interface Campus {
  id: string;
  name: string;
  city: string;
  state: string;
  zone: CampusZone;
  address: string;
  lat: number;
  lng: number;
  isHeadquarters?: boolean;
}

export const campuses: Campus[] = [
  {
    id: "hq-nnewi",
    name: "Headquarters — Technology Incubation Centre, Nnewi (South-East Zonal Headquarters)",
    city: "Nnewi",
    state: "Anambra",
    zone: "South-East",
    address:
      "Technology Incubation Centre, Nnewi, Anambra State",
    lat: 6.0086933,
    lng: 6.9086904,
    isHeadquarters: true,
  },
  { id: "onitsha", name: "Onitsha Campus", city: "Onitsha", state: "Anambra", zone: "South-East", address: "Anene Close, Off Ezeiweka Road, Awada, Onitsha, Anambra State", lat: 6.1233161, lng: 6.8035445 },
  { id: "owerri", name: "Technology Incubation Centre, Owerri", city: "Owerri", state: "Imo", zone: "South-East", address: "Technology Incubation Centre, Owerri, Imo State", lat: 5.4208739, lng: 7.0760842 },
  { id: "aba", name: "Technology Incubation Centre, Aba", city: "Aba", state: "Abia", zone: "South-East", address: "Technology Incubation Centre, Aba, Abia State", lat: 5.1215877, lng: 7.3732655 },
  { id: "enugu", name: "Technology Incubation Centre, Enugu", city: "Enugu", state: "Enugu", zone: "South-East", address: "Technology Incubation Centre, Enugu, Enugu State", lat: 6.4482701, lng: 7.5138947 },
  { id: "abakaliki", name: "Technology Incubation Centre, Abakaliki", city: "Abakaliki", state: "Ebonyi", zone: "South-East", address: "Technology Incubation Centre, Abakaliki, Ebonyi State", lat: 6.3230608, lng: 8.1120116 },
  { id: "abuja", name: "National Board for Technology Incubation Headquarters, Abuja", city: "Abuja", state: "Federal Capital Territory", zone: "North-Central", address: "10 Zambezi Crescent, WAEC Building Complex, Maitama, Federal Capital Territory", lat: 9.0782014, lng: 7.4910143 },
  { id: "lagos", name: "Technology Incubation Centre, Lagos", city: "Lagos", state: "Lagos", zone: "South-West", address: "Technology Incubation Centre, Lagos State", lat: 6.5244, lng: 3.3792 },
  { id: "ibadan", name: "Technology Incubation Centre, Ibadan", city: "Ibadan", state: "Oyo", zone: "South-West", address: "Technology Incubation Centre, Ibadan, Oyo State", lat: 7.4263476, lng: 3.9010327 },
  { id: "ph", name: "Technology Incubation Centre, Port Harcourt", city: "Port Harcourt", state: "Rivers", zone: "South-South", address: "Technology Incubation Centre, Port Harcourt, Rivers State", lat: 4.7555368, lng: 7.0081828 },
  { id: "benin", name: "Technology Incubation Centre, Benin City", city: "Benin City", state: "Edo", zone: "South-South", address: "Technology Incubation Centre, Benin City, Edo State", lat: 6.2987312, lng: 5.6322245 },
  { id: "kaduna", name: "Technology Incubation Centre, Kaduna", city: "Kaduna", state: "Kaduna", zone: "North-West", address: "Technology Incubation Centre, Kaduna, Kaduna State", lat: 10.5222, lng: 7.4383 },
  { id: "kano", name: "Technology Incubation Centre, Kano", city: "Kano", state: "Kano", zone: "North-West", address: "Technology Incubation Centre, Kano, Kano State", lat: 11.9729226, lng: 8.5533278 },
  { id: "jos", name: "Technology Incubation Centre, Jos", city: "Jos", state: "Plateau", zone: "North-Central", address: "Technology Incubation Centre, Jos, Plateau State", lat: 9.8965273, lng: 8.8583309 },
  { id: "bauchi", name: "Technology Incubation Centre, Bauchi", city: "Bauchi", state: "Bauchi", zone: "North-East", address: "Technology Incubation Centre, Bauchi, Bauchi State", lat: 10.3059926, lng: 9.8403301 },
  { id: "makurdi", name: "Technology Incubation Centre, Makurdi", city: "Makurdi", state: "Benue", zone: "North-Central", address: "Technology Incubation Centre, Makurdi, Benue State", lat: 7.7321516, lng: 8.539144 },
  { id: "uyo", name: "Technology Incubation Centre, Uyo", city: "Uyo", state: "Akwa Ibom", zone: "South-South", address: "Technology Incubation Centre, Uyo, Akwa Ibom State", lat: 4.9897366, lng: 7.9220311 },
  { id: "calabar", name: "Technology Incubation Centre, Calabar", city: "Calabar", state: "Cross River", zone: "South-South", address: "Technology Incubation Centre, Calabar, Cross River State", lat: 4.9757165, lng: 8.3417006 },
  { id: "sokoto", name: "Technology Incubation Centre, Sokoto", city: "Sokoto", state: "Sokoto", zone: "North-West", address: "Technology Incubation Centre, Sokoto, Sokoto State", lat: 13.0684153, lng: 5.2181211 },
  { id: "ilorin", name: "Technology Incubation Centre, Ilorin", city: "Ilorin", state: "Kwara", zone: "North-Central", address: "Technology Incubation Centre, Ilorin, Kwara State", lat: 8.5373356, lng: 4.5443923 },
  { id: "akure", name: "Technology Incubation Centre, Akure", city: "Akure", state: "Ondo", zone: "South-West", address: "Technology Incubation Centre, Akure, Ondo State", lat: 7.2815805, lng: 5.1879159 },
];

export const zones: CampusZone[] = [
  "South-East",
  "South-South",
  "South-West",
  "North-Central",
  "North-East",
  "North-West",
];

export function directionsUrl(c: Campus) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${c.address}, Nigeria`,
  )}`;
}