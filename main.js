import { resizeSize } from "./components/helper.js";
import initAsset from "./components/init_asset.js";
import initDraggable from "./components/init_draggable.js";
import showPreview from "./components/show_preview.js";



document.addEventListener("DOMContentLoaded", () => {
  var main_game = document.getElementById("main_game");

  window.addEventListener("resize", () => {
    resizeSize();

  });
    initAsset();
    main_game.classList.add("overlay");
  const previewIntro = document.querySelector(".preview_screen");


  previewIntro.classList.remove("none");

  setTimeout(() => {
  previewIntro.remove();
  showPreview();
  }, 2500);

    const openAudioBackgroundTounch = () =>{
      document.getElementById("background_audio").play();
      document.removeEventListener("touchstart",openAudioBackgroundTounch)
    }
    const openAudioBackgroundClick = () =>{
      document.getElementById("background_audio").play();
      document.removeEventListener("click",openAudioBackgroundClick)
    }
    document.addEventListener("touchstart", openAudioBackgroundTounch);
    document.addEventListener("click", openAudioBackgroundClick);
    initDraggable();

  });