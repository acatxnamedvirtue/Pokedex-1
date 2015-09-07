Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');
    this.pokemon = new Pokedex.Collections.Pokemon();
    this.$pokeList.on('click', 'li.poke-list-item', this.selectPokemonFromList.bind(this));
    this.$newPoke.on('submit', this.submitPokemonForm.bind(this));
    this.$pokeDetail.on('click', 'li.toy-list-item', this.selectToyFromList.bind(this));
    this.$toyDetail.find('select').on('change', this.reassignToy.bind(this));
  },

  submitPokemonForm: function (e) {
    e.preventDefault();
    var newPokemon = $(e.currentTarget).serializeJSON();
    this.createPokemon(newPokemon, this.renderPokemonDetail.bind(this));
  },

  createPokemon: function (attributes, callback) {
    var pokemon = new Pokedex.Models.Pokemon();
    pokemon.save(attributes.pokemon, {success: function(pokemon) {
      this.pokemon.add(pokemon);
      this.addPokemonToList(pokemon);
      callback(pokemon);
    }.bind(this)});
  },

  selectPokemonFromList: function (e) {
    e.preventDefault();
    var pokemon = this.pokemon.get($(e.currentTarget).data('id'));
    // debugger
    this.renderPokemonDetail(pokemon);
  },

  selectToyFromList: function (e) {
    e.preventDefault();
    var pokemon = this.pokemon.get($(e.currentTarget).data('pokemon-id'));
    // debugger
    var toy = pokemon.toys().get($(e.currentTarget).data('toy-id'));
    this.renderToyDetail(toy);
  },

  addPokemonToList: function (pokemon) {
    // var html = "<li class='poke-list-item'>Name: " + pokemon.get('name') + " Type: " + pokemon.get('poke_type') + "</li>";

    var $li = $("<li class='poke-list-item'></li>")
    $li.data('id', pokemon.id);
    $li.append("Name: " + pokemon.escape('name') + " ")
    $li.append("Type: " + pokemon.escape('poke_type'))

    this.$pokeList.append($li);
  },

  refreshPokemon: function () {
    this.pokemon.fetch({
      success: function () {
        this.pokemon.forEach(function(pokemon) {
          this.addPokemonToList(pokemon)
        }.bind(this))
      }.bind(this)
    })
  },

  addToyToList: function (toy) {
    var $li = $("<li class='toy-list-item'></li>");
    $li.append("Name: " + toy.escape('name') + " ");
    $li.append("Happiness: " + toy.escape('happiness') + " ");
    $li.append("Price: " + toy.escape('price'));
    $li.data("toy-id", toy.id)
    $li.data("pokemon-id", toy.get("pokemon_id"))
    // debugger
    this.$pokeDetail.find('ul.toys').append($li);
  },

  renderToysList: function (toys) {
    this.$pokeDetail.find('.toys').empty()
    _.each(toys, function (val, key, list) {
      var toy = list.models[key]
      this.addToyToList(toy)
    }, this);
  },

  renderPokemonDetail: function (pokemon) {
    // var html = "<div class='detail'><img src='" + pokemon.get('image_url') + "'></div>";
    var $div = $("<div class='detail'></div>")
    $div.append("<img src='" + pokemon.escape('image_url') + "'>")

    _.each(pokemon.attributes, function (val, key) {
        $div.append(key + ": " + val + " ")
      }
    )
    $div.append("<ul class='toys'></ul>");

    pokemon.fetch({success: function () {
      this.renderToysList(pokemon.toys())
      // pokemon.toys().forEach(function(toy) {
      //    this.addToyToList(toy);
      // }.bind(this))
    }.bind(this)});

    this.$pokeDetail.html($div);
  },

  renderToyDetail: function(toy) {
    var $form = $("<form class='detail'></form>");
    $form.append("<img src='" + toy.escape('image_url') + "'>");

    _.each(toy.attributes, function (val, key) {
        $form.append("<label for=" + key + ">" + key + "</label>");
        $form.append("<input id=" + key + " type='text' name=toy[" + key + "] value=" + val + ">");
      }
    )
    $form.append("<button>Update Toy</button>")

    var $select = $("<select name='toy[pokemon_id]'></select>");
    $select.data('pokemon-id', toy.get('pokemon_id'));
    $select.data('toy-id', toy.id);

    _.each(this.pokemon, function (val, key, list) {
      var pokemon = list.models[key]
        $select.append("<option value='" + pokemon.id + "'>" + pokemon.get('name') + "</option>")
        //  <option value="value2" selected>Value 2</option>
      }, this )

    $select.val(toy.get('pokemon_id'))

    this.$toyDetail.html($form).append($select);
    this.$toyDetail.find('select').on('change', this.reassignToy.bind(this));
  },

  reassignToy: function (e){
    e.preventDefault()
    var $select = this.$toyDetail.find('select');
    var oldPokemon = this.pokemon.get($select.data('pokemon-id'));
    var toy = oldPokemon.toys().get($select.data('toy-id'));

    toy.set('pokemon_id', $select.val());
    toy.save({}, {success: function() {
      oldPokemon.toys().remove(toy);
      // this.renderPokemonDetail(oldPokemon);
      this.renderToysList(oldPokemon.toys())
      this.$toyDetail.empty();
    }.bind(this)})

    console.log($select.data('pokemon-id'));
    console.log($select.data('toy-id'));
    console.log($select.val());
  }

});
//
// _(pokemon.attributes).each(function(val, key) {
//
// })

//
// renderToysList: function (toys) {
//   this.$pokeDetail.find('.toys').empty()
//   _.each(toys, function (val, key, list) {
//     var toy = list.models[key]
//     this.addToyToList(toy)
//   }, this);
// },
//
// renderPokemonDetail: function (pokemon) {
//   // var html = "<div class='detail'><img src='" + pokemon.get('image_url') + "'></div>";
//   var $div = $("<div class='detail'></div>")
//   $div.append("<img src='" + pokemon.escape('image_url') + "'>")
//
//   _.each(pokemon.attributes, function (val, key) {
//       $div.append(key + ": " + val + " ")
//     }
//   )
//   $div.append("<ul class='toys'></ul>");
//
//   pokemon.fetch({success: function () {
//     this.renderToysList(pokemon.toys())
//     // pokemon.toys().forEach(function(toy) {
//     //    this.addToyToList(toy);
//     // }.bind(this))
//   }.bind(this)});
//
//   this.$pokeDetail.html($div);
// },
