import React, { useEffect, useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { AiOutlineShopping } from "react-icons/ai";
import { CgSearch } from "react-icons/cg";
import Trending from "./Trending";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import { getSearch } from "../../redux/shopping/actions";
import Product from "../../pages/Products/Product";
// import RecentSearch from "./RecentSearch";
import axios from "axios";

interface SearchProps {
  handlesearch: () => void;
}

const Search: React.FC<SearchProps> = ({ handlesearch }) => {
  const cart = useSelector((state: any) => state.shop.cart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.shop.search);

  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(false);

  const [cartitem, setCartitem] = useState(false);
  const [searchData, setSearchData] = useState([]);

  function handleCartitem() {
    setCartitem(!cartitem);
  }

  useEffect(() => {
    let items = 0;
    let price = 0;
    cart.forEach((item: any) => {
      items += item.qty;
      price += item.qty * item.price;
    });

    setTotalItems(items);
    setTotalPrice(price);
  }, [cart, totalPrice, totalItems, setTotalItems, setTotalPrice]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataURL = `https://thenelson.pythonanywhere.com/api/products/?search=${search}`;
        const response = await axios.get(dataURL);
        setSearchData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Sorry something went wrong");
      }
    };
    fetchData();
  }, [search]);

  return (
    <div className="search">
      {loading && (
        <div className="loader--container">
          <div className="loader"></div>
        </div>
      )}
      <div className="search-header">
        <MdArrowBackIosNew onClick={handlesearch} />
        <h6>Search</h6>
        <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
          <AiOutlineShopping className="cart-icon" />
        </Link>
        <div className="cart-count">
          <p>{totalItems}</p>
        </div>
      </div>
      <div className="search-body">
        <div className="search-body-input">
          <div className="text">
            <input
              type="text"
              name=""
              id=""
              value={search}
              onChange={(e) => dispatch(getSearch(e.target.value))}
              placeholder="Looking for something?"
            />
          </div>
          {search.length > 0 ? (
            <FaTimes
              className="cancel"
              onClick={() => dispatch(getSearch(""))}
            />
          ) : (
            <CgSearch className="search-icon" />
          )}
        </div>
        {/* <RecentSearch /> */}

        <>
          {search.length > 0 ? (
            <>
              <Trending />

              <div style={{ marginTop: "20px" }} className="products">
                {searchData.map((item: any) => (
                  <Product
                    item={item}
                    id={item.id}
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image1}
                    handleCartitem={handleCartitem}
                    show={show}
                  />
                ))}
              </div>
            </>
          ) : (
            <Trending />
          )}
        </>
      </div>
    </div>
  );
};

export default Search;
