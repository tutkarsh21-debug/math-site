// Switches that turn whole features on or off. Kept tiny so that pages and client components can import it freely.

// Parent login is switched off for now (the site is being tested by students). Set to true to bring back /parent, the footer link,
// the home page tool card, the privacy line and the "Parent access" box on the student's dashboard. The code for all of it is still in place.
export const PARENT_LOGIN = false;

// The free demo class is hidden for now. Set to true to bring back the Free Demo button, the /demo page, the demo wording and the demo FAQ.
// (Requests already sent are still listed for the owner at /admin/enquiries.)
export const FREE_DEMO = false;
