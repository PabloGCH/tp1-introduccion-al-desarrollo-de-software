let inputs = document.getElementsByTagName('input')
var inputsArray = Array.from(inputs);
console.log(inputs)
inputsArray.forEach(input => {
    console.log(input)
    if (['text', 'number', 'email'].includes(input.type)) {
        input.addEventListener('input',(e) => {
            e.target.classList.remove('is-invalid');
        });
    }
});