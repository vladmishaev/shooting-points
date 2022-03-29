const scoreEls = document.querySelectorAll("[data-count]");

export default {
    update(value){
        scoreEls.forEach(item => {
            item.innerHTML = value;
        });
    }
}