import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { historyApp } from '@utils';
import CustomRouter from '@utils/CustomRoutes';
import { AuthenticateRoute, NotAuthenticateRoute, LogoutRoute } from '@utils/Authenticate';
import { DashBoard, Login } from '@containers';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';

// const queryClient = new QueryClient()
class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
  }

  handleGoBack = () => {
    this.props.history.push('/');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div className="position-relative" style={{ width: '100vw', height: '100vh' }}>
          <div className="pos-ab-center" style={{ textAlign: 'center' }}>
            <ReportGmailerrorredOutlinedIcon sx={{ width: '50%', height: '50%', color: '#23aeff' }} />
            <p style={{ fontSize: '3.5rem' }}>Something went wrong</p>
            <button className="btn-goBack" onClick={this.handleGoBack}>
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function RouteWrapperLogin(props) {
  const ComponentWrapper = NotAuthenticateRoute(Login, '/');
  return <ComponentWrapper {...props} />;
}

function RouteWrapperRoot(props) {
  const ComponentWrapper = AuthenticateRoute(DashBoard, '/login');

  return <ComponentWrapper {...props} />;
}

function RouteWrapperLogout(props) {
  const ComponentWrapper = LogoutRoute();
  return <ComponentWrapper {...props} />;
}

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;

    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        {/* <QueryClientProvider client={queryClient}> */}
        <CustomRouter history={historyApp}>
          <ErrorBoundary history={historyApp}>
            <Switch>
              <Route exact path="/login" component={RouteWrapperLogin} />
              <Route exact path="/logout" component={RouteWrapperLogout} />

              <Route path="/" render={() => <RouteWrapperRoot />} />
            </Switch>
          </ErrorBoundary>
        </CustomRouter>
        {/* </QueryClientProvider> */}
      </Fragment>
    );
  }
}

export default App;
