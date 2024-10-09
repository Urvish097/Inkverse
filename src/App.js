import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './components/Pages/Home/Home';
import Login from './components/Pages/Login/Login';
import SignUp from './components/Pages/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Profile from './components/Pages/Profile_Page/Profile';
import Blog from './components/Pages/Blog/Blog';
import { PrivateRoute, PrivateRouteOtp, PrivateRouteVerify } from './components/private/PrivateRoute';
import CreateBlog from './components/Pages/CreateBlog/CreateBlog';
import Email from './components/Pages/ForgetPassword/Email/Email';
import Otp from './components/Pages/ForgetPassword/Otp/Otp';
import NewPassword from './components/Pages/ForgetPassword/NewPassword/NewPassword';
import PageNotFound from './components/Pages/PageNotFound/PageNotFound';
import UserProfile from './components/Pages/UserProfile/UserProfile';
import UpdateProfile from './components/Pages/UpdateProfile/UpdateProfile';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ContentWithFooter />
    </BrowserRouter>
  );
}

function ContentWithFooter() {
  const { pathname } = useLocation();

  const Routs = pathname.slice(0, 8)
  console.log(Routs, ">>>>>routs");


  let shouldShowFooter = false

  switch (Routs) {
    case "/":
      shouldShowFooter = true
      break;
    case "/Profile":
      shouldShowFooter = true
      break;
    default:
      shouldShowFooter = false
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
        <Route element={<PrivateRoute />}>
          <Route path='/Profile/:blogId' element={<Profile />} />
          <Route path='/Blog' element={<Blog />} />
          <Route path='/CreateBlog' element={<CreateBlog />} />
          <Route path='/UserProfile' element={<UserProfile />} />
          <Route path='/UserProfileUpdate/:userId' element={<UpdateProfile />} />
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
