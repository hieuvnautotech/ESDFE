import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar, TabListContent } from '@containers';

import SiderBar from './sidebar';
import Footer_DashBoard from './footer';
import { ToastContainer, toast } from 'react-toastify';
import ShortUniqueId from 'short-unique-id';
import { api_post, api_get, GetMenus_LoginUser, eventBus } from '@utils';
import { Treeview } from '@static/js/adminlte.js';
import * as SignalR from '@microsoft/signalr';
import * as ConfigConstants from '@constants/ConfigConstants';
import { withRouter } from 'react-router';
import { historyApp, historyDashboard, firstLogin } from '@utils';
import CustomRouter from '@utils/CustomRoutes';
import { withTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';
import store from '@states/store';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = { iRefreshMenu: null, showAlert: false, tab: 0, language: this.props.language };
    var res = GetMenus_LoginUser(window.i18n.t);

    this.html = res[1];
    this.showRouters = res[2];

    this.Fullname = res[3];
    this.Component_Default = res[4];
    this.user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));
    this.access_token = localStorage.getItem(ConfigConstants.TOKEN_ACCESS);
  }

  componentWillUnmount() {
    if (this.newConnection) {
      this.newConnection.stop().then(() => console.log('websocket is disconnected'));
      this.newConnection = null;
    }
    console.log('websocket is disconnected');
  }

  componentDidMount() {

    $('body').on('click', '.sub-lever1 a[router]:not([router=""]), .tab-menu-active', (event) => {
        $('.sub-lever1 a[router]:not([router=""])').filter((index, item) =>{
             if(($(item).attr('router')) === window.location.pathname){
              $(item).addClass('active');
             } else {
              $(item).removeClass('active');
             }
        })
    });

    const uid = new ShortUniqueId();
    let current_lang = localStorage.getItem(ConfigConstants.LANG_CODE);
    i18n.changeLanguage(current_lang.toLowerCase(), () => {
      var res = GetMenus_LoginUser(window.i18n.t);
      this.html = res[1];
      this.showRouters = res[2];

      this.Fullname = res[3];
      this.Component_Default = res[4];
      this.user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));
      this.access_token = localStorage.getItem(ConfigConstants.TOKEN_ACCESS);
      this.setState({ iRefreshMenu: uid() });

      this.setState({ changingLanguge: false });
      setTimeout(() => {
        var Treeview_slideMenu = new Treeview($('#main-slidebar-menu'), {
          accordion: false,
          animationSpeed: 300,
          expandSidebar: false,
          sidebarButtonSelector: '[data-widget="pushmenu"]',
          trigger: '[data-widget="treeview"] .nav-link',
          widget: 'treeview',
        });
        Treeview_slideMenu.init();
      }, 0);
    });
    $('body').on('click', '#jq-change-language', (event) => {
      let current_lang2 = localStorage.getItem(ConfigConstants.LANG_CODE);
      window.i18n.changeLanguage(current_lang2.toLowerCase(), () => {
        this.setState({ iRefreshMenu: uid() });

        $('.menu-name').each(function () {
          var old_text = $(this).attr('id');
          const temp = window.i18n.t(old_text);
          $(this).text(temp);
        });
      });
    });
   
  }

  onTabChange(value) {
    this.setState({ tab: value });
  }

  render() {
    const { iRefreshMenu } = this.state;
    return (
      iRefreshMenu !== null && (
        <>
          {/* <ThemeProvider theme={this.theme}> */}

          <div className="container-fluid">
            <CustomRouter history={historyDashboard}>
              <ToastContainer
                theme="colored"
                position="bottom-right"
                autoClose={5000}
                // hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                // draggable
                pauseOnHover
              />
              <NavBar />

              <SiderBar Menus={this.html} FullNameLogin={this.Fullname} />

              <Switch>
                {this.showRouters}
                {/* <Route path="menu">
                  <Menu />
                </Route> */}

                {
                  <Route
                    path="/"
                    render={(props) => {
                      var isFromLogin = firstLogin.isfirst;
                      firstLogin.isfirst = null;
                      return isFromLogin ? <this.Component_Default {...props} /> : null;
                    }}
                  />
                }
              </Switch>
              <TabListContent />

              {/* <Footer_DashBoard /> */}
            </CustomRouter>
          </div>
          {/* </ThemeProvider> */}
        </>
      )
    );
  }
}
export default withRouter(withTranslation()(DashBoard));
