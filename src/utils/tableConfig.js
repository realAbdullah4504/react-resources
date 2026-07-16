export const buildBulkGridTableColumns = (transactionData = []) => {
  if (!transactionData || transactionData.length === 0) {
    return [];
  }

  const sample = transactionData[0];
  const fieldLabels = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    DisputeAmount: 'Dispute Amount',
    ExpectDeliveryDate: 'Expected Delivery Date',
    ProductName: 'Product Name',
    TransReferenceNo: 'Reference Number',
  };

  return Object.keys(sample).map((field) => ({
    field,
    header: fieldLabels[field] || field,
  }));
};
