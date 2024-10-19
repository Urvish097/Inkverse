import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Pages/Home/Home';
import Login from './components/Pages/Login/Login';
import SignUp from './components/Pages/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Profile from './components/Pages/Profile_Page/Profile';
import Blog from './components/Pages/Blog/Blog';
import { AdminPrivateRoute, PrivateRoute, PrivateRouteOtp } from './components/private/PrivateRoute';
import CreateBlog from './components/Pages/CreateBlog/CreateBlog';
import Email from './components/Pages/ForgetPassword/Email/Email';
import Otp from './components/Pages/ForgetPassword/Otp/Otp';
import NewPassword from './components/Pages/ForgetPassword/NewPassword/NewPassword';
import PageNotFound from './components/Pages/PageNotFound/PageNotFound';
import UserProfile from './components/Pages/UserProfile/UserProfile';
import UpdateProfile from './components/Pages/UpdateProfile/UpdateProfile';
import Admin from './components/Pages/Admin/Admin';
import AdminPost from './components/Pages/Admin/AdminPost';
import AdminUser from './components/Pages/Admin/AdminUser';
import AdminView from './components/Pages/Admin/AdminView';
import AdminLogin from './components/Pages/Admin/AdminLogin';
import Advertisement from './components/Pages/Advertisement/Advertisement';
import AdminAdvertisement from './components/Pages/Admin/AdminAdvertisement';

function App() {

  // useEffect(() => {
  //   const disableRightClick = (e) => {
  //     e.preventDefault();
  //   };

  //   const disableDevTools = (e) => {
  //     if (e.keyCode === 123) {
  //       e.preventDefault();
  //     }
  //     if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener('contextmenu', disableRightClick);
  //   document.addEventListener('keydown', disableDevTools);

  //   return () => {
  //     document.removeEventListener('contextmenu', disableRightClick);
  //     document.removeEventListener('keydown', disableDevTools);
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ContentWithFooter />
    </BrowserRouter>
  );
}

function ContentWithFooter() {
  const { pathname } = useLocation();

  const Routs = pathname.slice(0, 8);
  console.log(Routs, ">>>>>routs");

  let shouldShowFooter = false;

  switch (Routs) {
    case "/":
      shouldShowFooter = true;
      break;
    case "/Profile":
      shouldShowFooter = true;
      break;
    default:
      shouldShowFooter = false;
      break;
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<PageNotFound />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<SignUp />} />
        <Route path='/Email' element={<Email />} />
        <Route path='/AdminAdvertisement' element={<AdminAdvertisement />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path='/AdminPanel' element={<Admin />} />
          <Route path='/Adminpost' element={<AdminPost />} />
          <Route path='/AdminUser' element={<AdminUser />} />
        </Route>
        <Route path='/AdminView/:blogId' element={<AdminView />} />
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route element={<PrivateRoute />}>
          <Route path='/Profile/:blogId' element={<Profile />} />
          <Route path='/Blog' element={<Blog />} />
          <Route path='/CreateBlog' element={<CreateBlog />} />
          <Route path='/UserProfile' element={<UserProfile />} />
          <Route path='/UserProfileUpdate/:userId' element={<UpdateProfile />} />
          <Route path='/Advertisement' element={<Advertisement />} />
        </Route>
        <Route element={<PrivateRouteOtp />}>
          <Route path='/Otp/:userId' element={<Otp />} />
          <Route path='/Newpassword/:userId' element={<NewPassword />} />
        </Route>
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default App;
