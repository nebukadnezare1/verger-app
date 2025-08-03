const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
let trees = JSON.parse(localStorage.getItem("trees") || "[]");
let tree = trees.find(t => t.id === id);

if (!tree) {
  alert("Arbre introuvable.");
  window.location.href = "index.html";
}

document.getElementById("tree-title").textContent = `🌳 ${tree.type}`;
document.getElementById("tree-type").textContent = tree.type;
document.getElementById("tree-frequency").textContent = tree.frequency;

document.getElementById("tree-last-watered").textContent = tree.lastWatered
  ? formatDateFr(tree.lastWatered)
  : "Jamais";

document.getElementById("tree-next-watering").textContent = getNextWatering();

// 💧 Marquer comme arrosé
document.getElementById("btn-water").addEventListener("click", () => {
  tree.lastWatered = new Date().toISOString().split("T")[0]; // format ISO
  saveAndRefresh();
});

// ✏️ Modifier
document.getElementById("btn-edit").addEventListener("click", () => {
  const newFreq = prompt("Nouvelle fréquence d’arrosage (en jours) ?", tree.frequency);
  if (newFreq && !isNaN(newFreq)) {
    tree.frequency = parseInt(newFreq);
    saveAndRefresh();
  }
});

// 🗑 Supprimer
document.getElementById("btn-delete").addEventListener("click", () => {
  if (confirm("Supprimer cet arbre ?")) {
    trees = trees.filter(t => t.id !== id);
    localStorage.setItem("trees", JSON.stringify(trees));
    window.location.href = "index.html";
  }
});

// 🔁 Enregistre et recharge la page
function saveAndRefresh() {
  const index = trees.findIndex(t => t.id === id);
  if (index !== -1) trees[index] = tree;
  localStorage.setItem("trees", JSON.stringify(trees));
  location.reload();
}

// 🔢 Calcule la prochaine date d’arrosage
function getNextWatering() {
  if (!tree.lastWatered) return "Inconnu";
  const next = new Date(tree.lastWatered);
  next.setDate(next.getDate() + tree.frequency);
  return formatDateFr(next.toISOString().split("T")[0]);
}

// 🗓️ Affiche une date ISO (aaaa-mm-jj) au format FR (jj/mm/aaaa)
function formatDateFr(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR");
}

// 🌗 Thème sombre
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
