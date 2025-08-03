let trees = JSON.parse(localStorage.getItem("trees") || "[]");
displayTrees();

document.getElementById("tree-type-select").addEventListener("change", function () {
  const customContainer = document.getElementById("custom-type-container");
  customContainer.style.display = this.value === "Autre" ? "block" : "none";
});

document.getElementById("tree-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const select = document.getElementById("tree-type-select");
  const type = select.value === "Autre"
    ? document.getElementById("custom-tree-type").value.trim()
    : select.value;
  const frequency = parseInt(document.getElementById("watering-frequency").value);

  if (!type || isNaN(frequency)) return;

  const newTree = {
    id: Date.now(),
    type,
    frequency,
    lastWatered: null
  };

  trees.push(newTree);
  localStorage.setItem("trees", JSON.stringify(trees));
  displayTrees();
  this.reset();
  document.getElementById("custom-type-container").style.display = "none";
});

function displayTrees() {
  const list = document.getElementById("tree-list");
  list.innerHTML = "";
  trees.forEach(tree => {
    const div = document.createElement("div");
    div.className = "tree-card clickable";
    div.innerHTML = `
      <strong>${tree.type}</strong><br>
      Fréquence : tous les ${tree.frequency} jours<br>
      Dernier arrosage : ${tree.lastWatered ? formatDateFr(tree.lastWatered) : "Jamais"}<br>
      Prochain arrosage : ${getNextWatering(tree)}
    `;
    div.onclick = () => {
      window.location.href = `arbre.html?id=${tree.id}`;
    };
    list.appendChild(div);
  });
}

function getNextWatering(tree) {
  if (!tree.lastWatered) return "Inconnu";
  const next = new Date(tree.lastWatered);
  next.setDate(next.getDate() + tree.frequency);
  return next.toLocaleDateString("fr-FR");
}

function formatDateFr(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR");
}

// 🌗 Thème
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

// ☰ Menu
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
