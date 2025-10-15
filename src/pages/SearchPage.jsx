import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import CardProduct from "../components/CardProduct";
import { useLocation } from "react-router-dom";
import noDataImage from "../assets/nothing here yet.webp";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get("q") || ""; // assuming ?q=searchTerm

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCategories });
      if (response.data.success) setCategories(response.data.data);

      const subResponse = await Axios({ ...SummaryApi.getSubCategories });
      if (subResponse.data.success) setSubCategories(subResponse.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Map numeric IDs to names
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.categoryId === id);
    return cat ? cat.name : "Unknown";
  };

  const getSubCategoryName = (id) => {
    const sub = subCategories.find((s) => s.subCategoryId === id);
    return sub ? sub.name : "Unknown";
  };

  // Fetch products
  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: { search: searchText, page: pageNum },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data); // replace data for each page
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset data when search changes
 

  // Fetch data when page changes
  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Render pagination buttons
  const renderPagination = () => {
    let buttons = [];
    for (let i = 1; i <= totalPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded mx-1 ${
            page === i ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
          {data.map((p, index) => (
            <CardProduct
              data={p}
              key={p.productId + "searchProduct" + index} // use numeric productId
              categoryName={getCategoryName(p.categoryId)}
              subCategoryName={getSubCategoryName(p.subCategoryId)}
            />
          ))}

          {loading &&
            loadingArrayCard.map((_, index) => (
              <CardLoading key={"loadingsearchpage" + index} />
            ))}
        </div>

        {!data.length && !loading && (
          <div className="flex flex-col justify-center items-center w-full mx-auto">
            <img
              src={noDataImage}
              className="w-full h-full max-w-xs max-h-xs block"
            />
            <p className="font-semibold my-2">No Data found</p>
          </div>
        )}

        {/* Pagination buttons */}
        {totalPage > 1 && (
          <div className="flex justify-center my-4">{renderPagination()}</div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;