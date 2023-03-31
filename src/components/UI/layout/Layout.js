import { Fragment } from 'react';
import classes from './Layout.module.css';
import AddPost from '../../feed/AddPost';
import PostList from '../../feed/PostList';
import MessagingComponent from '../../favs/Favs';
import Login from './Login';
import UserProfile from '../../favs/UserProfile';

const Footer = () => {
  return <div className={classes.footer}>&copy; 2023 by Robert</div>;
};

const Layout = (props) => {
  return (
    <Fragment>
      <div className={classes.layout}>
        <div className={classes.leftSide}>
          <Login />
        </div>
        <div className={classes.center}>
          <div className={classes.addPost}>
            <AddPost />
          </div>
          <div className={classes.postList}>
            <PostList />
          </div>
        </div>
        <div className={classes.rightSide}>
          <MessagingComponent />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;
