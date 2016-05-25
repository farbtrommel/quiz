import {Page} from 'ionic-angular';
import {HomePage} from '../home/home';
import {SettingsPage} from '../settings/settings';
import {StatsPage} from '../stats/stats';
import {InformationPage} from '../information/information';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = StatsPage;
  tab3Root: any = InformationPage;
  tab4Root: any = SettingsPage;
}
