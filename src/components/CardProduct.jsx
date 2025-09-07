// import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {

  const url = `/product/${data.productId}`

  return (
    <div className ="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white">
    <Link to={url}>
      {/* Product Image */}
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img 
          src={data?.image?.[0] || "/placeholder.png"} 
          alt={data.name}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>

      {/* Delivery Time + Discount */}
      <div className="flex items-center gap-1">
        <div className="rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50">
          10 min
        </div>
        {Boolean(data.discount) && (
          <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
            {data.discount}% discount
          </p>
        )}
      </div>

      {/* Product Name */}
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>

      {/* Unit */}
      <div className="w-fit gap-1 flex px-2 lg:px-0 text-sm lg:text-base">
       <div className="text-black-900 text-sm ">
            M.R.P <span className="line-through text-green-600">{DisplayPriceInRupees(pricewithDiscount(data.price))}</span>
          </div>
      </div>
      </Link>
      
      {/* Price + Add to Cart */}
      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex flex-col items-end gap-2">
          <div className="font-semibold">
            {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}
          </div>
        </div>
        <div>
          {data.stock === 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
      
    </div>
  )
}

export default CardProduct
