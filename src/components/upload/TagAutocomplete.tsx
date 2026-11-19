"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({ availableTags, label, value, onChange }: TagAutocompleteProps) {
  const inputId = useId();
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const lastCommaIndex = value.lastIndexOf(",");
  const currentToken = value.slice(lastCommaIndex + 1).trim().toLowerCase();
  const selectedTags = (lastCommaIndex < 0 ? "" : value.slice(0, lastCommaIndex))
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const suggestions = currentToken
    ? availableTags.filter((tag) =>
      tag.toLowerCase().startsWith(currentToken) && !selectedTags.includes(tag.toLowerCase())
    )
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;
  const activeOptionIndex = showSuggestions && activeIndex < suggestions.length ? activeIndex : -1;

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function selectTag(tag: string) {
    const precedingValue = lastCommaIndex < 0 ? "" : value.slice(0, lastCommaIndex + 1);
    onChange(`${precedingValue}${precedingValue ? " " : ""}${tag}`);
    closeSuggestions();
  }

  return (
    <div className="tag-autocomplete-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="tag-autocomplete-control">
        <input
          aria-activedescendant={activeOptionIndex >= 0 ? `${listId}-option-${activeOptionIndex}` : undefined}
          aria-autocomplete="list"
          aria-controls={showSuggestions ? listId : undefined}
          aria-expanded={showSuggestions}
          id={inputId}
          name="tags"
          onBlur={closeSuggestions}
          onChange={(event) => {
            onChange(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              if (suggestions.length === 0) return;
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex(event.key === "ArrowDown"
                ? (activeOptionIndex + 1) % suggestions.length
                : (activeOptionIndex <= 0 ? suggestions.length : activeOptionIndex) - 1);
            } else if (event.key === "Enter" && activeOptionIndex >= 0) {
              event.preventDefault();
              selectTag(suggestions[activeOptionIndex]);
            } else if (event.key === "Escape" || event.key === "Tab") {
              closeSuggestions();
            }
          }}
          placeholder="wedding, portrait, outdoor..."
          role="combobox"
          type="text"
          value={value}
        />
        {showSuggestions ? (
          <ul className="tag-suggestions" id={listId} role="listbox">
            {suggestions.map((tag, index) => (
              <li
                aria-selected={index === activeOptionIndex}
                id={`${listId}-option-${index}`}
                key={tag}
                onClick={() => selectTag(tag)}
                onMouseDown={(event) => event.preventDefault()}
                role="option"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}