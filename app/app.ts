import {App, Platform, Config} from 'ionic-framework/ionic';
import {TabsPage} from './pages/tabs/tabs';
import {StorageService} from './quiz/storage-service';

@App({
    template: '<ion-nav id="nav" [root]="root" #content></ion-nav>',
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

    constructor(storageService :StorageService, platform: Platform) {
        this.root = TabsPage;
        this.storageService = storageService;

        platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
        });
    }
}
