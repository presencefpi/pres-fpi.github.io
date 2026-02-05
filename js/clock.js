setInterval(() => {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("fr-FR");

  document.getElementById("date").textContent =
    now.toLocaleDateString("fr-FR");
}, 1000);
