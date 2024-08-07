export function buildHTMLElement(
  tagName: string,
  className?: string
): HTMLElement {
  const element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }
  return element;
}

export function buildButton(
  text: string,
  type?: "submit" | "button" | "reset",
  disabled?: boolean
): HTMLButtonElement {
  const button = buildHTMLElement("button", "button") as HTMLButtonElement;
  const p = buildHTMLElement("p");
  p.textContent = text;

  if (type) {
    button.type = type;
  }

  if (disabled) {
    button.disabled = disabled;
  }

  button.append(p);
  return button;
}
