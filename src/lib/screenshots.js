// Screenshots for each project's page (/work/<slug>), in gallery order.
// Files live in public/screenshots, named by the project's initials
// (hp = HomePaws, hh = HomeHub, ci = ClockIn, dp = Dubai Parking). They're
// imported, not referenced by path, so Next.js serves each at a URL with a
// hash of the file: replacing one shows up straight away instead of a stale
// cached copy. Add a file → import it here and add it to its list.
// `caption` is optional.

import hp1 from "../../public/screenshots/hp1.webp";
import hp2 from "../../public/screenshots/hp2.webp";
import hp3 from "../../public/screenshots/hp3.webp";
import hp4 from "../../public/screenshots/hp4.webp";
import hp5 from "../../public/screenshots/hp5.webp";
import hp6 from "../../public/screenshots/hp6.webp";
import hp7 from "../../public/screenshots/hp7.webp";
import hh1 from "../../public/screenshots/hh1.png";
import hh2 from "../../public/screenshots/hh2.png";
import hh3 from "../../public/screenshots/hh3.png";
import hh4 from "../../public/screenshots/hh4.png";
import hh5 from "../../public/screenshots/hh5.png";
import hh6 from "../../public/screenshots/hh6.png";
import hh7 from "../../public/screenshots/hh7.png";
import hh8 from "../../public/screenshots/hh8.png";
import hh9 from "../../public/screenshots/hh9.png";
import hh10 from "../../public/screenshots/hh10.png";
import ci1 from "../../public/screenshots/ci1.webp";
import ci2 from "../../public/screenshots/ci2.webp";
import ci3 from "../../public/screenshots/ci3.webp";
import ci4 from "../../public/screenshots/ci4.webp";
import ci5 from "../../public/screenshots/ci5.webp";
import dp1 from "../../public/screenshots/dp1.webp";
import dp2 from "../../public/screenshots/dp2.webp";
import dp3 from "../../public/screenshots/dp3.webp";
import dp4 from "../../public/screenshots/dp4.webp";
import dp5 from "../../public/screenshots/dp5.webp";
import dp6 from "../../public/screenshots/dp6.webp";
import dp7 from "../../public/screenshots/dp7.webp";
import dp8 from "../../public/screenshots/dp8.webp";
import dp9 from "../../public/screenshots/dp9.webp";
import dp10 from "../../public/screenshots/dp10.webp";
import dp11 from "../../public/screenshots/dp11.webp";
import dp12 from "../../public/screenshots/dp12.webp";
import dp13 from "../../public/screenshots/dp13.webp";
import dp14 from "../../public/screenshots/dp14.webp";

export const SCREENSHOTS = {
  homepaws: [
    { src: hp1, alt: "HomePaws pet listings", caption: "Find a pet — browse dogs and cats up for adoption" },
    { src: hp2, alt: "HomePaws pet profile", caption: "Pet profile — details, FAQs, and starting an inquiry" },
    { src: hp3, alt: "HomePaws news feed", caption: "News feed — community posts with likes and comments" },
    { src: hp4, alt: "HomePaws notifications", caption: "Notifications" },
    { src: hp5, alt: "HomePaws chat", caption: "Real-time chat between owners and adopters" },
    { src: hp6, alt: "HomePaws user profile", caption: "User profile" },
    { src: hp7, alt: "HomePaws rehoming tracker", caption: "Rehoming tracker — from accepted application to completed adoption" },
  ],
  homehub: [
    { src: hh1, alt: "HomeHub owner dashboard", caption: "Owner dashboard — portfolio value, occupancy, and cash flow" },
    { src: hh2, alt: "HomeHub properties and units", caption: "Properties & units — pricing, specs, and availability" },
    { src: hh3, alt: "HomeHub tenants directory", caption: "Tenants directory — leases, deposits, and payment status" },
    { src: hh4, alt: "HomeHub transactions ledger", caption: "Transactions & ledger — every payment with its digital receipt" },
    { src: hh5, alt: "HomeHub account roles", caption: "Account access & roles — owner, staff, and tenants" },
    { src: hh6, alt: "HomeHub messages", caption: "Messages & support — real-time chat with each unit" },
    { src: hh7, alt: "HomeHub tenant dashboard", caption: "Tenant dashboard — months of stay, rent, and billing status" },
    { src: hh8, alt: "HomeHub unit information", caption: "Unit information — lease terms, photos, and specifications" },
    { src: hh9, alt: "HomeHub tenant inbox", caption: "Tenant inbox — direct line to the property owner" },
    { src: hh10, alt: "HomeHub pay rent online", caption: "Pay rent online — GCash, Maya, or bank transfer" },
  ],
  clockin: [
    { src: ci1, alt: "ClockIn dashboard", caption: "Dashboard — today’s attendance, expected salary, and calendar" },
    { src: ci2, alt: "ClockIn attendance log", caption: "Attendance log — every time in and out, with CSV export" },
    { src: ci3, alt: "ClockIn monthly reports", caption: "Monthly reports — days worked, lates, overtime, and weekly hours" },
    { src: ci4, alt: "ClockIn payroll", caption: "Payroll & pay slips — per cutoff, downloadable as PDF" },
    { src: ci5, alt: "ClockIn settings", caption: "Settings — profile, work schedule, and pay rates" },
  ],
  "dubai-parking": [
    { src: dp1, alt: "Dubai Parking home page", caption: "Public site — live free bays before you set off" },
    { src: dp2, alt: "Dubai Parking availability", caption: "Real-time capacity and the bay-by-bay facility layout" },
    { src: dp3, alt: "Dubai Parking rates", caption: "Rates and opening hours for cars and motorcycles" },
    { src: dp4, alt: "Dubai Parking owner overview", caption: "Owner overview — revenue, occupancy trends, and alerts" },
    { src: dp5, alt: "Dubai Parking slots", caption: "Slots — add bays in bulk, level by level" },
    { src: dp6, alt: "Dubai Parking rate versions", caption: "Rates — versioned pricing with grace periods and daily caps" },
    { src: dp7, alt: "Dubai Parking staff", caption: "Staff — add and manage parking attendants" },
    { src: dp8, alt: "Dubai Parking history", caption: "History — every completed session and fee" },
    { src: dp9, alt: "Dubai Parking activity log", caption: "Activity log — who changed what, and when" },
    { src: dp10, alt: "Dubai Parking attendant dashboard", caption: "Attendant dashboard — free bays, arrivals, and long stays" },
    { src: dp11, alt: "Dubai Parking vehicle in", caption: "Vehicle in — register a plate and assign a bay" },
    { src: dp12, alt: "Dubai Parking vehicle out", caption: "Vehicle out — the fee is worked out automatically" },
    { src: dp13, alt: "Dubai Parking lot map", caption: "Lot map — live view of every bay" },
    { src: dp14, alt: "Dubai Parking shift summary", caption: "My shift — vehicles processed and cash collected" },
  ],
};
