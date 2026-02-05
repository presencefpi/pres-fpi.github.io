document.addEventListener("DOMContentLoaded", () => {

  const PASSWORD_SECURITE = "1234";

  const tbody = document.querySelector("#tableSecurite tbody");
  const clearBtn = document.getElementById("clearSecurite");

  const prevBtn = document.getElementById("prevDay");
  const nextBtn = document.getElementById("nextDay");
  const dayLabel = document.getElementById("currentDayLabel");

  /* ===============================
     DATES EXISTANTES (NON SUPPRIMÉES)
  =============================== */

  function getExistingDates() {
    return [...new Set(getMouvements().map(m => m.date))].sort();
  }

  /* ===============================
     DATE SÉLECTIONNÉE (PERSISTANTE)
  =============================== */

  const existingDates = getExistingDates();
  const savedDate = localStorage.getItem("selectedSecuriteDate");

  let selectedDate;

  // 👉 LOGIQUE EXACTE SELON TON SOUHAIT
  if (existingDates.includes(today())) {
    selectedDate = today(); // priorité au jour actuel
  } else if (savedDate && existingDates.includes(savedDate)) {
    selectedDate = savedDate; // date mémorisée valide
  } else if (existingDates.length) {
    selectedDate = existingDates[existingDates.length - 1]; // dernière journée
  } else {
    selectedDate = today(); // cas extrême (aucune donnée)
  }

  localStorage.setItem("selectedSecuriteDate", selectedDate);
  localStorage.setItem("printSelectedDate", selectedDate);

  function saveSelectedDate(date) {
    selectedDate = date;
    localStorage.setItem("selectedSecuriteDate", date);

    // 🔁 PARTAGE AVEC LA LISTE IMPRIMABLE
    localStorage.setItem("printSelectedDate", date);

    refreshTable();
  }

  function formatDateLabel(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /* ===============================
     AFFICHAGE TABLE
  =============================== */

  function refreshTable() {
    tbody.innerHTML = "";
    dayLabel.textContent = formatDateLabel(selectedDate);

    const list = getMouvements()
      .filter(m => m.date === selectedDate)
      .sort((a, b) => a.ordre - b.ordre);

    list.forEach(m => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${m.matricule}</td>
        <td>${m.nom}</td>
        <td>${m.heureEntree || "-"}</td>
        <td>${m.heureSortie || "-"}</td>
        <td>${m.photoEntree ? `<img src="${m.photoEntree}" width="60">` : "-"}</td>
        <td>${m.photoSortie ? `<img src="${m.photoSortie}" width="60">` : "-"}</td>
        <td>
          ${
            m.statut === "présent"
              ? `<span class="statut-present">● PRÉSENT</span>`
              : m.statut
          }
        </td>
        <td>${m.justificationEntree || "-"}</td>
        <td>${m.justificationSortie || "-"}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  /* ===============================
     NAVIGATION (JOURS EXISTANTS UNIQUEMENT)
  =============================== */

  prevBtn.onclick = () => {
    const dates = getExistingDates();
    const index = dates.indexOf(selectedDate);
    if (index > 0) {
      saveSelectedDate(dates[index - 1]);
    }
  };

  nextBtn.onclick = () => {
    const dates = getExistingDates();
    const index = dates.indexOf(selectedDate);
    if (index !== -1 && index < dates.length - 1) {
      saveSelectedDate(dates[index + 1]);
    }
  };

  /* ===============================
     SUPPRESSION JOURNÉE (INCHANGÉE)
  =============================== */

  clearBtn.onclick = () => {

    const pass = prompt("🔒 Mot de passe requis pour supprimer la journée");

    if (pass !== PASSWORD_SECURITE) {
      alert("❌ Mot de passe incorrect");
      return;
    }

    const mouvements = getMouvements();
    const duJour = mouvements.filter(m => m.date === selectedDate);

    if (!duJour.length) {
      alert("Aucune donnée pour cette journée");
      return;
    }

    const audit = getAudit();
    duJour.forEach(m => {
      audit.push({
        ...m,
        archivedAt: new Date().toLocaleString("fr-FR")
      });
    });

    saveAudit(audit);

    const restant = mouvements.filter(m => m.date !== selectedDate);
    saveMouvements(restant);

    const datesRestantes = [...new Set(restant.map(m => m.date))].sort();
    saveSelectedDate(datesRestantes.at(-1) || today());
  };

  /* ===============================
     INITIALISATION
  =============================== */

  refreshTable();
});
