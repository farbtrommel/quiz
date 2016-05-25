import {App, Platform, Config, NavController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ViewChild} from '@angular/core';
import {StorageService} from './quiz/storage-service';
import {TabsPage} from './pages/tabs/tabs';

@App({
  template: '<ion-nav id="mainTabs" [root]="rootPage"></ion-nav>',
  providers: [StorageService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage = TabsPage;
  static title: string = "StadtNatur Quiz";
  storageService: StorageService;
  @ViewChild('rootNavController', 'read') nav:NavController;

  constructor(storageService :StorageService, platform: Platform) {
    this.storageService = storageService;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      document.addEventListener('backbutton', () => {this.backButton()}, false);
    });
  }

  backButton() {
    /*
      let activeNav = this.nav;

      const activeView = activeNav.getActive();
      if (activeView) {
        if (!activeView.isRoot()) {
          return activeView.dismiss();
        }
        const page = activeView.instance;
        if (page instanceof TabsPage && page.tabs) {
          activeNav = page.tabs.getSelected();
        }
      }

      if (activeNav.canGoBack()) {
        // Detected a back button press outside of tabs page - popping a view from a navigation stack.
        return activeNav.pop();
      }
      // Exiting app due to back button press at the root view
      return navigator.app.exitApp();
    */
  }
}
