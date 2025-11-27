import { Outlet } from "react-router-dom";
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer';
import Advertisements from '../Components/Advertisements/Advertisements';
export default function UserHome() {
  return (
    <div>
      <Header /> 
      <div className="">
        <Advertisements /> 
        <Outlet />
      </div>
       <Footer />
    </div>
  );
}