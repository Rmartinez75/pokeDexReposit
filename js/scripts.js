var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=148';

  //Function to validates wether item is an object. If so adds to array
  function add(item) {
    if (typeof item === 'object') {
      pokemonList.push(item);
    } else {
      console.log('This is not a Pokemon!');
    }
  }

  //Funtion to return pokemonList
  function getAll() {
    return pokemonList;
  }

  //Function to display the array of pokemon onto the DOM as buttons
  function addListItem(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      var character = $('.character-list');
      var button = $(
        '<button type="button" class="list-group-item list-group-item-action col-3" data-toggle="modal" data-target="#exampleModal">' +
          pokemon.name +
          '</button>'
      );
      character.append(button);
      button.on('click', function (event) {
        showDetails(pokemon);
      });
    });
  }

  //Function to log the pokemon to console
  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      console.log(pokemon);
      showModal(pokemon);
    });
  }

  //Function to show the bootstraps modal with image
  function showModal(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      var modalTitle = $('.modal-title');
      var modalBody = $('.modal-body');
      var imageFront = $('<img class="modal-img" style="width:25%">');
      var imageBack = $('<img class="modal-img" style="width:25%">');
      //Clears the modal after every time you close modal
      modalTitle.empty();
      modalBody.empty();
      //creating element for height in modal content
      var heightElement = $('<p>' + 'Height : ' + pokemon.height + '</p>');
      //creating element for weight in modal content
      var weightElement = $('<p>' + 'Weight : ' + pokemon.weight + '</p>');
      //creating element for type in modal content
      var typesElement = $('<p>' + 'Types : ' + pokemon.types + '</p>');
      //creating element for abilities in modal content
      var abilitiesElement = $(
        '<p>' + 'Abilities : ' + pokemon.abilities + '</p>'
      );
      //Retrieves front and back images from API
      imageFront.attr('src', pokemon.imageUrl);
      imageBack.attr('src', pokemon.imageUrlBack);

      modalTitle.append(imageFront);
      modalTitle.append(pokemon.name);
      modalTitle.append(imageBack);
      modalBody.append(heightElement);
      modalBody.append(weightElement);
      modalBody.append(typesElement);
      modalBody.append(abilitiesElement);
    });
  }

  //Function to retrieve info from API then load into pokemonList array
  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //Function breaks down details in the pokemonList to display specific things
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function (response) {
        item.imageUrl = response.sprites.front_default;
        item.imageUrlBack = response.sprites.back_default;
        item.height = response.height;
        //Iterates through types array and pushes to item.types array
        item.types = [];
        for (var i = 0; i < response.types.length; i++) {
          item.types.push(response.types[i].type.name);
        }

        //Iterates through abilities array and pushes to item.abilities array
        item.abilities = [];
        for (var i = 0; i < response.abilities.length; i++) {
          item.abilities.push(response.abilities[i].ability.name);
        }

        item.weight = response.weight;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //Returns all functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

//Function that uses forEach loop to iterate over the pokemonRepository and display the pokemon list onto DOM then when a name is clicked it logs details to console
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
