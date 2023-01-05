import { Fragment } from 'react';
import Header from './Header';
import classes from './Layout.module.css';
import AddPost from '../../feed/AddPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import PostList from '../../feed/PostList';
import ChatMessaging from '../../favs/Favs';

const Layout = (props) => {
  return (
    <Fragment>
      <Router>
        <Header />
        <Login />
        <div className={classes.layout}>
          <div className={classes.left}>{/* <ChatMessaging /> */}</div>
          <div className={classes.main}>
            <AddPost />
            <PostList />
          </div>
        </div>
      </Router>
    </Fragment>
  );
};

export default Layout;
