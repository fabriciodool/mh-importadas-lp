"use client";

import { useState, useRef, useEffect, useId, KeyboardEvent } from "react";
import { searchBrands, getOfficialBrand, isValidBrand } from "@/lib/brands";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onValidBrand: (brand: string | null) => void;
  error?: string;
}

export default function BrandAutocomplete({
  value,
  onChange,
  onValidBrand,
  error,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selectBrand = (brand: string) => {
    onChange(brand);
    onValidBrand(brand);
    setSuggestions([]);
    setOpen(false);
    setHighlighted(-1);
    setInternalError(null);
  };

  const handleInput = (val: string) => {
    onChange(val);
    onValidBrand(null);
    if (!val.trim()) {
      setSuggestions([]);
      setOpen(false);
      setInternalError(null);
      return;
    }
    const results = searchBrands(val);
    setSuggestions(results);
    setOpen(results.length > 0);
    setHighlighted(-1);
  };

  const handleBlur = () => {
    setTouched(true);
    setTimeout(() => {
      setOpen(false);
      if (!value.trim()) {
        setInternalError(null);
        onValidBrand(null);
        return;
      }
      const official = getOfficialBrand(value);
      if (official) {
        onChange(official);
        onValidBrand(official);
        setInternalError(null);
      } else {
        setInternalError("Selecione uma marca da lista");
        onValidBrand(null);
      }
    }, 150);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectBrand(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[highlighted] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const displayError = error || (touched ? internalError : null);
  const valid = isValidBrand(value);

  return (
    <div className="relative">
      <label htmlFor="marca" className="field-label">
        Marca *
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="marca"
          name="marca"
          type="text"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            highlighted >= 0 ? `${listboxId}-${highlighted}` : undefined
          }
          aria-invalid={!!displayError}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (value && suggestions.length > 0) setOpen(true);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Sub Zero, Miele, Smeg..."
          className={`field-input pr-10 ${
            displayError ? "border-red-500 focus:ring-red-500" : ""
          } ${valid ? "border-green-600" : ""}`}
        />
        {valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-lg pointer-events-none">
            ✓
          </span>
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Marcas disponíveis"
          className="absolute z-50 w-full bg-white border border-border shadow-lg mt-0.5 max-h-60 overflow-auto"
        >
          {suggestions.map((brand, i) => (
            <li
              key={brand}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === highlighted}
              onMouseDown={(e) => {
                e.preventDefault();
                selectBrand(brand);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={`px-4 py-3 md:py-2.5 text-base md:text-sm cursor-pointer transition-colors duration-100 ${
                i === highlighted ? "bg-ink text-white" : "hover:bg-surface text-ink"
              }`}
            >
              {brand}
            </li>
          ))}
        </ul>
      )}

      {displayError && (
        <p role="alert" className="field-error">
          {displayError}
        </p>
      )}
    </div>
  );
}
