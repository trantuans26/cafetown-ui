<template>
    <div class="employee">
        <div class="employee-header">
            <div class="employee-title">{{ $t('invoice_page.title') }}</div>
            <v-button @click="handleAction(Enum.ACTION.ADD)">
                {{ $t('sales_page.add_sales') }}
            </v-button>
        </div>
        <div class="employee-body">
            <!-- Các action như search, export, reload -->
            <div class="employee-body__toolbar">
                <div class="employee-body__toolbar-left">
                    <slot name="toolbar-left">
                        <div class="v-table__column-filter">
                            <div class="v-table__column-filter--text">
                                {{ $t("invoice_page.filter") }}: 
                            </div>
                        </div>
                        <div class="v-table__column-filter">
                            <div class="row sm-gutter flex--center">
                                <div class="col l-8 md-8">
                                    <v-combobox position="bottom" propKey="key" propValue="value" 
                                        v-model="selectedCollectedOptions" 
                                        :data="listCollectedOptions"
                                        :selectBox="true">
                                    </v-combobox>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
                <div class="employee-body__toolbar-right">
                    <slot name="toolbar-right"></slot>
                    <v-input :placeholder="$t('invoice_page.search_function')" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" 
                    />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="handleAction(Enum.ACTION.RELOAD)">
                    </div>
                </div>
            </div>
            <!-- Table hiển thị danh sách hóa đơn -->
            <v-table v-model:columns="columns" :data="invoiceList.data" @action="handleAction" :actions="tableAction"
                :isDataLoaded="isDataLoaded">
            </v-table>
            <!-- Phân trang -->
            <v-pagination v-model:pageSize="pagination.pageSize" v-model:pageNumber="pagination.pageNumber"
                v-model:totalRecord="invoiceList.totalRecord">
            </v-pagination>
        </div>
        <!-- Form sửa và thêm hóa đơn -->
        <invoice-form v-model="showInvoiceForm" @updateInvoice="updateInvoice"></invoice-form>

        <!-- Khu vực hiển thị popup và toast thông báo -->
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import InvoiceForm from './InvoiceForm.vue';
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
export default {
    components: { InvoiceForm},
    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showInvoiceForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật hóa đơn
            invoiceList: [], // biến này dùng để lưu danh sách hóa đơn
            pagination: {
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
                isCollected: 2,
            }, // biến này dùng để lưu thông tin phân trang và tìm kiếm
            debounce: null, // biến này dùng để lưu hàm debounce,
            isDataLoaded: false, // biến này dùng để kiểm tra dữ liệu đã được load hay chưa
            listCollectedOptions: [
                {'key': 2, 'value': 'Tất cả'}, 
                {'key': 1, 'value': 'Đã thu tiền'}, 
                {'key': 0, 'value': 'Chưa thu tiền'}
            ],
            selectedCollectedOptions: 2,
        };
    },
    computed: {
        ...mapGetters(['isInvoiceSelected']), // lấy giá trị từ store kiểm tra xem có hóa đơn nào được chọn hay không
        /**
         * @description: Lấy ra các action key (phím tắt) lưu trữ trong store 
         * Author: tttuan 11/10/2022
         */
        action: {
            get() {
                return this.$store.getters.getActionKey;
            },
            set(value) {
                this.$store.commit('setActionKey', value);
            }
        },
        /**
         * @description: Khai báo các cột hiển thị trong table
         * Author: tttuan 11/10/2022
         */
        columns: {
            get() {
                return [
                    {
                        title: this.$t(`invoice_table.code`),
                        key: 'invoiceCode',
                        search: true,
                    },
                    {
                        title: this.$t(`invoice_table.customer`),
                        key: 'customer',
                        search: true,
                    },
                    {
                        title: this.$t(`invoice_table.total_cost`),
                        key: 'totalCost',
                        type: 'currency'
                    },
                    {
                        title: this.$t(`invoice_table.purchase_date`),
                        width: "100px",
                        key: 'purchaseDate',
                        textAlign: 'center',
                        type: 'date',
                    },
                    {
                        title: this.$t(`invoice_table.employee`),
                        key: 'createdBy',
                    },
                    {
                        title: this.$t(`invoice_table.action`),
                        key: 'action',
                        type: 'action',
                        fixed: true,
                        textAlign: 'center',
                        width: "120px",
                    },
                ];
            },
            set(value) {
                this.columns = value;
                console.log(this.columns);
            }
        },
        /**
         * @description: Khai báo các action thực hiện hàng loạt
         * Author: tttuan 11/10/2022
         */
        bathAction: {
            get() {
                return [{ 'key': Enum.ACTION.DELETE_MANY, 'value': this.$t('action.delete') }];
            }
        },
        /**
         * @description: Khai báo các action thực hiện trên từng dòng của table
         * Author: tttuan 11/10/2022
         */
        tableAction: {
            get() {
                let permission = this.$store.getters.getPermission;
                
                if(permission && permission.isManager) {
                    return [
                        {
                            'key': Enum.ACTION.EDIT,
                            'value': this.$t('action.edit'),
                        },
                        {
                            'key': Enum.ACTION.DELETE,
                            'value': this.$t('action.delete'),
                        }
                    ]; // Khởi tạo danh sách action trên từng dòng
                } else {
                    return [
                        {
                            'key': Enum.ACTION.EDIT,
                            'value': this.$t('action.edit'),
                        }
                    ]; // Khởi tạo danh sách action trên từng dòng
                }

            }
        }


    },
    watch: {
        selectedCollectedOptions: {
            handler: function (newVal) {
                this.pagination.isCollected = newVal;
                this.getInvoiceList();
                console.log(newVal + ': ', this.invoiceList);
            },
            deep: true,
        },
        
        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới phân trang
         * Author: tttuan 06/10/2022
         */
        pagination: {
            handler: function (newVal) {
                this.getInvoiceList(newVal);
            },
            deep: true,
        },
        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới từ khóa tìm kiếm
         * Author: tttuan 06/10/2022
         */
        keyword: {
            /**
            * @description: Dùng debounce để tránh việc gọi api liên tục khi người dùng nhập từ khóa
            * Author: tttuan 23/09/2022
            */
            handler: function (newVal) {
                const self = this;
                clearTimeout(self.debounce);
                if (newVal) {
                    self.debounce = setTimeout(() => {
                        self.pagination.keyword = newVal.trim();
                    }, 500); // triển khai debounce để giảm số lần gọi api
                } else {
                    self.debounce = setTimeout(() => {
                        self.pagination.keyword = "";
                    }, 500); // triển khai debounce để giảm số lần gọi api
                }

            },
        },
        /**
         * @description: Lắng nghe sự kiện khi người dùng thay đổi trạng thái của form thêm mới hoặc cập nhật hóa đơn bằng phím tắt
         * Author: tttuan 10/10/2022
         */
        action: {
            handler: function (newVal) {
                // let curentFocus = document.activeElement; // lấy phần tử đang được active
                switch (newVal) {
                    case Enum.ACTION.ADD: // tổ hợp phím  Ctrl + Alt + A để thêm mới hóa đơn
                        this.handleAction(newVal);
                        break;
                    case Enum.ACTION.DELETE: // phím delete để xóa hóa đơn
                        if (this.isInvoiceSelected) {
                            this.handleAction(Enum.ACTION.DELETE_MANY);
                        }
                        break;
                    case Enum.ACTION.EXPORT:
                        this.handleAction(Enum.ACTION.EXPORT);
                        break;
                    case Enum.ACTION.RELOAD: // tổ hợp phím Ctrl + R để reload lại table
                        this.handleAction(Enum.ACTION.RELOAD);
                        break;
                    default:
                        break;
                }
            },
            deep: true,
        }
    },

    methods: {
        /**
         * @description: Thực hiện các action như thêm mới, sửa, xóa, xóa nhiều, tải lại dữ liệu, xuất ra excel
         * @param {string} action - Tên của action
         * @param {object} data - Dữ liệu của action
         * Author: tttuan 16/09/2022
         */
        handleAction(action, data) {
            const self = this;
            try {
                switch (action) {
                    case Enum.ACTION.ADD: // thêm mới hàng hóa
                        self.showAddInvoiceForm();
                        break;
                    case Enum.ACTION.EDIT: // xem hóa đơn
                        self.showViewInvoiceForm(data);
                        break;
                    case Enum.ACTION.DELETE: // xóa hóa đơn
                        self.deleteInvoice(data);
                        break;
                    case Enum.ACTION.DELETE_MANY: // xóa nhiều hóa đơn
                        self.deleteInvoiceMany(data);
                        break;
                    case Enum.ACTION.INACTIVE:
                        self.$root.$toast.info(self.$t('notice_message.developing'));
                        break;
                    case Enum.ACTION.RELOAD: // Tải lại danh sách hóa đơn
                        self.reloadData();
                        break;
                    case Enum.ACTION.EXPORT: // Xuất file excel
                        self.exportExcel();
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để hiển thị form thêm mới hóa đơn
         * Author: tttuan 07/10/2022
         */
        showAddInvoiceForm() {
            const self = this;
            self.$store.dispatch('setMode', Enum.FORM_MODE.ADD);
            self.showInvoiceForm = true;
        },
        /**
         * @description: Hàm này dùng để sửa hóa đơn
         * @param {object} invoice - Dữ liệu của hóa đơn
         * Author: tttuan 07/10/2022
         */
        showViewInvoiceForm(invoice) {
            const self = this;
            self.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            self.$store.dispatch('setInvoiceId', invoice.invoiceID);
            self.showInvoiceForm = true;
        },
        /**
         * @description: Hàm này dùng để xóa hóa đơn
         * @param {object} invoice - Dữ liệu của hóa đơn
         * Author: tttuan 07/10/2022
         */
        deleteInvoice(invoice) {
            const self = this;
            self.deleteInvoiceBackend(invoice);
        },
        /**
         * @description: Hàm này dùng để xóa nhiều hóa đơn
         * Author: tttuan 1/3/2023
         */
        async deleteInvoiceMany() {
            const self = this;
            const confirm = await self.$refs.popup.show({
                message: self.$t('notice_message.confirm_delete_many'),
                icon: Enum.ICON.WARNING,
                okButton: self.$t('confirm_popup.yes'),
                closeButton: self.$t('confirm_popup.cancel'),
            });
            if (confirm == self.$t('confirm_popup.yes')) {
                const result = await self.$store.dispatch('deleteMultipleEmployee');
                if (result > 0) {
                    self.$root.$toast.success(self.$t('notice_message.delete_many_success', [result]));
                    self.getInvoiceList();
                } else {
                    self.$root.$toast.error(self.$t('notice_message.delete_many_fail'));
                }
            }
        },

        /**
         * @description: Hàm này dùng để tải lại danh sách hóa đơn
         * Author: tttuan 07/10/2022
         */
        async reloadData() {
            const self = this;
            const res = await self.getInvoiceList();
            if (res) {
                self.$root.$toast.success(self.$t('notice_message.reload_data_success'));
            } else {
                self.$root.$toast.error(self.$t('notice_message.reload_data_fail'));
            }
        },
        /**
         * @description: Hàm này dùng để xuất danh sách hóa đơn ra file excel
         * Author: tttuan 05/10/2022
         */
        async exportExcel() {
            const self = this;
            try {
                self.$root.$toast.info(self.$t('notice_message.export_excel_processing'));
                const res = await self.$api.invoice.exportInventories(self.pagination); // kiểm tra xem có dữ liệu không
                if (res.status == Enum.MISA_CODE.SUCCESS) {
                    const link = document.createElement('a'); // tạo thẻ a để download file
                    link.href = res.request.responseURL; // đường dẫn tải file
                    link.click();
                    self.$root.$toast.success(self.$t('notice_message.export_excel_success'));
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.export_excel_fail'));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hóa đơn ở bên backend
         * @param {object} data - Dữ liệu của hóa đơn cần xóa
         * Author: tttuan 19/09/2022
         */
        async deleteInvoiceBackend(employee) {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: self.$t('notice_message.confirm_delete', [employee.invoiceCode]),
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    const res = await self.$api.invoice.deleteInvoice(employee.invoiceID);
                    if (res.status == Enum.MISA_CODE.SUCCESS) {
                        self.deleteInvoiceFrontEnd(employee);
                    } else {
                        self.$root.$toast.error(self.$t('notice_message.delete_fail', [employee.invoiceCode]));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hóa đơn trong danh sách ở bên frontend
         * @param: {object} data - Dữ liệu của hóa đơn cần xóa 
         * Author: tttuan 22/09/2022
         */
        deleteInvoiceFrontEnd(data) {
            const self = this;
            const { invoiceID, invoiceCode } = data;
            try {
                const index = self.invoiceList.data.findIndex((item) => item.invoiceID === invoiceID);
                if (index !== -1) {
                    self.invoiceList.data.splice(index, 1);
                    self.$root.$toast.success(self.$t('notice_message.delete_success', [invoiceCode]));
                    self.invoiceList.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                }
            } catch (error) {
                self.$root.$toast.success(self.$t('notice_message.delete_fail', [invoiceCode]));
                console.log(error);
            }
        },

        /**
         * @description: Hàm này dùng để cập nhật hóa đơn ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateInvoice(invoice) {
            const self = this;
            try {
                const index = self.invoiceList.data.findIndex((item) => item.invoiceID === invoice.invoiceID);
                if (index !== -1) {
                    self.invoiceList.data.splice(index, 1);
                    self.invoiceList.data.unshift(invoice);
                    self.$root.$toast.success(self.$t('notice_message.update_success', [invoice.invoiceCode]));
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.update_fail', [invoice.invoiceCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để lấy danh sách hóa đơn
         * Author: tttuan 19/09/2022
         */
        async getInvoiceList() {
            const self = this;
            try {
                self.isDataLoaded = false;
                const result = await self.$api.invoice.getInvoicesFilter(self.pagination);
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    self.invoiceList = result.data;
                    self.isDataLoaded = true;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                self.$refs.popup.showError(self.$t('notice_message.get_employee_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

    },
    created() { // Hàm này chạy khi component được tạo
        const self = this;
        self.getInvoiceList(); // Lấy danh sách hóa đơn
        self.Enum = Enum; // Khởi tạo enum
    },
}
</script>
<style lang="scss" scoped>
.employee {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        box-sizing: border-box;
    }

    &-title {
        font-size: 24px;
        font-family: "MISA Fonts Bold";
    }

    &-body {
        background-color: #fff;
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        &__toolbar {
            display: flex;
            justify-content: space-between;
            padding: 16px;
            margin-bottom: 16px;
            margin-top: 20px;

            &-left {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            &-right {
                display: flex;
                align-items: center;
            }
        }
    }
}

.v-table__column-filter--text {
    font-weight: 700;
    margin-right: 12px;
    font-family: "MISA Fonts Bold";
    font-size: 14px;
}

.pd--0 {
    padding-bottom: 0 !important;
}
</style>