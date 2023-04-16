/**
 * @description: Tạo store lưu trữ các mode của dialog (thêm, sửa, xóa)
 * Author: tttuan 02/10/2022
 */
const dialogMode = {
  state: {
    mode: null, // mode của dialog (thêm, sửa, xóa)
    action: null, // action của dialog (thêm, sửa, xóa)
    employeeId: null, // id của nhân viên
    inventoryId: null, // id của hàng hóa
  },
  mutations: {
    /**
     * @description: Thay đổi mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 02/10/2022
     */
    setMode(state, mode) {
      state.mode = mode;
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 02/10/2022
     */
    setEmployeeId(state, employeeId) {
      state.employeeId = employeeId;
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 02/10/2022
     */
    setInventoryId(state, inventoryId) {
      state.inventoryId = inventoryId;
    },
    /**
     * @description: TThay đổi action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 02/10/2022
     */
    setAction(state, action) {
      state.action = action;
    },
  },
  actions: {
    /**
     * @description: Thay đổi mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 02/10/2022
     */
    setMode({ commit }, mode) {
      commit("setMode", mode);
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 02/10/2022
     */
    setEmployeeId({ commit }, employeeId) {
      commit("setEmployeeId", employeeId);
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 02/10/2022
     */
    setInventoryId({ commit }, inventoryId) {
      commit("setInventoryId", inventoryId);
    },
    /**
     * @description: Thay đổi action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 02/10/2022
     */
    setAction({ commit }, action) {
      commit("setAction", action);
    },
  },
  getters: {
    /**
     * @description: Lấy mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 02/10/2022
     */
    getMode(state) {
      return state.mode;
    },
    /**
     * @description: Lấy id của nhân viên trong dialog
     * Author: tttuan 02/10/2022
     */
    getEmployeeId(state) {
      return state.employeeId;
    },
    /**
     * @description: Lấy id của nhân viên trong dialog
     * Author: tttuan 02/10/2022
     */
    getInventoryId(state) {
      return state.inventoryId;
    },
    /**
     * @description: Lấy action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 02/10/2022
     */
    getAction(state) {
      return state.action;
    },
  },
};

export default dialogMode;
