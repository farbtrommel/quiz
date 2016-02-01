import {Page} from 'ionic-framework/ionic';
import {HomePage} from '../home/home';
import {SettingsPage} from '../settings/settings';
import {StatsPage} from '../stats/stats';
import {InformationPage} from '../information/information';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  private tab1Root;
  private tab2Root;
  private tab3Root;
  private tab4Root;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = StatsPage;
    this.tab3Root = InformationPage;
    this.tab4Root = SettingsPage;
  }
}
