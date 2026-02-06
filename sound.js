const sounds = {
  click: new Audio("sounds/click.mp3"),
  entree: new Audio("sounds/entree_ok.mp3"),
  sortie: new Audio("sounds/sortie_ok.mp3"),
  refus: new Audio("sounds/refus.mp3")
};

function playSound(name) {
  if (!sounds[name]) return;
  sounds[name].currentTime = 0; // rejouer même si déjà joué
  sounds[name].play().catch(() => {});
}
