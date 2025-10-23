import { useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../assets/Wide_Assortment.png"

const ShippingLabelModal = ({ isOpen, onClose, label, product_details }) => {
  const printRef = useRef();
  const barcodeRef = useRef();
  const labels = label.data
  const order_details= label.order_details
  // console.log("eroj89898uuu",product_details)
  useEffect(() => {
    if (labels && barcodeRef.current) {
      JsBarcode(barcodeRef.current, label.trackingNumber || "N/A", {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
        width: 2,
        height: 50,
      });
    }
  }, [labels]);
  // Totals
  const totals = product_details.reduce(
    (acc, item) => {
      // console.log("itemmssss",item)
      const price = item.product?.price || item.product_details?.priceAtPurchase || 0;
      const discount = item.product?.discount || 0;
      const quantity = item.quantity || 1;
      acc.totalWithoutDiscount += price * quantity;
      acc.totalDiscount += (price * discount) / 100 * quantity;
      return acc;
    },
    { totalWithoutDiscount: 0, totalDiscount: 0 }
  );
  const finalTotal = totals.totalWithoutDiscount - totals.totalDiscount;

  // Shipping cost
  const shippingCost = labels
    ? 5 + labels.weight * 1.5 +
      (labels.dimensions?.length *
        labels.dimensions?.width *
        labels.dimensions?.height) / 5000
    : 0;

  const grandTotal = (finalTotal + shippingCost).toFixed(2);
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=1000,height=1200");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Shipping Label</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 3px; font-size: 13px; }
            th { background-color: #f0f0f0; text-align: left; }
            .header { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            .barcode, .qr { text-align: center; margin-top: 10px; }
            svg { width: 100%; }
          </style>
        </head>
        <body>
          <div>${printContent}</div>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  if (!isOpen || !labels) return null;
  // console.log("label data",labels)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 overflow-y-auto pt-10">
      <div className="bg-white shadow-lg relative rounded w-11/12 max-w-4xl p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
        >
          ✖
        </button>

        <div ref={printRef}>
          <h2 className="header text-center  font-bold">Shipping Label</h2>
        <table className="w-full border-collapse border border-black">
        <tbody>
            {/* Order Info Row */}
            <tr className="text-sm leading-tight">
            <th className="border border-black px-2 py-1.5 text-left bg-gray-200">Order ID</th>
            <td className="border border-black px-2 py-1.5">{labels.orderId}</td>

            <th className="border border-black px-2 py-1 text-left bg-gray-200">Shipping_Id</th>
            <td className="border border-black px-2 py-1">{labels.shippingId}</td>

            <th className="border border-black px-2 py-1 text-left bg-gray-200">Tracking#</th>
            <td className="border border-black px-2 py-1">{labels.trackingNumber}</td>

            <th className="border border-black px-2 py-1 text-left bg-gray-200">Shipping_Dt</th>
            <td className="border border-black px-2 py-1">
                {labels.shippingDate ? new Date(labels.shippingDate).toLocaleDateString() : "-"}
            </td>
            </tr>

            {/* Product Section */}
            <tr>
            <th colSpan={8} className="border border-black bg-gray-300 text-left px-2 py-1">
                Products
            </th>
            </tr>
            {/* {
            order_details.map((p, idx) => (
                <tr key={idx} className="text-xs leading-tight">
                <td className="border border-black px-2 py-2 font-medium" colSpan={3}>
                    {p?.name || "Unnamed Product"}
                </td>
                <td className="border border-black px-2 py-1">Qty: {p.quantity}</td>
                <td className="border border-black px-2 py-2">₹{p.priceAtPurchase}</td>
                <td className="border border-black px-2 py-1">₹{p.totalAmount}</td>
                <td className="border border-black px-2 py-1" colSpan={2}>
                    <img
                    src={p.product_details?.image[0]}
                    alt={p.product_details.name}
                    className="h-10 w-10 object-cover rounded"
                    />
                </td>
                </tr>
            ))} */}

            {/* Shipping Details + Barcode/Logo */}
            <tr>
            {/* Left Column */}
            <td colSpan={4} className="border border-black align-top p-0 w-1/2">
                <table className="w-full border-collapse">
                <tbody>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Service Type</th>
                    <td className="border border-black p-1">{labels.serviceType}</td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Carrier</th>
                    <td className="border border-black p-1">{labels.carrierService}</td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Package</th>
                    <td className="border border-black p-1">
                        {labels.packageName} ({labels.packageType})
                    </td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Weight</th>
                    <td className="border border-black p-1">{labels.weight} kg</td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Dimensions</th>
                    <td className="border border-black p-1">
                        {labels.dimensions?.length} x {labels.dimensions?.width} x {labels.dimensions?.height} cm
                    </td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Shipping Charges</th>
                    <td className="border border-black p-1">₹{shippingCost}</td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Total</th>
                    <td className="border border-black p-1">₹{grandTotal}</td>
                    </tr>
                    <tr>
                    <th className="border border-black p-1 text-left bg-gray-200">Delivery Date</th>
                    <td className="border border-black p-1">
                        {labels.shippingDate ? new Date(labels.shippingDate).toLocaleDateString() : "-"}
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>

            {/* Right Column */}
            <td colSpan={4} className="border border-black text-center align-middle w-1/2">
                <div className="flex flex-col items-center justify-center p-4 space-y-4">
                {/* Company Logo */}
                <img
                    src={logo} // replace with your logo
                    alt="Company Logo"
                    className="h-14"
                />
                {/* Barcode */}
                <svg ref={barcodeRef} className="w-full"></svg>
                </div>
            </td>
            </tr>

            {/* QR Code Section */}
            <tr>
            <th className="border border-black p-2 text-left bg-gray-200">QR Code</th>
            <td colSpan={7} className="border border-black text-center">
                <QRCodeCanvas value={label.trackingNumber || label.orderId} size={100} />
                <p className="mt-1 text-xs">Scan for Tracking</p>
            </td>
            </tr>
        </tbody>
        </table>


          {/* Print button */}
          <button
            onClick={handlePrint}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print / Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabelModal;
