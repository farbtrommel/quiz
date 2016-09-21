import { Component, ViewChild } from '@angular/core';
import { Platform, ionicBootstrap, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import {StorageService} from './quiz/storage-service';
import {TabsPage} from './pages/tabs/tabs';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [StorageService],
})
export class MyApp {

  public rootPage:any;

  @ViewChild('rootNavController', 'read') nav:NavController;

  static title:string = "StadtNatur Quiz";

  constructor(private platform:Platform, public storageService:StorageService) {
    this.storageService = storageService;
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      document.addEventListener('backbutton', () => {
        this.backButton()
      }, false);
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

ionicBootstrap(MyApp);
