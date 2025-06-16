// Force standards mode in IE
document.documentElement.className = document.documentElement.className.replace(
  "no-js",
  "js"
);

// Ensure proper charset and rendering mode
if (document.characterSet !== "UTF-8") {
  console.warn(
    "Document is not using UTF-8 encoding. Current encoding:",
    document.characterSet
  );
}

// Check if we're in quirks mode
if (document.compatMode === "BackCompat") {
  console.warn("Page is in quirks mode! This may cause rendering issues.");
}

// Add this script to the head, before any other scripts
(function () {
  // This is just to ensure the script runs early
})();
