import { createRouter, createWebHistory } from "vue-router";

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}
// Khai báo các routes
const router = [
  {
    path: "/",
    redirect: "/quan-ly-kho",
  },
  {
    path: "/tong-quan",
    component: lazyLoad("example/ComponentExample"),
    meta: {
      title: "Tổng quan",
    },
    sideBar: {
      icon: "ms-icon ms-icon-dashboard",
      title: "overview",
      order: 1,
    },
  },
  {
    path: "/nhan-vien",
    component: lazyLoad("employee/EmployeeList"),
    meta: {
      title: "Nhân viên",
    },
    sideBar: {
      icon: "ms-icon ms-icon-cash",
      title: "cash",
      order: 2,
    },
  },
  {
    path: "/tien-gui",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Tiền gửi",
    },
    sideBar: {
      icon: "ms-icon ms-icon-bank",
      title: "banking",
      order: 3,
    },
  },
  {
    path: "/mua-hang",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Mua hàng",
    },
    sideBar: {
      icon: "ms-icon ms-icon-buy",
      title: "purchase",
      order: 4,
    },
  },
  {
    path: "/ban-hang",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Bán hàng",
    },
    sideBar: {
      icon: "ms-icon ms-icon-sell",
      title: "sales",
      order: 5,
    },
  },
  {
    path: "/quan-ly-hoa-don",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Quản lý hóa đơn",
    },
    sideBar: {
      icon: "ms-icon ms-icon-bill",
      title: "manage_invoice",
      order: 6,
    },
  },
  {
    path: "/quan-ly-kho",
    component: lazyLoad("warehouse/WarehousePage"),
    meta: {
      title: "Quản lý kho",
    },
    sideBar: {
      icon: "ms-icon ms-icon-warehouse",
      title: "manage_stock",
      order: 7,
    },
  },
  {
    path: "/don-vi-tinh",
    component: lazyLoad("warehouse/unit/UnitPage"),
    meta: {
      title: "Đơn vị tính",
    },
  },
  {
    path: "/kho",
    component: lazyLoad("warehouse/stock/StockPage"),
    meta: {
      title: "Đơn vị tính",
    },
  },
  {
    path: "/nhom-vat-tu",
    component: lazyLoad("warehouse/inventory-group/InventoryGroupPage"),
    meta: {
      title: "Nhóm vật tư",
    },
  },
  {
    path: "/vat-tu-hang-hoa",
    component: lazyLoad("warehouse/inventory/InventoryPage"),
    meta: {
      title: "Vật tư / Hàng hóa",
    },
  },
  {
    path: "/cong-cu",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Công cụ",
    },
    sideBar: {
      icon: "ms-icon ms-icon-tool",
      title: "equipment",
      order: 8,
    },
  },
  {
    path: "/tai-san-co-dinh",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Tài sản cố định",
    },
    sideBar: {
      icon: "ms-icon ms-icon-fixed-asset",
      title: "fixed_asset",
      order: 9,
    },
  },
  {
    path: "/thue",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Thuế",
    },
    sideBar: {
      icon: "ms-icon ms-icon-tax",
      title: "tax",
      order: 10,
    },
  },
  {
    path: "/gia-thanh",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Giá thành",
    },
    sideBar: {
      icon: "ms-icon ms-icon-price",
      title: "price",
      order: 11,
    },
  },
  {
    path: "/tong-hop",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Tổng hợp",
    },
    sideBar: {
      icon: "ms-icon ms-icon-summary",
      title: "general_ledger",
      order: 12,
    },
  },
  {
    path: "/ngan-sach",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Ngân sách",
    },
    sideBar: {
      icon: "ms-icon ms-icon-budget",
      title: "budget",
      order: 13,
    },
  },
  {
    path: "/bao-cao",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Báo cáo",
    },
    sideBar: {
      icon: "ms-icon ms-icon-report",
      title: "report",
      order: 14,
    },
  },
  {
    path: "/phan-tich-tai-chinh",
    component: lazyLoad("update/UpdatePage"),
    meta: {
      title: "Phân tích tài chính",
    },
    sideBar: {
      icon: "ms-icon ms-icon-analysis",
      title: "financial_analysis",
      order: 15,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: lazyLoad("error/ErrorPage"),
    meta: {
      title: "Không tìm thấy trang",
    },
  },
];

// Khởi tạo router
const routes = createRouter({
  history: createWebHistory(),
  routes: router,
});

// Cập nhật meta title cho từng route
routes.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default routes;
