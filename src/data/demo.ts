/**
 * Seed data for the prototype. Accounts live only in the visitor's browser
 * (localStorage) — there is no backend yet.
 */
export const demoAccount = {
  name: "Alex Morgan",
  email: "demo@merrymail.ca",
  password: "MerryMail2026!",
};

export const demoAddresses = [
  {
    id: "demo-1",
    name: "Grandma & Grandpa Smith",
    line1: "14 Willow Court",
    city: "Ottawa",
    province: "ON",
    postal: "K2P 1L4",
  },
  {
    id: "demo-2",
    name: "The Miller Family",
    line1: "92 Lakeshore Road E",
    line2: "Unit 5",
    city: "Oakville",
    province: "ON",
    postal: "L6J 1H8",
  },
  {
    id: "demo-3",
    name: "Aunt Sarah",
    line1: "300 Queen Street W",
    line2: "Apt 1804",
    city: "Toronto",
    province: "ON",
    postal: "M5V 2A2",
  },
];
