const form = document.querySelector("#update-acc-form")
const updateBtn = document.querySelector("#form-acc-up-sub")
const formData = new FormData(document.forms[0])
formArray = []
formData.forEach(function(value) {
    formArray.push(value);
  });


form.addEventListener("change", function () {
    function checkForm() {
    for ( let i = 0; i < form.length-2; i++) {
            if (form[i].value != formArray[i]) {
            return true;
            } 
        }
        return false;
    }

    if (checkForm()) {
        updateBtn.removeAttribute("disabled")
    } 
    else if (!checkForm()) {
        updateBtn.setAttribute("disabled", "disabled")
    }

    })