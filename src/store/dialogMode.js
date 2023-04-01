/**
 * @description: Tạo store lưu trữ các mode của dialog (thêm, sửa, xóa)
 * Author: tttuan 02/10/2022
 */
const dialogMode = {
  state: {
    mode: null, // mode của dialog (thêm, sửa, xóa)
    action: null, // action của dialog (thêm, sửa, xóa)
    employeeId: null, // id của nhân viên
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
     * @description: Lấy action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 02/10/2022
     */
    getAction(state) {
      return state.action;
    },
  },
};

export default dialogMode;
