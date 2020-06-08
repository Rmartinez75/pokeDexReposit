//List of pokemon with some of their attributes using an IIFE
var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
    var character = $('.character-list');
    var listItem = $('<li></li>');
    var button = $(
      '<button class="character-name">' + pokemon.name + '</button>'
    );
    listItem.append(button);
    character.append(listItem);
    button.on('click', function (event) {
      showDetails(pokemon);
    });
  }

  //Function to log the pokemon to console
  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      // console.log(pokemon);
      showModal(pokemon);
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

        item.types = [];
        //Iterates through types array and pushes to item.types array
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

  //Creates the Modal and all funcionality
  function showModal(pokemon) {
    var $modalContainer = $('#modal-container');
    $modalContainer.empty();

    //Creates div tag in DOM
    var modal = $('<div class="modal"></div>');

    //Creates the close button and gives it functionality
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    closeButtonElement.on('click', hideModal);

    //Creates h1 tag in DOM and inputs pokemon name as text
    var nameElement = $('<h1>' + pokemon.name + '</h1>');

    //Creates img tag in DOM and puts in pokemon img
    var imageElement = $('<img class="modal-img">');
    imageElement.attr('src', pokemon.imageUrl);

    var imageElementBack = $('<img class="modal-img-back">');
    imageElementBack.attr('src', pokemon.imageUrlBack);

    //Creates a paragraph tag in DOM for the height
    var heightElement = $('<p>' + 'Height: ' + pokemon.height + '</p>');

    //Creates a paragraph tag in DOM for the weight
    var weightElement = $('<p>' + 'Weight: ' + pokemon.weight + '</p>');

    //Creates a paragraph tag in DOM for the type
    var typesElement = $('<p>' + 'Types: ' + pokemon.types + '</p>');

    //Creates a paragraph tag in DOM for the abilities
    var abilitiesElement = $(
      '<p>' + 'Abilities: ' + pokemon.abilities + '</p>'
    );

    //Puts elemenst into div
    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(imageElement);
    modal.append(imageElementBack);
    modal.append(heightElement);
    modal.append(weightElement);
    modal.append(typesElement);
    modal.append(abilitiesElement);
    $modalContainer.append(modal);
    //Adds class to show the modal
    $modalContainer.addClass('is-visible');
  }

  //Hides modal when click close button
  function hideModal() {
    var $modalContainer = $('#modal-container');
    $modalContainer.removeClass('is-visible');
  }

  //Hides modal when click ESC
  jQuery(window).on('keydown', function (e) {
    var $modalContainer = document.querySelector('#modal-container');
    if (
      e.key === 'Escape' &&
      $modalContainer.classList.contains('is-visible')
    ) {
      hideModal();
    }
  });

  //Hides modal if clicked outside of it
  var $modalContainer = document.querySelector('#modal-container');
  $modalContainer.addEventListener('click', (e) => {
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });

  //Returns all functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal,
  };
})();

//Function that uses forEach loop to iterate over the pokemonRepository and display the pokemon list onto DOM then when a name is clicked it logs details to console
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
