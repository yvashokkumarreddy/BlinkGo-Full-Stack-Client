import DownloadTemplateButton from "../components/DataImport";

const DataImportPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Data Import</h1>
        <DownloadTemplateButton />
      </div>
      <div>
        <p className="text-gray-600">Upload your product data Excel file here.</p>
      </div>
    </div>
  );
};

export default DataImportPage;