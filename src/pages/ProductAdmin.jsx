import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'
import { useLocation } from 'react-router-dom'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const searchText = location.search.slice(3)
  const fetchProductData = async(pageNum = 1)=>{
    try {
        setLoading(true)
        const response = await Axios({
        ...SummaryApi.searchProduct,
        data: { search: search, page: pageNum },
      });

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

   useEffect(() => {
      setPage(1);
      fetchProductData(1);
    }, [searchText]);
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    console.log("vaukessssss", value)
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
    return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
                <h2 className='font-semibold'>Product</h2>
                <div className='h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200'>
                  <IoSearchOutline size={25}/>
                  <input
                    type='text'
                    placeholder='Search product here ...' 
                    className='h-full w-full outline-none bg-transparent'
                    value={search}
                    onChange={handleOnChange}
                  />
                </div>
        </div>
        {
          loading && (
            <Loading/>
          )
        }

        <div className='p-4 bg-blue-50'>
            <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                  productData.map((p) => (
                    <ProductCardAdmin key={p.productId} data={p} fetchProductData={fetchProductData} />
                  ))
                }
              </div>
            </div>
            
            <div className='flex justify-between my-4 items-center gap-2'>
              <button
                onClick={handlePrevious}
                className={`border border-primary-200 px-4 py-1 rounded ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-200'}`}
                disabled={page <= 1}
              >
                Previous
              </button>
              <div className='w-full text-center font-semibold text-sm'>
                Page {page} of {totalPageCount}
              </div>
              <button
                onClick={handleNext}
                className={`border border-primary-200 px-4 py-1 rounded ${page >= totalPageCount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-200'}`}
                disabled={page >= totalPageCount}
              >
                Next
              </button>
            </div>

        </div>
    </section>
  )
}

export default ProductAdmin
