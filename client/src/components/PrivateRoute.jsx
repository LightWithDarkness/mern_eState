import { useSelector } from "react-redux";
import { Outlet, NavLink, Navigate} from "react-router-dom";

const PrivateRoute = () => {
    const {currentUser} = useSelector((state)=> state.user)
  return (currentUser && currentUser.username)? <Outlet/>:<Navigate to='/sign-in' />;
};
export default PrivateRoute;
