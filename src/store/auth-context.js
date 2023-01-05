// import React, { useEffect, useState } from 'react';
// import { getAuth } from 'firebase/auth';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { onAuthStateChanged } from 'firebase/auth';

// const AuthContext = React.createContext({
//   isAuth: false,
//   login: () => {},
// });

// export const AuthContextProvider = (props) => {
//   const [isAuthen, setIsAuthen] = useState(false);
//   const auth = getAuth();
//   // const [user] = useAuthState(auth);

//   const user = auth.currentUser;

//   console.log(user);

//   const loginHandler = () => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthen(true);
//       } else {
//         setIsAuthen(false);
//       }
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ login: loginHandler, isAuth: isAuthen }}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };
// export default AuthContext;
