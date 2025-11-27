import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserHome from './Pages/UserHome/UserHome'
import Home from "./Pages/Home/Home";
import Products from "./Pages/Products/Products";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Videos from "./Pages/Videos/Videos";
import Contact from "./Pages/Contact/Contact";
import Dashboard from "./Dashboard/Dashboard";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import PriceFilter from './Pages/PriceFilter/PriceFilter';
import CategoryPage from './Pages/CategoryPag/CategoryPage';
import AllNew from "./Pages/AllNew/AllNew";
import AllFriday from "./Pages/AllFriday/AllFriday";
import Wishlist from "./Pages/wishlist/wishlist";

function App() {
  return (
    <Router>
      <Routes>
        {/* كل صفحات المستخدم تحت UserHome */}
        <Route path="/" element={<UserHome />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="videos" element={<Videos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/price/:value" element={<PriceFilter />} />
         <Route path="/category/:id" element={<CategoryPage />} />
         <Route path="/AllNew" element={<AllNew />} /> 
         <Route path="/AllFriday" element={<AllFriday />} /> 
         <Route path="/Wishlist" element={<Wishlist />} /> 

        </Route>

        {/* Dashboard مستقل بدون هيدر المستخدم */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
