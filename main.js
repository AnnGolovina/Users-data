const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const cityInput = document.querySelector("#city");
const createButton = document.querySelector("#create");
const usersSection = document.querySelector("#users-section");
const searchInput = document.querySelector("#search");
const sortingByNameCheckbox = document.querySelector("#sort-by-name");
const sortingByAgeCheckbox = document.querySelector("#sort-by-age");
const paginationSection = document.querySelector("#pagination");

let users = [
  { id: generateId(), name: "Lisa", age: 27, city: "Kyiv" },
  { id: generateId(), name: "Ann", age: 30, city: "Odessa" },
  { id: generateId(), name: "John", age: 22, city: "Poltava" },
  { id: generateId(), name: "Olena", age: 25, city: "Mariupol" },
  { id: generateId(), name: "Bob", age: 35, city: "Lviv" },
  { id: generateId(), name: "John", age: 22, city: "Poltava" },
  { id: generateId(), name: "Rory", age: 28, city: "Dublin" },
  { id: generateId(), name: "Ann", age: 30, city: "Odessa" },
  { id: generateId(), name: "John", age: 22, city: "Poltava" },
]

function generateId (length = 10) {
  let id = "";
  const symbols = "0123456789zxcvbnmlkjhgfdsaqwertyuiop";

  for(let i = 0; i < length; i++) {
    id += symbols[Math.floor(Math.random() * symbols.length)]
  }
return id;
}

let changingUser = undefined;
let paginationpageNumber = 0;

renderUsers();

const deleteUser = (userId) => {
  users = users.filter((user) => user.id !== userId);
  renderUsers();
};

const editUser = (userId) => {
  const userToEdit = users.find((user) => user.id === userId);
  const indexOfEditingUser = users.findIndex((user) => user.id === userId) 

  changingUser = {data: userToEdit, index: indexOfEditingUser};

  createButton.textContent = "Save changes";

  nameInput.value = changingUser.data.name;
  ageInput.value = changingUser.data.age;
  cityInput.value = changingUser.data.city;
};

function renderPagination (usersQuantity) {
  paginationSection.innerHTML = "";

  for ( let i = 0; i < usersQuantity / 3; i++ ) {
    const button = document.createElement("button");
    button.textContent = i;
    button.onclick = () => {
      paginationpageNumber = i;
      const groupedUsers = groupElementsOfArray(users, 3);
      renderUsers();
    }
    paginationSection.appendChild(button);
  }
};

const sorting = {
    names: () => {
       const usersCopy = [...users]; 
       usersCopy.sort((user1, user2) => user1.name.localeCompare(user2.name));
       renderUsers(usersCopy);
    },
    ages: () => {
      const usersCopy = [...users]; 
      usersCopy.sort((user1, user2) => +user1.age - +user2.age);
      renderUsers(usersCopy);
    }
};

function renderUsers(usersToRender = groupElementsOfArray(users, 3)[paginationpageNumber]) {
  renderPagination(users.length);

  usersSection.innerHTML = "";

  const usersContent = usersToRender.map(
    (user) => `<div class="user-card">
        <p>${user.name}</p>      
        <span>${user.age}</span>
        <p>${user.city}</p>
        <button class="delete-user-button" id="${user.id}">Delete</button>
        <button class="edit-user-button" id="${user.id}">Edit</button>
    </div>`
  );

  usersContent.forEach((userLayout) => {
    usersSection.innerHTML += userLayout;
  });

  const deleteButtons = [...document.querySelectorAll(".delete-user-button")];

  deleteButtons.forEach((button) => {
    button.onclick = () => deleteUser(button.id);
  });

  const editButtons = [...document.querySelectorAll(".edit-user-button")];

  editButtons.forEach((button) => {
    button.onclick = () => editUser(button.id);
  });
}

createButton.onclick = () => {
  const name = nameInput.value;
  const age = +ageInput.value;
  const city = cityInput.value;

  if (!name || !age || !city) {
   return alert("Please enter all required data");
  }

  if (changingUser) {
   
    users[changingUser.index] = {
        ...users[changingUser.index],
        name: name,
        age: age,
        city: city
    };

    changingUser = undefined;
    createButton.textContent = "Create User";
  } else {
    const user = { id: generateId(), name: name, age: age, city: city };

    users.push(user);
  }

  nameInput.value = "";
  ageInput.value = "";
  cityInput.value = "";

  renderUsers();
};

searchInput.oninput = (event) => {
  if (!event.target.value) return renderUsers();

  const usersToRender = users.filter(({ name, age, city }) =>
    [name, age.toString(), city].some((element) =>
      element.includes(event.target.value)
    )
  );

  renderUsers(usersToRender);
};


sortingByNameCheckbox.onchange = (event) => {
    if (event.target.checked) {
        sorting.names();
        sortingByAgeCheckbox.checked = false;
    } else {
        renderUsers();
    }
}

sortingByAgeCheckbox.onchange = (event) => {
  if (event.target.checked) {
      sorting.ages();
      sortingByNameCheckbox.checked = false;
  } else {
      renderUsers();
  }
}

function groupElementsOfArray(arr, oneSetQuantity) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(arr.slice(i * oneSetQuantity, (i + 1) * oneSetQuantity));
  }

  return result.filter((arr) => arr.length > 0 );
}
