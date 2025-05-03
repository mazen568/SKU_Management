import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function BarcodeIntegration() {
  const [skuCode, setSkuCode] = useState('');
  const [barcodeType, setBarcodeType] = useState('qr');
  const [generatedBarcode, setGeneratedBarcode] = useState('');
  const [skuExists, setSkuExists] = useState(true);  // New state to track if SKU exists
  const [skus,setSKUs]=useState([])
  const storeSKUs=useSelector((state)=>state.sku.skus)

  useEffect(()=>{
    setSKUs(storeSKUs)
  },[storeSKUs])


  const generateBarcode = async (e) => {
    e.preventDefault();
    const encodedSkuCode = encodeURIComponent(skuCode); // Ensure special characters are encoded
    const barcodeTypeValue = barcodeType === "qr" ? "QRCode" : barcodeType;
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodedSkuCode}&code=${barcodeTypeValue}`;

    try {
      // Use fetchSKUs to get the SKU record


      const skuRecord = skus.find((sku) => sku.sku_code === skuCode);

      if (!skuRecord) {
        setSkuExists(false);  // If SKU does not exist, set the state to false
        return;  // Do not proceed if SKU doesn't exist
      }

      setSkuExists(true);  // If SKU exists, reset the state

      setGeneratedBarcode(barcodeUrl);

      // Update the record with the generated barcode
      await axios.patch(`http://localhost:3000/skus/${skuRecord.id}`, {
        barcode: barcodeUrl,
      });

      toast.success("Barcode added to the SKU in the database successfully!");
    } catch (error) {
      console.error("Error updating the SKU in the database:", error);
      toast.error("Error updating the SKU in the database");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Barcode/QR Code Integration</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={generateBarcode} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
            <input
              type="text"
              value={skuCode}
              placeholder='Enter SKU code'
              onChange={(e) => {
                setSkuExists(true);  // Reset SKU existence state on input change
                setSkuCode(e.target.value)}}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Type</label>
            <select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="qr">QR Code</option>
              <option value="code128">Bar Code</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={!skuExists}  // Disable the button if SKU doesn't exist
          >
            Generate Barcode
          </button>
        </form>

        {!skuExists && (
          <div className="text-red-500 mt-4">
            <p>No SKU found with the provided code. Please enter a valid SKU code.</p>
          </div>
        )}

        {generatedBarcode && skuExists && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Generated Barcode</h3>
            <div className="flex flex-col items-center">
              <img 
                src={generatedBarcode} 
                alt="Generated barcode" 
                className="mb-2 border p-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
