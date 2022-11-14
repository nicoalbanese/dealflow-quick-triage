const VALID_EMAILS = [
  "nico@ascension.vc",
  // "gcalbanese96@gmail.com",
  "soniag@ascension.vc",
];

export const userValid = (email: string) => {
  if (VALID_EMAILS.includes(email)) {
    return true;
  } else {
    return false;
  }
};
