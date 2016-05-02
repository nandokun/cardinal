"use strict";

module.exports = TemplateController;

TemplateController.$inject = [
  '$state', '$mdDialog', '$mdSidenav', 'DataService'
];

function TemplateController ($state, $mdDialog, $mdSidenav, DataService) {
  var _ = require('lodash');
  var vm = this;

  class element {
    constructor (index) {
      this.name = 'element';
      this.container = {
        position: 'relative',
        width: 0,
        height: 0,
        left: 10,
        top: 10
      };
      this.style = {
        position: 'absolute',
        'font-size': 12,
        width: 60,
        height: 20
      };
      this.units = {
        left: 'px',
        top: 'px',
        width: 'px',
        height: 'px',
        'font-size': 'px'
      };
      this.attributes = {};
      this.content = 'text';
      this.layer = 'float';
    }

    get styleElement() {
      return _.transform(this.style, (result, value, key) => {
        result[key] = value + (value && this.units[key] ? this.units[key] : '');
      }, {});
    }

    get styleContainer() {
      return _.transform(this.container, (result, value, key) => {
        result[key] = value + (value && this.units[key] ? this.units[key] : '');
      }, {});
    }

  };

  vm.cards = DataService('cards').search({ templateId: $state.params.templateId });
  vm.element = null;
  vm.menu = 'properties';
  vm.template = DataService('templates').get({ id: $state.params.templateId });
  // vm.template.elements = vm.template.elements || [];
  vm.zoom = getZoom() || 1;

  vm.addElement = addElement;
  vm.deleteTemplate = deleteTemplate;
  vm.saveZoom = saveZoom;
  vm.selectElement = selectElement;
  vm.saveTemplate = saveTemplate;

  vm.cards.$promise.then(cards => {
    vm.card = cards[0];
  });

  vm.template.$promise.then(template => {
    console.log(template);
  });

  function addElement () {
    var newElement = new element(vm.template.elements.length);
    vm.template.elements.push(newElement);
    selectElement(vm.template.elements.length - 1);
    focusElement('[ng-model="vm.element.name"]');
    vm.saveTemplate();
  }

  function deleteTemplate (template, event) {
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title(`Are you sure you want to delete '${vm.template.name}'?`)
      .content('You will not be able to undo this action')
      .ariaLabel('Delete Template')
      .ok('Delete')
      .cancel('Cancel')
      .targetEvent(event);

    $mdDialog.show(confirm).then(Ok, Cancel);

    function Ok () {
      console.log('Deleted');
      vm.template.$remove()
        .then(result => {
          console.log(result);
          $state.go('deck', {
            deckId: vm.template.deckId,
            msg: 'Deleted template "${vm.template.name}"'
          });
        });
    }

    function Cancel () {
      console.log('Cancelled');
    }
  }

  function focusElement (element) {
    var element = element;
    window.setTimeout(() => {
      element = document.querySelector(element);
      element.setSelectionRange(0, element.value.length)
    }, 100);
  }

  function getZoom () {
    return parseFloat(localStorage.getItem('zoom'));
  }

  function saveTemplate () {
    vm.template.$save();
  }

  function saveZoom (zoom) {
    localStorage.setItem('zoom', zoom);
  }

  function selectElement (index) {
    vm.element = vm.template.elements[index];

    if (!vm.card) {
      vm.card = vm.cards[0];
    }
  }

}
