import { useState } from "react";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import Button from "../../components/ui/button/Button"; // Adjust path if needed

export default function InvoiceManager() {
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpenInvoiceModal(true)}>
        + Create Invoice
      </Button>

      <CreateInvoiceModal
        open={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
      />
    </div>
  );
}
