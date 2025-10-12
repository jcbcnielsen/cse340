const openButton = document.getElementById("accountDeleteDialogOpenButton");
const closeButton = document.getElementById("accountDeleteDialogCloseButton");
const subButton = document.getElementById("accountDeleteFormSubButton");
const deleteDialog = document.getElementById("accountDeleteFormDialog");

openButton.addEventListener("click", () => {
    deleteDialog.showModal();
});

closeButton.addEventListener("click", () => {
    deleteDialog.close();
});

subButton.addEventListener("click", () => {
    deleteDialog.close();
});