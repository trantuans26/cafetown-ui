import { createRouter, createWebHistory } from "vue-router";

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}
// Khai báo các routes
const router = [
  {
    path: "/",
    redirect: "/tong-quan",
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
      icon: "ms-icon ms-icon-employee",
      title: "employee",
      order: 2,
    },
  },
/*   {
    path: "/ban-hang",
    component: lazyLoad("sales/SalesList"),
    meta: {
      title: "Bán hàng",
    },
    sideBar: {
      icon: "ms-icon ms-icon-sell",
      title: "sales",
      order: 5,
    },
  }, */
  {
    path: "/quan-ly-hoa-don",
    component: lazyLoad("invoice/InvoiceList"),
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
    path: "/quan-ly-hang-hoa",
    component: lazyLoad("inventory/InventoryList"),
    meta: {
      title: "Quản lý hàng hóa",
    },
    sideBar: {
      icon: "ms-icon ms-icon-warehouse",
      title: "manage_stock",
      order: 7,
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
