import Pikaday from "pikaday";
import "pikaday/css/pikaday.css";

const formatSpanishDate = (date) => {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
};

export const initPikadayInSwal = (inputId, options = {}) => {
  return new Pikaday({
    field: document.getElementById(inputId),
    format: "YYYY-MM-DD",
    toString: formatSpanishDate,
    ...options,
  });
};
