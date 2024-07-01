import { formatTime, getRandomEmoji, getRandomItem, randomWithProbability, resizeSize } from "./helper.js";

   
const initDraggable = () => {
var main_game = document.getElementById("main_game");

const container = document.querySelector("#main_game");
const droppable = new Draggable.Draggable(container, {
  draggable: ".animal",
  mirror: {
    constrainDimensions: true, 
  },
});

window.isShowPreview = true;
let dragg_moveTo;

droppable.on("drag:start", (evt) => {
  
  dragg_moveTo = evt.data.originalSource;
  const idAnimalShow =(dragg_moveTo.dataset.idAnimal);
  const animal = window.listAnimals.find(e =>e.idCurrentCell == idAnimalShow);
  
  const el_animation =  document.querySelector(`.generate_animation[data-id-animal="${idAnimalShow}"]`);
  animal.countTime=null;
 if(el_animation.innerHTML != "") {
      el_animation.innerHTML = "";
      const el_cell=  document.querySelector(`.cell[data-index-cell="${animal.idCurrentCell}"]`);
      el_cell.classList.remove("animalHavAnimation");
 }

  if (window.isShowPreview) {
    evt.cancel();
  }
});

const handleSwapAnimalDragg = (
  moveToInfo,
  currentInfo,
  el_cellMoveTo,
  el_cellCurrent,
  el_animalMoveTo,
  el_animalCurrent,
  event
) => {
  const idMoveToTmp = moveToInfo.animal.idCurrentCell;
  const idCurrentTmp = currentInfo.animal.idCurrentCell;

  moveToInfo.animal.idCurrentCell = idCurrentTmp;
  currentInfo.animal.idCurrentCell = idMoveToTmp;
  moveToInfo.animal.countTime = 0;
  currentInfo.animal.countTime = 0;

  let countCorrect = 0;
  const elEmoji1 =  document.querySelector(`.generate_emoji[data-id-animal="${currentInfo.cell.index}"]`);


  const el_animation =  document.querySelector(`.generate_animation[data-id-animal="${moveToInfo.animal.idCurrentCell}"]`);
      
      if(el_animation.innerHTML != "") {
           el_animation.innerHTML = "";
           const el_cell=  document.querySelector(`.cell[data-index-cell="${moveToInfo.animal.idCurrentCell}"]`);
           el_cell.classList.remove("animalHavAnimation");
      }


  if (moveToInfo.animal.idCorrectCell == currentInfo.cell.index) {
    countCorrect++;
    el_cellCurrent.classList.add("correct");
    currentInfo.cell.isCorrect = true;
    elEmoji1.innerHTML = getRandomEmoji(0);
  } else {
    elEmoji1.innerHTML = getRandomEmoji(1);

  }
  //  document.querySelector(`.generate_emoji[data-id-animal="${currentInfo.cell.index}"]`).innerHTML = getRandomEmoji(countCorrect == 0? 1: 0 )

   const elEmoji2 =  document.querySelector(`.generate_emoji[data-id-animal="${moveToInfo.cell.index}"]`);
  if (currentInfo.animal.idCorrectCell == moveToInfo.cell.index) {
    countCorrect++;
    el_cellMoveTo.classList.add("correct");
    moveToInfo.cell.isCorrect = true;
    elEmoji2.innerHTML = getRandomEmoji(0  );
  } else {
    elEmoji2.innerHTML = getRandomEmoji(1 );

  }
  if(countCorrect ==1) {
  const el_audio =  document.getElementById("correct_cell");
  el_audio.currentTime = 0;
  el_audio.play();
  } else if (countCorrect == 2) {
    const el_audio =  document.getElementById("correct_cell_2");
  el_audio.currentTime = 0;

    el_audio.play();
  }
  document.getElementById("text_move_game").innerText =
    ++window.countMoves;
  if(window.countMoves === 1) {
    document.getElementById("gif_hand_move").remove()
    main_game.classList.remove("overlay");
  } else if (window.countMoves === 6) {
    ExitApi.exit();
  } 
  // else if(!window.mapGame.some(e =>!e.isCorrect)) {
  //   ExitApi.exit();

  // }
  el_animalMoveTo.src = currentInfo.animal.image;
  el_animalCurrent.src = moveToInfo.animal.image;
  goBackAnimation(event, currentInfo.animal.image);
};
class CellAndAnimal {
  constructor(cell, animal) {
    this.cell = cell;
    this.animal = animal;
  }
}

const goBackAnimation = (event, imgGoback = null) => {
  const elAudio =document.getElementById('swoosh');
  elAudio.currentTime  =0;
  elAudio.play();

  const nodeNeedHandle = document.querySelector(".draggable-mirror");
  const parrentNode = nodeNeedHandle.parentNode;
  const el_origin = event.data.originalSource;
  el_origin.classList.add("none");
  const cloneEl = nodeNeedHandle.cloneNode();
  cloneEl.classList.remove("draggable-mirror");
  if (imgGoback != null) {
    // case for swap animation
    cloneEl.src = imgGoback;
  } else {
    const elAudio =document.getElementById('move_wrong');
  elAudio.currentTime  =0;
  elAudio.play();
  }
  cloneEl.classList.add("classAnimateGotoAnimal");
  parrentNode.appendChild(cloneEl);
  let { x, y } = event.data.source.getBoundingClientRect();

  cloneEl.style["transform"] = ` translate3d(${x}px, ${y}px, 0px) `;
  setTimeout(() => {
    el_origin.classList.remove("none");
    cloneEl.remove();
  }, 400);
};


droppable.on("drag:stop", (event) => {
  const dragg_current = document.querySelector(".draggable--over");
  const el_mirror = document.querySelector(".draggable-mirror");

  const idAnimalShow =(event.data.originalSource.dataset.idAnimal);
  const animal = window.listAnimals.find(e =>e.idCurrentCell == idAnimalShow);
  animal.countTime = 0;

  if (dragg_current != null) {
    const idAnimalCurrentCell = Number(dragg_current.dataset.idAnimal);
    const idAnimalMoveToCell = Number(dragg_moveTo.dataset.idAnimal);
    const indexCellCurrent = Number(
      dragg_current.parentNode.dataset.indexCell
    );
    const indexCellMoveTo = Number(
      dragg_moveTo.parentNode.dataset.indexCell
    );
    const cellMoveTo = window.mapGame[indexCellMoveTo];
    const cellCurrent = window.mapGame[indexCellCurrent];

    if (
      idAnimalCurrentCell != idAnimalMoveToCell &&
      !(cellMoveTo.isCorrect || cellCurrent.isCorrect)
    ) {
      const animalMoveTo = window.listAnimals.find(
        (e) => e.idCurrentCell == idAnimalMoveToCell
      );
      animalMoveTo.countTime = 0;
      const animalCurrent = window.listAnimals.find(
        (e) => e.idCurrentCell == idAnimalCurrentCell
      );
      animalCurrent.countTime = 0;
    
      const infoMoveTo = new CellAndAnimal(cellMoveTo, animalMoveTo);
      const infoCurrent = new CellAndAnimal(cellCurrent, animalCurrent);

      handleSwapAnimalDragg(
        infoMoveTo,
        infoCurrent,
        dragg_moveTo.parentNode,
        dragg_current.parentNode,
        dragg_moveTo,
        dragg_current,
        event
      );
    } else {
      goBackAnimation(event);
    }
  } else {
    goBackAnimation(event);
  }
});

droppable.on("mirror:created", (event) => {
  event.data.mirror.style.zIndex = 1000;
});

window.addEventListener("create-map", (e) => {
  const { listAnimals, listCells } = e.detail;

  const mapEl = document.querySelector(".mapGame");

  resizeSize();
  
  mapEl.innerHTML = "";
  let newInnerHtmlMap = "";
  let index = 0;
  for (let animal of listAnimals) {
    const cell = listCells[animal.idCurrentCell];
    
    newInnerHtmlMap += `
    <div class="cell--wrap"  style="left:${cell.columnIndex * 20}%; top:${
      cell.rowIndex * 20
    }%">

    <div data-index-cell="${cell.index}"  class="cell ${
      cell.isCorrect ? "correct" : ""
    }">
     <div data-id-animal="${animal.idCurrentCell}" class="generate_animation "></div>
      <img data-id-animal="${animal.idCurrentCell}" class="animal" src="${
      animal.image
    }" alt="animal" >
    
    </div>
    <div data-id-animal="${animal.idCurrentCell}" class="generate_emoji"></div>
       
    </div>
    `;
    index++;
  }
  newInnerHtmlMap+= `<img id="gif_hand_move" src="./assets/gif/hand_move.gif" alt="gif move cell" >`;
  mapEl.innerHTML = newInnerHtmlMap;
});






window.addEventListener("show-game", () => {
  window.countMoves = 0;

  
  const createMapEvent = new CustomEvent("create-map", {
    detail: {
      listAnimals: window.listAnimals,
      listCells: window.mapGame,
    },
  });
  window.dispatchEvent(createMapEvent);

  const elTime = document.getElementById("time_count_preview");
  let timeCount = 0;
 const timeCountPlaying = setInterval(() => {
    timeCount++;

    elTime.innerText = formatTime(timeCount);
  }, 1000);
});
const timeCountEmojiANdAnimation  = setInterval (() => {
  if(!window.countMoves) {
    return;
  }


  for (let animal of window.listAnimals) {
    const isShowEmoji = false ;
    const isShowAnimate = randomWithProbability(65) ;
    const elementEmoji = document.querySelector(`.generate_emoji[data-id-animal="${animal.idCurrentCell}"]`);
    if(animal.countTime == null) {
      
      return ;
    }
      animal.countTime++;
    const elAnimation =  document.querySelector(`.generate_animation[data-id-animal="${animal.idCurrentCell}"]`);
    if(animal.countTime >= 5 && isShowEmoji && elAnimation.innerHTML === "" ) {
    animal.countTime  = 0;

    
    } else if(animal.countTime >= 3 && elementEmoji.innerHTML != "") {
    animal.countTime  = 0;
    elementEmoji.innerHTML = "";

    }
    if(animal.countTime === 5 ) {
      if(!isShowAnimate) {
        animal.countTime = 0;
      }
    }
    if(animal.countTime ===5&& elementEmoji.innerHTML == "" && window.mapGame[animal.idCurrentCell].isCorrect === false && isShowAnimate) {
        const listAnimation = window.listAnimation.find(e => e.imageAnimal== animal.image);
        if(listAnimation != undefined) {
          const listJson = listAnimation.json;
         const animation  = getRandomItem(listJson);
          // document.querySelector("")
          
          const el_cell=  document.querySelector(`.cell[data-index-cell="${animal.idCurrentCell}"]`);
          el_cell.classList.add("animalHavAnimation");
          // const event = new CustomEvent("show-animation",{
          //   detail: {
          //     id: animal.idCurrentCell,
          //     animation: window.mapGame,
          //   },
          // });
         bodymovin .loadAnimation({
container: document.querySelector(`.generate_animation[data-id-animal="${animal.idCurrentCell}"]`), // container để chứa animation
renderer: 'svg', // loại renderer
loop: true, // lặp lại animation
autoplay: true, // tự động phát
rendererSettings: {
viewBoxOnly: true,

preserveAspectRatio: 'xMidYMid meet'
},
animationData: animation // dữ liệu animation
});

        }
    }
  }
},1000);
}
export default initDraggable;