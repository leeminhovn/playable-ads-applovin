import { formatTime } from "./helper.js";

const showPreview = (e) => {
  const elPreveiw = document.querySelector(".preview_correct_cell");
  elPreveiw.classList.remove("none");

  let countTimeDown = 30;
  const el_time_countdown_preview =
    document.getElementById("time_count_preview");

  const showIntroEvent = new CustomEvent("create-map", {
    detail: {
      listAnimals: window.listAnimals.map((e) => {
        return { ...e, idCurrentCell: e.idCorrectCell };
      }),
      listCells: window.mapGame.map((e) => {
        return { ...e, isCorrect: true };
      }),
    },
  });
  window.dispatchEvent(showIntroEvent);

  const goToGame = () => {
    window.isShowPreview = false;
    const elPreveiw = document.querySelector(".preview_correct_cell");
    //  elPreveiw.classList.add("none");
    
    elPreveiw.remove();
    document.querySelector(".game-playing").classList.toggle("none");
    const showGame = new CustomEvent("show-game");
    window.dispatchEvent(showGame);
  };
  var timer = setInterval(() => {
    if (countTimeDown != -1) {
      el_time_countdown_preview.innerText = formatTime(countTimeDown);

      countTimeDown--;
    } else {
      goToGame();
      clearInterval(timer);
    }
  }, 1000);

  document.querySelector(".wrapCardNormalGeneralLetGoBtn").onclick =
    () => {

      goToGame();
      clearInterval(timer);

    };
}
export default showPreview;