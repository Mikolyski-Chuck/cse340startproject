const form = document.querySelector("#update-inv-form")
const formData = new FormData(document.forms[0])
formArray = []
formData.forEach(function(value) {
    formArray.push(value);
  });


form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#update-inventory-sub")  
        //console.log(form[0].value)
        //console.log(formArray[0])
    for ( let i = 0; i < form.length-2; i++) {
            if (form[i].value != formArray[i])
            //console.log(form[i].value + " is different")
            updateBtn.removeAttribute("disabled")
        }    
        
    })