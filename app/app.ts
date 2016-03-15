import {App, Platform, Config, NavController} from 'ionic-framework/ionic';
import {ViewChild} from 'angular2/core';
import {TabsPage} from './pages/tabs/tabs';
import {StorageService} from './quiz/storage-service';
import {enableProdMode} from 'angular2/core';
enableProdMode();

@App({
    template: '<ion-nav #rootNavController id="nav" [root]="root" #content></ion-nav>',
    // Check out the config API docs for more info
    // http://ionicframework.com/docs/v2/api/config/Config/
    //directives: [],
    providers: [StorageService],
    config: {}
})
export class MyApp {
    /**
     * Default Title for all sites.
     * @type {string}
     */
    static title: string = "StadtNatur Quiz";
    root: any;
    storageService: StorageService;

    @ViewChild('rootNavController') nav:NavController;

    constructor(storageService :StorageService, platform: Platform) {
        this.root = TabsPage;
        this.storageService = storageService;

        platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
            document.addEventListener('backbutton', () => {
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
            }, false);
        });
    }
}
