let inputs = document.getElementsByTagName('input')
var inputsArray = Array.from(inputs);
inputsArray.forEach(input => {
    if (['text', 'number', 'email', 'password'].includes(input.type)) {
        input.addEventListener('input',(e) => {
            e.target.classList.remove('is-invalid');
        });
    }
});

const UnknownErrorHandler = (error) => {
    errorToast('An unknown error occurred.');
}

const ErrorHandler = (error) => {
    if(error.message){
        errorToast(window.backendErrors[error.message]);
    }
    if(error.field){
        error.field.forEach(field => {
            let input = document.getElementById(field);
            input.classList.add('is-invalid');
            let inputValidate = document.getElementById(field+"-verify");
            if(inputValidate){
                inputValidate.classList.add('is-invalid');
            }
        });
    }
}
