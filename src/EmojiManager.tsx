import React, { useState, ChangeEvent } from "react";
import emojiData from "emoji-datasource";
// import { EmojiData } from "emoji-datasource";

interface Emoji {
  name: string;
  symbol: string;
}

const convertShortNameToUnicode = (shortName: string): string => {
  const emoji = emojiData.find((e) => e.short_name === shortName);
  if (emoji) {
    return emoji.unified
      .split("-")
      .map((code) => String.fromCodePoint(parseInt(code, 16)))
      .join("");
  }
  return "";
};

const getAllEmojis = (): Emoji[] => {
  return emojiData.map((emoji) => ({
    name: emoji.short_name,
    symbol: convertShortNameToUnicode(emoji.short_name),
  }));
};

const getFaceEmojis = (): Emoji[] => {
  return emojiData
    .filter((emoji) => emoji.category === "Smileys & People")
    .map((emoji) => ({
      name: emoji.short_name,
      symbol: convertShortNameToUnicode(emoji.short_name),
    }));
};

const allEmojis = getAllEmojis();
const faceEmojis = getFaceEmojis();

const EmojiInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Emoji[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);

    const match = value.match(/:([a-zA-Z0-9_]*)$/);
    if (match) {
      const search = match[1];
      const filteredFaceEmojis = faceEmojis.filter((emoji) =>
        emoji.name.startsWith(search)
      );
      const filteredOtherEmojis = allEmojis.filter(
        (emoji) => emoji.name.startsWith(search) && !faceEmojis.includes(emoji)
      );
      setSuggestions([...filteredFaceEmojis, ...filteredOtherEmojis]);
    } else {
      setSuggestions([]);
    }
  };

  const handleEmojiClick = (emoji: Emoji): void => {
    const newValue = inputValue.replace(/:([a-zA-Z0-9_]*)$/, emoji.symbol);
    setInputValue(newValue);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
      />
      {suggestions.length > 0 && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "5px",
            maxHeight: "200px",
            overflowY: "scroll",
          }}
        >
          {suggestions.map((emoji, index) => (
            <span
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              style={{ cursor: "pointer", fontSize: "24px", margin: "5px" }}
            >
              {emoji.symbol}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
