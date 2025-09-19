import { useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const DownloadTemplateButton = () => {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.dataImports,
        responseType: 'blob', // important for downloading files
      })

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Product_Import_Template.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Template downloaded successfully!')
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Downloading...' : '📥 Download Product Template' }
    </button>
  )
}

export default DownloadTemplateButton
