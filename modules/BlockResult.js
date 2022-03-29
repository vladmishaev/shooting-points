
const divResult = document.querySelector("[data-game-result]");


export default {

    hiddenBlock(){
        divResult.classList.remove('active');
    },

    showBlock(){
        divResult.classList.add('active');
    }
}