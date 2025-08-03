let trees = JSON.parse(localStorage.getItem("trees") || "[]");

const form = document.getElementById("tree-form");
const treeList = document.getElementById("tree-list");
const typeSelect = document.getElementById("tree-type-select");
const customContainer = document.getElementById("custom-type-container");
const customInput = document.getElementById("custom-tree-type");
const wateringInput = document.getElementById("watering-frequency");

typeSelect.addEventListener("change", () => {
  customContainer.style.display = (typeSelect.value === "Autre") ? "block" : "none";
  customInput.required = (typeSelect.value === "Autre");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let type = typeSelect.value === "Autre" ? customInput.value.trim() : typeSelect.value;
  const frequency = parseInt(wateringInput.value);
  if (!type || !frequency) return;

  const newTree = {
    id: Date.now(),
    type,
    frequency,
    lastWatered: null
  };
  trees.push(newTree);
  localStorage.setItem("trees", JSON.stringify(trees));
  form.reset();
  typeSelect.value = "";
  customContainer.style.display = "none";
  displayTrees();
});

function displayTrees() {
  treeList.innerHTML = "";
  trees.forEach(tree => {
    const div = document.createElement("div");
    div.className = "tree-card clickable";
    div.innerHTML = `<strong>${tree.type}</strong><br>
      Fréquence : tous les ${tree.frequency} jours<br>
      Dernier arrosage : ${tree.lastWatered || "Jamais"}`;
    div.addEventListener("click", () => {
      window.location.href = `arbre.html?id=${tree.id}`;
    });
    treeList.appendChild(div);
  });
}

// Mode sombre
const toggleButton = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") setDarkMode(true);

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    setDarkMode(!isDark);
  });
}

function setDarkMode(enable) {
  document.body.classList.toggle("dark-mode", enable);
  localStorage.setItem("theme", enable ? "dark" : "light");
  if (toggleButton) toggleButton.textContent = enable ? "☀️ Mode clair" : "🌓 Mode sombre";
}

const menuBtn = document.getElementById("menu-button");
const dropdown = document.getElementById("menu-dropdown");
if (menuBtn && dropdown) {
  menuBtn.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });
  window.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

displayTrees();
