import { gsap } from 'gsap';

export default class Animation{
  constructor(introStart,gsap) {
    this.introStart = introStart;
    this.gsap = gsap;
  }
  animationIntro() {
    if (!this.introStart) return
    const introTimeLine = this.gsap.timeline()
    const letters = ['Project','Earth']
    const introPage = document.querySelector('#introPage')
    const writeSpeed = 210;
    const deleteSpeed = 140;
    let i = 0;

    function wait(ms){
      return new Promise(res => setTimeout(res,ms))
    }
    
    //글자 생성
    const typing = async () => {
      const letter =  letters[i].split("");

      while(letter.length) {
        
        await wait(writeSpeed)
        introPage.innerHTML += letter.shift();
        console.log("write")
      }

      await wait(1400);

      if (letters[i + 1]) remove()
      else {
        introTimeLine.to(
          introPage,
          {
            duration : 1.4,
            backgroundColor:'#000000',
            opacity : 0,
          },
          1
        )
        introTimeLine.to(
          introPage,
          {
            display:'none'
          }
        )
        
      }
    }

    //글자 삭제
    const remove = async () => {
      const letter = letters[i].split("");
      while (letter.length){
        await wait(deleteSpeed);
        letter.pop();
        introPage.innerHTML = letter.join("");
      }
      i++
      typing()
    }


    setTimeout(typing,1500);
    return false
  }


}