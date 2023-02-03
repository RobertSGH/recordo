import { Fragment } from 'react';
import Header from './Header';
import classes from './Layout.module.css';
import AddPost from '../../feed/AddPost';
import { Login } from './Login';
import PostList from '../../feed/PostList';
import MessagingComponent from '../../favs/Favs';
import { BrowserRouter, Route } from 'react-router-dom';

const Layout = (props) => {
  return (
    <BrowserRouter>
      <Fragment>
        <Header />
        <Login />
        <div className={classes.layout}>
          <div className={classes.left}>{<MessagingComponent />}</div>
          <div className={classes.main}>
            <AddPost />
            <PostList />
          </div>
        </div>
      </Fragment>
    </BrowserRouter>
  );
};

export default Layout;
