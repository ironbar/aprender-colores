const colors = [
  { name: "Rojo", value: "#ef4444", text: "#ffffff", defaultSelected: true },
  { name: "Azul", value: "#2563eb", text: "#ffffff", defaultSelected: true },
  { name: "Amarillo", value: "#facc15", text: "#111827", defaultSelected: true },
  { name: "Verde", value: "#22c55e", text: "#ffffff" },
  { name: "Blanco", value: "#ffffff", text: "#111827" },
  { name: "Negro", value: "#111827", text: "#ffffff" },
  { name: "Naranja", value: "#f97316", text: "#ffffff" },
  { name: "Morado", value: "#9333ea", text: "#ffffff" },
  { name: "Rosa", value: "#ec4899", text: "#ffffff" },
  { name: "Marrón", value: "#92400e", text: "#ffffff" },
  { name: "Gris", value: "#6b7280", text: "#ffffff" },
];

const app = document.querySelector("#app");
const colorName = document.querySelector("#colorName");
const menuButton = document.querySelector("#menuButton");
const colorMenu = document.querySelector("#colorMenu");
const menuActionButton = document.querySelector("#menuActionButton");
const colorOptions = document.querySelector("#colorOptions");

const primaryColors = colors.filter((color) => color.defaultSelected);

let selectedColors = colors.filter((color) => color.defaultSelected);
let currentColor = selectedColors[0];
let colorQueue = [];

function formatColorName(color) {
  return color.name.toLocaleUpperCase("es-ES");
}

function shuffleColors(colorsToShuffle) {
  const shuffledColors = [...colorsToShuffle];

  for (let index = shuffledColors.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledColors[index], shuffledColors[randomIndex]] = [
      shuffledColors[randomIndex],
      shuffledColors[index],
    ];
  }

  return shuffledColors;
}

function refillColorQueue() {
  const availableColors = selectedColors.filter((color) => color !== currentColor);
  colorQueue = shuffleColors(availableColors);
}

function areAllColorsSelected() {
  return selectedColors.length === colors.length;
}

function updateMenuActionButton() {
  menuActionButton.textContent = areAllColorsSelected()
    ? "Activar solo primarios"
    : "Activar todos";
}

function renderColorOptions() {
  colorOptions.innerHTML = "";

  colors.forEach((color) => {
    const option = document.createElement("label");
    option.className = "color-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = color.name;
    checkbox.checked = selectedColors.includes(color);
    checkbox.addEventListener("change", () => updateSelectedColors(color, checkbox));

    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color.value;

    const label = document.createElement("span");
    label.className = "color-label";
    label.textContent = formatColorName(color);

    option.append(checkbox, swatch, label);
    colorOptions.append(option);
  });
}

function setSelectedColors(nextSelectedColors) {
  selectedColors = nextSelectedColors;
  colorQueue = [];
  renderColorOptions();
  updateMenuActionButton();

  if (!selectedColors.includes(currentColor)) {
    showRandomColor();
  }
}

function updateSelectedColors(color, checkbox) {
  let selectionChanged = false;

  if (checkbox.checked) {
    selectedColors = [...selectedColors, color];
    selectionChanged = true;
  } else if (selectedColors.length > 2) {
    selectedColors = selectedColors.filter((selectedColor) => selectedColor !== color);
    selectionChanged = true;
  } else {
    checkbox.checked = true;
  }

  if (!selectionChanged) {
    return;
  }

  colorQueue = [];
  updateMenuActionButton();

  if (!selectedColors.includes(currentColor)) {
    showRandomColor();
  }
}

function showColor(color) {
  currentColor = color;
  app.style.backgroundColor = color.value;
  app.style.color = color.text;
  colorName.textContent = formatColorName(color);
}

function showRandomColor() {
  if (colorQueue.length === 0) {
    refillColorQueue();
  }

  const nextColor = colorQueue.shift();

  if (nextColor) {
    showColor(nextColor);
  }
}

function toggleMenu() {
  const isOpen = !colorMenu.hidden;
  colorMenu.hidden = isOpen;
  menuButton.setAttribute("aria-expanded", String(!isOpen));
}

menuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMenu();
});

colorMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

menuActionButton.addEventListener("click", () => {
  setSelectedColors(areAllColorsSelected() ? primaryColors : colors);
});

app.addEventListener("click", showRandomColor);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !colorMenu.hidden) {
    toggleMenu();
    menuButton.focus();
  }
});

renderColorOptions();
updateMenuActionButton();
showColor(currentColor);
