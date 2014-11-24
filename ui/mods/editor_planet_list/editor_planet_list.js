(function() {
  handlers['panel.invoke'] = function(params) {
    var fn = params[0];
    var args = params.slice(1);
    return model[fn] && model[fn].apply(model, args);
  };

  handlers['planets.click'] = function(index) {
    console.log('click', index)
    model.changeSelectedPlanet(index)
  }

  model.planetListState = ko.computed(function() {
    var planets = ko.toJS(model.system().planets)
    planets.forEach(function(planet, index) {
      planet.index = index
      planet.isSun = false
      planet.dead = false
      planet.isSelected = model.selectedPlanetIndex() == index,
      planet.imageSmall = 'coui://ui/main/shared/img/planets/small/' + planet.planet.biome + '.png'
      planet.delta_v_current_array = []
      planet.thrust_control = false
      planet.weapon_control = false
    })
    return {
      system: model.systemName(),
      landing: false,
      planets: planets,
      selected: model.selectedPlanetIndex(),
      targeting: false,
      control: false,
    };
  });
  model.planetListState.subscribe(function() {
    api.panels.planets && api.panels.planets.message('state', model.planetListState());
  });

  $('body').append('<panel id="planets" src="coui://ui/main/game/live_game/live_game_planets.html" no-keyboard yield-focus fit="dock-top-right" data-bind="visible:!enableControls()"></panel>')
  api.Panel.bindPanels()
})()
