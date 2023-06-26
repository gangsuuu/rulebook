import { gsap } from 'gsap';

export default class Animation{
  constructor(introStart,gsap) {
    this.introStart = introStart;
    this.gsap = gsap;
    this.scrollAnimationGsap = this.gsap.timeline()
    this.entered = false;
    let introPageOff = false;
  }

  /** Intro Aimation */
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
  /** Scroll  */
  scrollAnimation(y,lastY,camera){
    const menuContainter = document.querySelector('.earthMenuContatiner')
    const indexCotentBox = document.querySelector('.index-Content-Box')
    const indexCotentMidle = document.querySelector('.index-Content-bottom')
    const indexEartlogo = document.querySelector('.earth')
    const moveIndexContentsTrigerStart = 620;
    const moveIndexContentsTrigerEnd = 720;
    
    if(y > lastY && y >= moveIndexContentsTrigerStart  && y <= moveIndexContentsTrigerEnd){
      this.scrollAnimationGsap.to(
        menuContainter,
        {
          duration : .2,
          top : -120,
        }
      )
      this.scrollAnimationGsap.to(
        indexCotentBox,{
          duration : .3,
          right : -500,
        }
      )
      this.scrollAnimationGsap.to(
        indexEartlogo,
        {
          duration : .3,
          left : -900,
        }
      )
      this.scrollAnimationGsap.to(
        indexCotentMidle,
        {
          duration : .11,
          scale : 1.2,
          bottom: -2,
          onComplete: () => this.introPageOff = true
        }
      )
    } else if(y < lastY && y >= moveIndexContentsTrigerStart  && y <= moveIndexContentsTrigerEnd){
      this.scrollAnimationGsap.to(
        menuContainter,
        {
          duration :.2,
          top : 45,
        }
      )
      this.scrollAnimationGsap.to(
        indexCotentBox,{
          duration : .3,
          right : 105,
        }
      )
      this.scrollAnimationGsap.to(
        indexEartlogo,
        {
          duration : .3,
          left : 0,
          onComplete: () => this.introPageOff = false
        }
      )
    }
    const enterToContent = () => {
      this.scrollAnimationGsap.to(
        camera.position, {
        z : 0.7,
        duration : 2.5,
        ease: 'expo'
      })
    }

    lastY = y
    return lastY;
  }
enterToContent(camera) {
  if(this.introPageOff){
    // this.scrollAnimationGsap.to(
    //   camera.position, {
    //   z : 0.7,
    //   duration : 2.5,
    //   ease: 'expo',
    //      onComplete: () => this.entered = true
    // })
  }
  return this.entered = true;
}
moveView() {

}

}