const validator = require("validator")

const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    desiredAgeRange,
    gender,
    interestIn,
  } = req.body;

  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error("First name and last name are required.");
  }

  // 2. Email check
  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  // 3. Password check (must be strong)
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough.");
  }

  // 4. Age must be a number between 18 and 100
  const ageNum = Number(age);
  if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
    throw new Error("Age must be a number between 18 and 100.");
  }

  // 5. desiredAgeRange must be object with min and max between 18-100
  if (
    !desiredAgeRange ||
    typeof desiredAgeRange !== "object" ||
    !desiredAgeRange.min ||
    !desiredAgeRange.max
  ) {
    throw new Error("Desired age range is required with min and max.");
  }

  const minAge = Number(desiredAgeRange.min);
  const maxAge = Number(desiredAgeRange.max);

  if (
    isNaN(minAge) ||
    isNaN(maxAge) ||
    minAge > 18 ||
    maxAge < 50 ||
    minAge > maxAge
  ) {
    throw new Error("Desired age range must be between 18 and 100, and min should be less than or equal to max.");
  }

  // 6. Gender check (must be a valid string)
  const allowedGenders = ["Male", "Female", "Non-Binary", "Transgender", "other"];
  if (!gender || !allowedGenders.includes(gender)) {
    throw new Error("Gender must be one of: Male, Female, Non-Binary, Transgender, other.");
  }

  // 7. interestIn should be a non-empty array of valid genders
  if (
    !Array.isArray(interestIn) ||
    interestIn.length === 0 ||
    !interestIn.every((g) => allowedGenders.includes(g.toLowerCase()))
  ) {
    throw new Error("InterestIn a valid gender is required to show you user who may also be interested in.");
  }
};

const validateEditProfileData = (req) => {

    const fieldsCanBeEdited = [ 
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills"
  ]

  const isEditAllowed = Object.keys(req.body).every(field => 
    fieldsCanBeEdited.includes(field)
  )

  return isEditAllowed
}

module.exports = { validateSignUpData, validateEditProfileData }