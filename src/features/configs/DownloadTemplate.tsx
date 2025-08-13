
export default function DownloadTemplateButton() {
    const handleDownload = () => {
        fetch("/api/download-template/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "school_template.xls");
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(err => console.error("Download failed", err));
    };

    return (
        <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Download Spreadsheet Template
        </button>
    );
}
