import  { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
// import { useSelector } from 'react-redux'

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        categoryId : ""
    })
    // const allCategory = useSelector(state => state.product.allCategory)


    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory])
    
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className=''>
        <div className="p-6 bg-gray-50 rounded-xl shadow">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Categories</h2>
    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Category</button>
  </div>
  <input type="text" placeholder="Search categories..." className="w-full mb-4 p-2 border rounded"/>
  <table className="w-full text-left table-auto">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2">Thumbnail</th>
        <th className="p-2">Name</th>
        <th className="p-2">Status</th>
        <th className="p-2">Products</th>
        <th className="p-2">Created</th>
        <th className="p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {categoryData.map(category => (
        <tr key={category.id} className="hover:bg-gray-50">
          <td className="p-2">
            <img src={category.image} alt="" className="w-12 h-12 rounded"/>
          </td>
          <td className="p-2 font-semibold">{category.name}</td>
          <td className="p-2">
            <span className={`px-2 py-1 rounded-full text-white ${category.active ? 'bg-green-500' : 'bg-gray-400'}`}>
              {category.active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="p-2">{category.productCount}</td>
          <td className="p-2">{category.createdDate}</td>
          <td className="p-2 flex gap-2">
            <button className="text-blue-500 hover:underline">Edit</button>
            <button className="text-red-500 hover:underline">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }

        <div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
            {
                categoryData.map((category,index)=>{
                    return(
                        <div className='w-32 h-56 rounded shadow-md' key={category.categoryId}>
                            <img 
                                alt={category.name}
                                src={category.image}
                                className='w-full object-scale-down'
                            />
                            <div className='items-center h-9 flex gap-2'>
                                <button onClick={()=>{
                                    setOpenEdit(true)
                                    setEditData(category)
                                }} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'>
                                    Edit
                                </button>
                                <button onClick={()=>{
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>

        {
            loading && (
                <Loading/>
            )
        }

        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }

        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }

        {
           openConfimBoxDelete && (
            <CofirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
           ) 
        }
    </section>
  )
}

export default CategoryPage
