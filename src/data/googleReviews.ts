// Real reviews from our Google Business Profile ("Nnewi Tech Faculty (Tech Hub)").
// Copied word for word, trimmed only where Google itself cuts the text.
// Refresh the rating, count and quotes from Google Maps when they change.
// Don't add review/rating JSON-LD for these: Google ignores self-published
// ratings for organisations and can treat them as review spam.

export const GOOGLE_PLACE_ID = "ChIJ5ZxSzmi9QxAR23OzR7YbAkM";

export const GOOGLE_RATING = {
  rating: 4.9,
  count: 90,
  checked: "October 2026",
};

/** Opens the Google Maps listing on its reviews. */
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;

/** Opens Google's "write a review" box for the listing. */
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

export interface GoogleReview {
  name: string;
  /** What the reviewer studied or was doing, from their own words. */
  context?: string;
  text: string;
}

export const googleReviews: GoogleReview[] = [
  {
    name: "Onah Emmanuella",
    context: "Data Analytics scholarship",
    text: "My Experience at Nnewi Tech Faculty was Awesome. Was offered a scholarship to learn Data Analytics. This opportunity was a game-changer for me, equipping me with valuable skills and knowledge in a field that's in high demand.",
  },
  {
    name: "Odoh Nchedo",
    context: "Website Development and Product Design",
    text: "I'm here at Nnewi Tech Hub in Anambra as someone who finished secondary school and waiting for university. I'm happy I can learn Website Development and Product Design here while waiting one year for university admission. Happy to learn tech skills in Nnewi without traveling to Lagos or anywhere else.",
  },
  {
    name: "Isreal Sunday",
    text: "Nnewi Tech Faculty is a great place for learning and growth. The team is professional, supportive, and always ready to guide you. The environment is friendly and motivating, I'd definitely recommend them to anyone interested in tech and innovation.",
  },
  {
    name: "Stephanie Chinazom",
    context: "UI/UX Design",
    text: "This place is actually so fantastic with a lot of things to learn and a very patient tutor to make learning tech easy and enjoyable.",
  },
  {
    name: "Queen Obiji",
    context: "Data Science and Analysis",
    text: "Nnewi Tech Faculty is a very good place to Learn tech skills. The environment is very conducive.",
  },
  {
    name: "Chidimma Chianumba",
    text: "They gave me the platform to unlearn and learn in my tech journey alongside connecting with great tech sisturssss",
  },
];
