/* global t2Proto */
/* global webkit */
import Ember from 'ember';

export default Ember.Route.extend({
  apiService: Ember.inject.service('api'),
  actions: {
    openModal(component, title, params) {
      var self = this;
      var globalModal;
      var globalModalContent;

      this.set('controller.globalModalComponentName', component);

      Ember.run.next(function() {
        globalModal = self.getViewByAlias('globalModal');
        globalModalContent = self.getViewByAlias('globalModalContent');

        if (typeof title !== 'string') {
          params = title;
          title = undefined;
        }
        if (!title && params && params.title) {
          title = params.title;
        }

        globalModal.set('title', title);
        globalModalContent.setProperties(params);

        globalModal.send('open');
      });

    },
    closeModal() {

      var self = this;

      Ember.run.later(function() {
        self.set('controller.globalModalComponentName', null);
      }, 500);
      this.getViewByAlias('globalModal').send('close');
    },
    closeModalHook() {
      var globalModalContent = this.getViewByAlias('globalModalContent');
      if (globalModalContent) {
          globalModalContent.toggleProperty('isModalOpen');
      }
    },
    willTransition: function() {
      this.controller.set('isLoading', true);
    },
    didTransition: function () {
      this.controller.set('isLoading', false);
    },
    refreshModel(){
      return this.refresh();
    },
    transitionTo(route, params) {
      if (params) {
        this.transitionTo(route, params);
      }
      this.transitionTo(route);
    },
    sendAppMessage(string) {
      try {
          webkit.messageHandlers.sendMessageToApp.postMessage(string);
      } catch(err) {

      }
      if (typeof(injectedDroid) !== "undefined") {
        if (string === "message") {
          injectedDroid.showMessage(string)
        }
      }

    }
  }

});
