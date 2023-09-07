import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-afd37-default-rtdb.firebaseio.com/",
};

const inputFieldEl = document.querySelector("#input-field");
const addButtonEl = document.querySelector("#add-button");
const shoppingListEl = document.querySelector("#shopping-list");

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

addButtonEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value;
  if (inputValue) {
    push(shoppingListInDB, inputValue);
  }
  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i];
      addItemToShoppingListEl(currentItem);
    }
  } else {
    return (shoppingListEl.innerHTML = "Your shopping cart is empty");
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function addItemToShoppingListEl(item) {
  let itemId = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");

  newEl.innerHTML = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
