import React, { Component, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import './index.css';
import Page404 from "./Pages/Page404/Page404";
import Sendsay from "sendsay-api";
import { useDispatch } from 'react-redux';

const Auth = lazy(() => import('./Pages/Auth/Auth'));
const Work = lazy(() => import('./Pages/Work/Work'));

const ScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  return null;
};

const routes = [
  { path: '/work', Component: Work },
]

const AppRouter = (props) => {
  const sendsay = new Sendsay();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'UPDATE_SENDSAYBRIDGE',
      payload: {
        sendsay: sendsay,
      },
    });
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<div />}> {/*Заглушка пока грузится бандл и стили*/}
        <Route component={ScrollToTop} />
        <Switch>
          <Route exact path={'/'}>
            <Auth />
          </Route>

          {routes.map(({ path }) => {
            return <Route path={path + '/:NotFound'} key={Math.random()}>
              <Redirect to="/404" />
            </Route>
          })}
          {routes.map(({ path, Component }) => (
            <Route key={path} exact path={path}>
              {() => {
                return (
                  <Component />
                )
              }}
            </Route>
          ))}

          <Route component={Page404} />
        </Switch>
      </Suspense>
    </Router>
  )
};

AppRouter.propTypes = {};
AppRouter.defaultProps = {};
export default AppRouter;