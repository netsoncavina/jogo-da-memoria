const cards = document.querySelectorAll(".card");
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flip");
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // second click
  secondCard = this;
  hasFlippedCard = false;
  checkForMatch();
  checkWin();
  reduceMovements();
  checkLose();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;
  isMatch ? (disableCards(), matches++) : unflipCards();
}

function reduceMovements() {
  let movements = document.querySelector(".movimentos");
  let counter = movements.innerHTML;
  movements.innerHTML >= 0 ? (movements.innerHTML = counter - 1) : null;
}

function checkWin() {
  matches == 6 ? showAlert("win") : null;
}

function checkLose() {
  let movements = document.querySelector(".movimentos").innerHTML;

  movements == -1 && matches != 6 ? showAlert("lose") : null;
}

function showAlert(condition) {
  const alert = Swal.mixin({
    position: "center",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: (alert) => {
      alert.addEventListener("mouseenter", Swal.stopTimer);
      alert.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  condition == "win"
    ? alert
        .fire({
          icon: "success",
          title: "Você ganhou!",
        })
        .then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            document.location.reload(true);
          }
        })
    : alert
        .fire({
          icon: "error",
          title: "Sem mais movimentos!",
        })
        .then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            document.location.reload(true);
          }
        });
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * 12);
    card.style.order = randomPosition;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));
