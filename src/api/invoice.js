const PREFIX_INVOICE = "Invoices";
export default (axios) => ({
  /**
   * @description: Lấy mã hàng hóa mới
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getNewInvoiceCode() {
    return axios.get(`${PREFIX_INVOICE}/newCode`);
  },

  /**
   * @description: Lấy chi tiết hàng hóa
   * @param {String} invoiceId Id hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getInvoiceById(invoiceId) {
    return axios.get(`${PREFIX_INVOICE}/${invoiceId}`);
  },

  /**
   * @description: Lấy danh sách hàng hóa theo filter
   * @param {Object} filter Đối tượng filter
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getInvoicesFilter(object) {
    var defaultObject = {
      pageNumber: 1,
      pageSize: 10,
      keyword: "",
    };
    object = Object.assign(defaultObject, object);
    return axios.get(`${PREFIX_INVOICE}/filter?keyword=${object.keyword}&pageSize=${object.pageSize}&pageNumber=${object.pageNumber}`, {
    });
  },

  /**
   * @description: Xóa hàng hóa
   * @param {String} invoiceId Id hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  deleteInvoice(invoiceId) {
    return axios.delete(`${PREFIX_INVOICE}/${invoiceId}`);
  },

  /**
   * @description: Thêm mới hàng hóa
   * @param {Object} invoice Đối tượng hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  insertInvoice(object) {
    return axios.post(`${PREFIX_INVOICE}`, object);
  },

  /**
   * @description: Cập nhật hàng hóa
   * @param {Object} invoice Đối tượng hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  updateInvoice(object) {
    return axios.put(`${PREFIX_INVOICE}/${object.invoiceID}`, object);
  },
  /**
   * @description: Export danh sách hàng hóa
   * Author: tttuan 5/3/2023
   */
  exportInventories(object) {
    return axios.get(`${PREFIX_INVOICE}/export?keyword=${object.keyword}`, {
      responseType: "blob",
    });
  },
});
