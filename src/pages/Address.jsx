import  { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (address_id) => {
    console.log("address_list",addressList)
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          address_id: address_id
        }
      })
      if (response.data.success) {
        toast.success("Address Remove")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className=''>
      <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
        <button onClick={() => setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'>
          Add Address
        </button>
      </div>
      <div className='bg-blue-50 p-2 grid gap-4'>
  {addressList.map((address) => (
    <div
      key={address.address_id}
      className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-all ${!address.status && 'hidden'}`}
    >
      {/* Top Row with Name / Address Type */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {address.type || "Address"}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => { setOpenEdit(true); setEditData(address); }}
            className='p-1 hover:text-green-600'
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => handleDisableAddress(address.address_id)}
            className='p-1 hover:text-red-600'
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      {/* Labeled Content */}
      <div className="text-sm text-gray-700 leading-6">
        <p><span className="font-semibold">Address:</span> {address.address_line}</p>
        <p><span className="font-semibold">City:</span> {address.city}</p>
        <p><span className="font-semibold">State:</span> {address.state}</p>
        <p><span className="font-semibold">Country:</span> {address.country}</p>
        <p><span className="font-semibold">Pincode:</span> {address.pincode}</p>
      </div>

      {/* Footer */}
      <p className='text-sm text-gray-500 mt-2'>
        <span className="font-semibold text-gray-600">Mobile:</span> 📞 {address.mobile}
      </p>
    </div>
  ))}

  {/* Add Address */}
  <div
    onClick={() => setOpenAddress(true)}
    className='h-16 bg-white border-2 border-dashed flex justify-center items-center cursor-pointer rounded hover:bg-gray-100 transition'
  >
    ➕ Add Address
  </div>
</div>



      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        OpenEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
