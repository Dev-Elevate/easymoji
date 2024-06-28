console.log("New tab opened");
// Import the emoji-datasource data
import emojiData from "emoji-datasource";

const emojis = emojiData.map((emoji) => ({
  name: emoji.short_name,
  symbol: String.fromCodePoint(
    ...emoji.unified.split("-").map((code) => parseInt(code, 16))
  ),
}));

// Function to handle input change and show emoji suggestions
const handleChange = (e) => {
  const value = e.target.value;
  const match = value.match(/:([a-zA-Z0-9_]*)$/);
  if (match) {
    const search = match[1];
    const filteredSuggestions = emojis.filter((emoji) =>
      emoji.name.startsWith(search)
    );
    showSuggestions(e.target, filteredSuggestions);
  } else if (value.endsWith(":")) {
    showSuggestions(e.target, emojis);
  } else {
    removeSuggestions();
  }
};

// Function to show emoji suggestions
const showSuggestions = (inputElement, suggestions) => {
  removeSuggestions();

  if (suggestions.length > 0) {
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = "emoji-suggestions";
    suggestionsContainer.style.position = "absolute";
    suggestionsContainer.style.border = "1px solid #ccc";
    suggestionsContainer.style.background = "#fff";
    suggestionsContainer.style.zIndex = "1000";
    suggestionsContainer.style.maxHeight = "150px";
    suggestionsContainer.style.overflowY = "auto";

    suggestions.forEach((emoji) => {
      const suggestionItem = document.createElement("span");
      suggestionItem.textContent = emoji.symbol;
      suggestionItem.style.cursor = "pointer";
      suggestionItem.style.fontSize = "24px";
      suggestionItem.style.margin = "5px";
      suggestionItem.addEventListener("click", () => {
        const newValue = inputElement.value.replace(
          /:([a-zA-Z0-9_]*)$/,
          emoji.symbol
        );
        inputElement.value = newValue;
        removeSuggestions();
      });
      suggestionsContainer.appendChild(suggestionItem);
    });

    document.body.appendChild(suggestionsContainer);
    const rect = inputElement.getBoundingClientRect();
    suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
    suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
  }
};

// Function to remove emoji suggestions
const removeSuggestions = () => {
  const suggestionsContainer = document.getElementById("emoji-suggestions");
  if (suggestionsContainer) {
    suggestionsContainer.remove();
  }
};

// Add change event listeners to all input elements
const addChangeListeners = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", handleChange);
  });
};

// Initial setup
addChangeListeners();

// Listen for newly added input elements (dynamic content)
const observer = new MutationObserver(() => {
  addChangeListeners();
});

observer.observe(document.body, { childList: true, subtree: true });
