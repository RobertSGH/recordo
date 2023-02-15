import { Fragment } from 'react';
import classes from './Layout.module.css';
import AddPost from '../../feed/AddPost';
import { Login } from './Login';
import PostList from '../../feed/PostList';
import MessagingComponent from '../../favs/Favs';
import { Link } from 'react-router-dom';

const Layout = (props) => {
  return (
    <Fragment>
      <Login />
      <div className={classes.layout}>
        <div className={classes.left}>
          <MessagingComponent />
          <Link to='/conversations'>
            <p>Conversations</p>
          </Link>
        </div>
        <div className={classes.main}>
          <AddPost />
          <PostList />
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
