// Utility for testing token error handling
// This file can be removed after testing

export const testInvalidToken = () => {
  // Clear the token temporarily to test error handling
  const originalToken = localStorage.getItem("token");
  localStorage.setItem("token", "invalid-token");

  console.log("Token temporarily set to invalid value for testing");

  // Return a function to restore the original token
  return () => {
    if (originalToken) {
      localStorage.setItem("token", originalToken);
    } else {
      localStorage.removeItem("token");
    }
    console.log("Original token restored");
  };
};

export const testMissingToken = () => {
  // Remove the token temporarily to test error handling
  const originalToken = localStorage.getItem("token");
  localStorage.removeItem("token");

  console.log("Token temporarily removed for testing");

  // Return a function to restore the original token
  return () => {
    if (originalToken) {
      localStorage.setItem("token", originalToken);
    }
    console.log("Original token restored");
  };
};
