import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import emojiData from "emoji-datasource";
import SuggestionPortal from "../src/SuggestionPortal";

const emojis = emojiData.map((emoji) => ({
  name: emoji.short_name,
  symbol: String.fromCodePoint(
    ...emoji.unified.split("-").map((code) => parseInt(code, 16))
  ),
}));

interface Emoji {
  name: string;
  symbol: string;
}

const renderEmojiInput = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const EmojiSuggestionManager = () => {
    const [activeElement, setActiveElement] = useState<HTMLElement | null>(
      null
    );
    const [suggestions, setSuggestions] = useState<Emoji[]>([]);

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      const value = target.innerText || (target as HTMLInputElement).value;

      const match = value.match(/:([a-zA-Z0-9_]*)$/);
      if (match) {
        const search = match[1];
        const filteredSuggestions = emojis.filter((emoji) =>
          emoji.name.startsWith(search)
        );
        setSuggestions(filteredSuggestions);
        setActiveElement(target);
      } else if (value.endsWith(":")) {
        setSuggestions(emojis);
        setActiveElement(target);
      } else {
        setSuggestions([]);
        setActiveElement(null);
      }
    };

    const handleSelect = (emoji: Emoji) => {
      if (activeElement) {
        const value =
          activeElement.innerText || (activeElement as HTMLInputElement).value;
        const newValue = value.replace(/:([a-zA-Z0-9_]*)$/, emoji.symbol);
        if (
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement
        ) {
          activeElement.value = newValue;
        } else {
          activeElement.innerText = newValue;
        }
        setSuggestions([]);
        setActiveElement(null);
      }
    };

    const handleClose = () => {
      setSuggestions([]);
      setActiveElement(null);
    };

    useEffect(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        "input, textarea, [contenteditable]"
      );
      elements.forEach((element) => {
        if (!element.classList.contains("emoji-enhanced")) {
          element.addEventListener("input", handleInput);
          element.classList.add("emoji-enhanced");
        }
      });

      const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll<HTMLElement>(
          "input, textarea, [contenteditable]"
        );
        elements.forEach((element) => {
          if (!element.classList.contains("emoji-enhanced")) {
            element.addEventListener("input", handleInput);
            element.classList.add("emoji-enhanced");
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        elements.forEach((element) => {
          element.removeEventListener("input", handleInput);
        });
        observer.disconnect();
      };
    }, []);

    return (
      <SuggestionPortal
        activeElement={activeElement}
        suggestions={suggestions}
        onSelect={handleSelect}
        onClose={handleClose}
      />
    );
  };

  root.render(<EmojiSuggestionManager />);
};

renderEmojiInput();
