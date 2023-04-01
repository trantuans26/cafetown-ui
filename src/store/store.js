import { createStore } from "vuex";
import dialogMode from "./dialogMode";
import employee from "./employee";
import action from "./action";
import filter from "./filter";
import table from "./table";

/**
 * @description: Tạo store lưu trữ các state
 * note: actions khác với mutations là actions hỗ trợ async/await và chỉ lên state bằng gọi mutations
 * Author: tttuan 24/09/2022
 */
const store = createStore({
  modules: {
    dialogMode,
    employee,
    action,
    filter,
    table,
  },
});

export default store;
