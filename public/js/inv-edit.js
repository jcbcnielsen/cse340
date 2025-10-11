const form = document.getElementById("editInvForm");
form.addEventListener("change", () => {
    const subButton = document.getElementById("editInvSubButton");
    subButton.removeAttribute("disabled");
});