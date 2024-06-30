
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Adding leading zero if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  const getRandomEmoji = (type = 0) => {
    // ['emoji', 'box'];
    const listBox = window.Assets.find(e => e.key ==="list_box");
  
    const boxRandom = getRandomItem(listBox.data);
    let data ;
    switch(type) {
      case 0:{
        const listPositive = window.Assets.find(e => e.key ==="list_positive");
  
        data= [getRandomItem(listPositive.data), boxRandom];
        break;
      
     }
      case 1: {
        const list_negative = window.Assets.find(e => e.key ==="list_negative");
  
  data= [getRandomItem(list_negative.data), boxRandom];
  break;
      }
      case 2: {
        const list_nother = window.Assets.find(e => e.key ==="list_other");
  
  data= [getRandomItem(list_nother.data), boxRandom];
  break;
        
      }
    }
    return `<img class="box" src=${data[1]} alt="box emoji">
    <img class="emoji  ${type == 0? "emojiUpperSize":''}" src=${data[0]} alt ="emoji" >`;
  }
  function getRandomItem(list) {

    const randomIndex = Math.floor(Math.random() * list.length);
    
    return list[randomIndex];
  }
  
  function randomWithProbability(probability) {
    // Tạo một số ngẫu nhiên từ 0 đến 1
    const randomNum = Math.random();
    // So sánh với tỷ lệ truyền vào
    return randomNum < (probability / 100);
  }
  const resizeSize = () => {
    const mapEl = document.querySelector(".mapGame");
    const widthMap = mapEl.clientWidth;
    if (window.screen.width <= 700) {
      screen.orientation.lock("portrait-primary").catch((err) => err);
    } else {
      screen.orientation.unlock();
    }
    document.documentElement.style.setProperty(
      "--size-cell",
      widthMap / 5 + "px"
    );
    document.documentElement.style.setProperty(
      "--padding-cell",
      screen.width / 390 / 3 + 5 + "px"
    );
    mapEl.style["minHeight"] = widthMap + "px";
  };
 export {formatTime,getRandomEmoji,getRandomItem,randomWithProbability,resizeSize}