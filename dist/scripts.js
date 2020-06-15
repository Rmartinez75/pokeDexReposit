var pokemonRepository = (function () {
  var e = [],
    t = 'https://pokeapi.co/api/v2/pokemon/?limit=148';
  function o(t) {
    'object' == typeof t ? e.push(t) : console.log('This is not a Pokemon!');
  }
  return {
    add: o,
    getAll: function () {
      return e;
    },
    addListItem: function (e) {
      pokemonRepository.loadDetails(e).then(function () {
        var t = $('.row'),
          o = $('<div class="card" style="width: 24%; height: 70px;"></div>'),
          s = $(
            '<img class="card-img-top" style="width: 18%; height: 50%;" />'
          ),
          a = $('<div class="card-body"></div>'),
          n = $(
            '<button type="button" class="btn " data-toggle="modal" data-target="#exampleModal">' +
              e.name +
              '</button>'
          );
        s.attr('src', e.imageUrl),
          t.append(o),
          o.append(a),
          a.append(s),
          a.append(n),
          n.on('click', function (t) {
            !(function (e) {
              pokemonRepository.loadDetails(e).then(function () {
                console.log(e),
                  (function (e) {
                    pokemonRepository.loadDetails(e).then(function () {
                      var t = $('.modal-title'),
                        o = $('.modal-body'),
                        s = $('<img class="modal-img" style="width:25%">'),
                        a = $('<img class="modal-img" style="width:25%">');
                      t.empty(), o.empty();
                      var n = $('<p>Height : ' + e.height + '</p>'),
                        i = $('<p>Weight : ' + e.weight + '</p>'),
                        c = $('<p>Types : ' + e.types + '</p>'),
                        l = $('<p>Abilities : ' + e.abilities + '</p>');
                      s.attr('src', e.imageUrl),
                        a.attr('src', e.imageUrlBack),
                        t.append(s),
                        t.append(e.name),
                        t.append(a),
                        o.append(n),
                        o.append(i),
                        o.append(c),
                        o.append(l);
                    });
                  })(e);
              });
            })(e);
          });
      });
    },
    loadList: function () {
      return $.ajax(t)
        .then(function (e) {
          e.results.forEach(function (e) {
            var t = { name: e.name, detailsUrl: e.url };
            o(t), console.log(t);
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    loadDetails: function (e) {
      var t = e.detailsUrl;
      return $.ajax(t)
        .then(function (t) {
          (e.imageUrl = t.sprites.front_default),
            (e.imageUrlBack = t.sprites.back_default),
            (e.height = t.height),
            (e.types = []);
          for (var o = 0; o < t.types.length; o++)
            e.types.push(t.types[o].type.name);
          for (
            e.types.includes('grass')
              ? $('.modal').css('background', 'rgba(12, 78, 3, 0.4)')
              : e.types.includes('psychic')
              ? $('.modal').css('background', 'rgb(133, 2, 138, 0.5)')
              : e.types.includes('fire')
              ? $('.modal').css('background', 'rgb(179, 2, 14, 0.5)')
              : e.types.includes('bug')
              ? $('.modal').css('background', 'rgb(70, 57, 2, 0.5)')
              : e.types.includes('water')
              ? $('.modal').css('background', 'rgb(5, 5, 236, 0.5)')
              : e.types.includes('rock')
              ? $('.modal').css('background', 'rgb(60, 60, 66, 0.5)')
              : e.types.includes('flying')
              ? $('.modal').css('background', 'rgb(18, 188, 250, 0.5)')
              : e.types.includes('ground')
              ? $('.modal').css('background', 'rgb(83, 22, 22, 0.5)')
              : e.types.includes('electric')
              ? $('.modal').css('background', 'rgb(197, 207, 80, 0.5)')
              : e.types.includes('ice')
              ? $('.modal').css('background', 'none')
              : e.types.includes('ghost')
              ? $('.modal').css('background', 'rgb(205, 205, 212, 0.5)')
              : e.types.includes('fairy')
              ? $('.modal').css('background', 'rgb(223, 1, 160, 0.5)')
              : e.types.includes('steel')
              ? $('.modal').css('background', 'rgb(80, 100, 102, 0.5)')
              : $('.modal').css('background', 'none'),
              e.abilities = [],
              o = 0;
            o < t.abilities.length;
            o++
          )
            e.abilities.push(t.abilities[o].ability.name);
          e.weight = t.weight;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
  };
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (e) {
    pokemonRepository.addListItem(e);
  });
});
