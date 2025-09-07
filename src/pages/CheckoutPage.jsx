import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList || [])
  const [selectAddress, setSelectAddress] = useState(null) // must explicitly select
  const cartItemsList = useSelector(state => state.cartItem.cart || [])
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // helper - safe read of selected address id
  const getSelectedAddressId = () => {
    if (selectAddress === null) return null
    const addr = addressList[selectAddress]
    return addr ? addr.address_id : null
  }

  const handleCashOnDelivery = async () => {
    if (selectAddress === null) {
      toast.error("Please select a delivery address")
      return
    }
    if (!cartItemsList || cartItemsList.length === 0) {
      toast.error("Cart is empty")
      return
    }
    const address_id = getSelectedAddressId()
    if (!address_id) {
      toast.error("Invalid selected address")
      return
    }

    const payload = {
      list_items: cartItemsList,
      user_id: user?.user_id,
      address_id,
      subTotalAmt: totalPrice,
      totalAmt: totalPrice,
    }
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: payload,
      })
      const responseData = response?.data
     if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }else {
            toast.error(responseData?.message || "Failed to place order")
          }

    } catch (err) {
      console.error("COD error:", err)
      const message = err?.response?.data?.message || err.message || "Something went wrong"
      toast.error(message)
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOnlinePayment = async () => {
    if (selectAddress === null) {
      toast.error("Please select a delivery address")
      return
    }
    if (!cartItemsList || cartItemsList.length === 0) {
      toast.error("Cart is empty")
      return
    }
    const addressId = getSelectedAddressId()
    if (!addressId) {
      toast.error("Invalid selected address")
      return
    }

    setLoading(true)
    try {
      toast.loading("Redirecting to payment...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })
      console.log("Payment response:", response)
      const responseData = response?.data
      if (!responseData) throw new Error("No response from payment API")

      // Expecting sessionId or orderId in responseData
      const sessionId = responseData.orderId || responseData.sessionId || responseData.session_id
      if (!sessionId) {
        console.warn("Payment API returned no session id:", responseData)
        toast.error(responseData.message || "Payment setup failed")
        return
      }

      await stripePromise.redirectToCheckout({ sessionId })
      // If stripe redirect fails, still try to refresh cart/order
      await fetchCartItem?.()
      await fetchOrder?.()
    } catch (err) {
      console.error("Payment error:", err)
      const message = err?.response?.data?.message || err.message || "Payment failed"
      toast.error(message)
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/* address */}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {addressList.length === 0 && (
              <div className='p-4 text-sm text-neutral-500'>No addresses found. Please add an address.</div>
            )}
            {addressList.map((address, index) => (
              <label key={address.address_id || index} htmlFor={"address" + index} className={!address.status ? "hidden" : ""}>
                <div
                  className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${selectAddress === index ? "border-green-600" : ""}`}
                >
                  <div>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      checked={selectAddress === index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name='address'
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/* summary */}
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quantity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          <div className='w-full flex flex-col gap-4'>
            <button
              className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold disabled:opacity-50'
              onClick={handleOnlinePayment}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Online Payment'}
            </button>
            <button
              className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50'
              onClick={handleCashOnDelivery}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Cash on Delivery'}
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  )
}

export default CheckoutPage 