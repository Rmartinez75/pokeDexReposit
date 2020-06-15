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
      var row = $('.row');
      var card = $(
        '<div class="card" style="width: 24%; height: 70px;"></div>'
      );
      var cardImage = $(
        '<img class="card-img-top" style="width: 18%; height: 50%;" />'
      );
      var cardBody = $('<div class="card-body"></div>');
      var button = $(
        '<button type="button" class="btn " data-toggle="modal" data-target="#exampleModal">' +
          pokemon.name +
          '</button>'
      );
      cardImage.attr('src', pokemon.imageUrl);
      row.append(card);
      card.append(cardBody);
      cardBody.append(cardImage);
      cardBody.append(button);
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
  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url)
      .then(function (response) {
        pokemon.imageUrl = response.sprites.front_default;
        pokemon.imageUrlBack = response.sprites.back_default;
        pokemon.height = response.height;

        //Iterates through types array and pushes to pokemon.types array
        pokemon.types = [];
        for (var i = 0; i < response.types.length; i++) {
          pokemon.types.push(response.types[i].type.name);
        }
        if (pokemon.types.includes('grass')) {
          $('.modal').css('background', 'rgba(12, 78, 3, 0.4)');
        } else if (pokemon.types.includes('psychic')) {
          $('.modal').css('background', 'rgb(133, 2, 138, 0.5)');
        } else if (pokemon.types.includes('fire')) {
          $('.modal').css('background', 'rgb(179, 2, 14, 0.5)');
        } else if (pokemon.types.includes('bug')) {
          $('.modal').css('background', 'rgb(70, 57, 2, 0.5)');
        } else if (pokemon.types.includes('water')) {
          $('.modal').css('background', 'rgb(5, 5, 236, 0.5)');
        } else if (pokemon.types.includes('rock')) {
          $('.modal').css('background', 'rgb(60, 60, 66, 0.5)');
        } else if (pokemon.types.includes('flying')) {
          $('.modal').css('background', 'rgb(18, 188, 250, 0.5)');
        } else if (pokemon.types.includes('ground')) {
          $('.modal').css('background', 'rgb(83, 22, 22, 0.5)');
        } else if (pokemon.types.includes('electric')) {
          $('.modal').css('background', 'rgb(197, 207, 80, 0.5)');
        } else if (pokemon.types.includes('ice')) {
          $('.modal').css('background', 'none');
        } else if (pokemon.types.includes('ghost')) {
          $('.modal').css('background', 'rgb(205, 205, 212, 0.5)');
        } else if (pokemon.types.includes('fairy')) {
          $('.modal').css('background', 'rgb(223, 1, 160, 0.5)');
        } else if (pokemon.types.includes('steel')) {
          $('.modal').css('background', 'rgb(80, 100, 102, 0.5)');
        } else {
          $('.modal').css('background', 'none');
        }

        //Iterates through abilities array and pushes to pokemon.abilities array
        pokemon.abilities = [];
        for (var i = 0; i < response.abilities.length; i++) {
          pokemon.abilities.push(response.abilities[i].ability.name);
        }

        pokemon.weight = response.weight;
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
