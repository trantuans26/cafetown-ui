<template>
    <div class="inventory-container">
        <div class="content-header">
            <div class="content-header__info">
                <div class="content-header__title flex-shrink white-space-nowrap">Danh sách hàng hóa, dịch vụ</div>
                <div class="content-header__action">
                    <div class="guide-tour d-flex align-items-center cursor-pointer">
                        <div class="ms-24 ms-icon ms-icon-tour"></div>
                        <div class="guide-tour__text color-blue pl-l-1 flex-shrink white-space-nowrap">Hướng dẫn</div>
                    </div>
                    <v-dropdown className="secondary-light border-bold rounded ms-l-3 "
                        icon="ms-16 ms-icon ms-icon-arrow-down-black opacity-5"
                        :items="[{ key: 'merge', value: 'Gộp VTHH tự động' }]">
                        Tiện ích
                    </v-dropdown>
                    <router-link to="/nhom-vat-tu">
                        <v-button :rounded="true" className="secondary-light border-bold rounded ms-l-3">
                            Nhóm hàng hóa, dịch vụ
                        </v-button>
                    </router-link>
                    <v-dropdown className="primary rounded ms-l-3" icon="ms-16 ms-icon ms-icon-arrow-down-white"
                        :items="[{ key: 'importExcel', value: 'Nhập từ excel' }]" :hasButton="true"
                        @onClick="toggleInventoryForm">
                        Thêm
                    </v-dropdown>
                </div>
            </div>
            <div class="content-header__breadcumb">
                <div class="ms-16 ms-icon ms-icon-chevron-left"></div>
                <router-link to="/quan-ly-kho" class="content-header__breadcumb--text">Tất cả danh mục</router-link>
            </div>
        </div>
        <div class="inventory-body">
            <Transition name="collapse-transition">
                <div class="inventory-overview" v-show="isShowOverview">
                    <div class="inventory-overview__item">
                        <div class="inventory-overview__icon">
                            <v-tooltip content="Bấm vào để lọc">
                                <div class="ms-90 ms-icon ms-icon-minimun-stock"></div>
                            </v-tooltip>
                        </div>
                        <div class="inventory-overview__content">
                            <div class="inventory-overview__number">5</div>
                            <div class="inventory-overview__label">Hàng hóa</div>
                            <div class="inventory-overview__status">Sắp hết hàng</div>
                        </div>
                    </div>
                    <div class="inventory-overvie__line"></div>
                    <div class="inventory-overview__item">
                        <div class="inventory-overview__icon">
                            <v-tooltip content="Bấm vào để lọc">
                                <div class="ms-90 ms-icon ms-icon-over-stock"></div>
                            </v-tooltip>

                        </div>
                        <div class="inventory-overview__content">
                            <div class="inventory-overview__number">41949</div>
                            <div class="inventory-overview__label">Hàng hóa</div>
                            <div class="inventory-overview__status">Hết hàng</div>
                        </div>
                    </div>
                    <div class="inventory-overview__reload">
                        <v-tooltip content="Tải lại số liệu tổng hợp" :equalWidth="true">
                            <div class="ms-16 ms-icon-v2 ms-icon-reload-small"></div>
                        </v-tooltip>
                    </div>
                </div>
            </Transition>
            <div class="inventory-toolbar ">
                <div class="inventory-toolbar__left ms-l-3 ">
                    <div class="ms-24 ms-icon-v2 ms-icon-arrow-check-all"></div>
                    <v-dropdown className="secondary-light border-bold rounded ms-l-3"
                        icon="ms-16 ms-icon ms-icon-arrow-down-black opacity-5"
                        :items="[{ key: Enum.ACTION.DELETE_MANY, value: 'Xóa' }]" @onSelect="handleSelectAction">
                        Thực hiện hàng loạt
                    </v-dropdown>
                    <v-dropdown className="secondary-light border-bold rounded ms-l-3"
                        icon="ms-16 ms-icon ms-icon-arrow-down-black" :hasContent="true"
                        v-model:isShowContent="isShowFilter">
                        Lọc
                        <template #content>
                            <InventoryPageFilter v-model="isShowFilter" />
                        </template>
                    </v-dropdown>
                    <!-- Khu vực hiển thị danh sách filter -->
                    <VFilter />
                </div>
                <div class="inventory-toolbar__right">
                    <v-input placeholder="Tìm theo mã, tên hàng hóa, dịch vụ" icon="ms-16 ms-icon ms-icon-search"
                        :outline="true" :styleProps="['width: 250px', 'font-style: italic']" :focus="true"
                        v-model="keyword" />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="reloadData">
                    </div>
                    <div class="ms-24 ms-icon-v2 ms-icon-meter ml-l-2"></div>
                    <div :tooltip="$t('action.export_excel')" class="ms-24 ms-icon ms-icon-excel ml-l-2"
                        @click="handleSelectAction(Enum.ACTION.EXPORT)"></div>
                    <div class="ms-24 ms-icon-v2 ms-icon-setting ml-l-2"></div>
                </div>
                <div class="inventory-overview__collapse" @click="toggleOverview">
                    <v-tooltip :content="isShowOverview ? 'Ẩn bảng tổng hợp' : 'Hiện bảng tổng hợp'" :equalWidth="true">
                        <div class="ms-16 ms-icon-v2"
                            :class="isShowOverview ? 'ms-icon-chevron-up--primary' : 'ms-icon-chevron-down--primary'">
                        </div>
                    </v-tooltip>
                </div>
            </div>
            <div class="inventory-table d-flex scrollable">
                <!-- Table hiển thị danh sách nhân viên -->
                <v-table v-model:columns="columns" :data="inventoryItemResult.data" @action="handleSelectAction"
                    :isShowTotalInColumn="true" :isDataLoaded="isDataLoaded">
                </v-table>
            </div>
            <div class="inventory-pagination">
                <!-- Phân trang -->
                <v-pagination v-model:pageSize="objectFilter.pageSize" v-model:pageNumber="objectFilter.pageNumber"
                    v-model:totalRecord="inventoryItemResult.totalRecord">
                </v-pagination>
            </div>
        </div>
        <InventoryForm v-model="isShowInventoryForm" :entityId="entityId" @newObj="updateFrontEnd" />
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10" :timeout="3000"></v-toast>
    </div>
</template>

<script>
/* eslint-disable */
import InventoryForm from './InventoryForm.vue'
import InventoryPageFilter from './InventoryPageFilter.vue'
import api from '@/api';
import format from '@/utils/format';
import Enum from "@/utils/enum";
import _ from 'lodash';
import local from '@/utils/local';
export default {
    name: 'InventoryPage',
    components: {
        InventoryForm,
        InventoryPageFilter
    },
    data() {
        return {
            keyword: '', // Từ khóa tìm kiếm
            objectFilter: { // Đối tượng lọc
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
                filter: []
            },
            isShowInventoryForm: false, // Hiển thị form thêm mới
            isShowOverview: true, // Hiển thị tính chất hàng hóa
            inventoryItemResult: {
                summary: {
                    closingQuantity: 0,
                    closingAmount: 0,
                }
            }, // biến này dùng để lưu kết quả trả về từ api
            entityId: null, // Id của đối tượng,
            isDataLoaded: false, // biến này dùng để check xem dữ liệu đã được load chưa
            isShowFilter: false, // Biến này dùng để check xem có hiển thị filter hay không
        }
    },
    computed: {
        /**
        * @description: Khai báo các cột hiển thị trong table
        * Author: tttuan 11/10/2022
        */
        columns: {
            get() {
                return [
                    {
                        title: '',
                        key: 'inventoryItemID',
                        fixed: true,
                        checkbox: true,
                        type: 'checkbox',
                        width: "40px",
                    },
                    {
                        title: 'Mã',
                        key: 'inventoryItemCode',
                        search: true,
                        filterable: true,
                        fixed: true,
                        width: "120px",
                        left: 60,
                        footer: "Tổng",
                    },
                    {
                        title: 'Tên',
                        key: 'inventoryItemName',
                        maxWidth: "300px",
                        search: true,
                        filterable: true,
                    },
                    {
                        title: 'Giảm thuế theo nq 43',
                        key: 'taxReductionType',
                        width: "100px",
                        formatter: (value) => {
                            return format.convertTax(value);
                        },
                        filterable: true,
                        filterOptions: [{ key: 1, value: 'Chưa xác định' }, { key: 2, value: 'Không giảm thuế' }, { key: 3, value: 'Có giảm thuế' }],
                        condition: Enum.FilterConditon.Equal,
                        tooltip: "Giảm thuế theo nghị quyết 43"
                    },
                    {
                        title: 'Tính chất',
                        key: 'inventoryItemType',
                        width: "100px",
                        formatter: (value) => {
                            return format.convertInventoryType(value);
                        },
                        filterable: true,
                        filterOptions: [
                            { key: Enum.GOODS_PROPERTY.GOODS, value: 'Hàng hóa' },
                            { key: Enum.GOODS_PROPERTY.SERVICE, value: 'Dịch vụ' },
                            { key: Enum.GOODS_PROPERTY.MATERIAL, value: 'Nguyên vật liệu' },
                            { key: Enum.GOODS_PROPERTY.FINISHED_GOODS, value: 'Thành phẩm' },
                            { key: Enum.GOODS_PROPERTY.TOOL, value: 'Công cụ, dụng cụ' },
                        ],
                    },
                    {
                        title: 'Nhóm VTHH',
                        key: 'inventoryGroupName',
                        filterable: true,
                        width: "100px",
                        tooltip: 'Nhóm vật tư, hàng hóa',
                    },
                    {
                        title: 'Tên đơn vị',
                        key: 'unitName',
                        filterable: true,
                        width: "100px",
                    },
                    {
                        title: 'Thời hạn bảo hành',
                        key: 'guarantyPeriod',
                        width: "100px",
                        filterable: true,
                    },
                    {
                        title: 'Số lượng tồn tối thiểu',
                        key: 'minimumStock',
                        width: "100px",
                        textAlign: 'right',
                        filterable: true,
                        formatter: (cellValue) => {
                            return format.formatNumberShow(cellValue, 1)
                        },
                        type: 'number',
                    },
                    {
                        title: 'Số lượng tồn',
                        key: 'closingQuantity',
                        width: "100px",
                        textAlign: 'right',
                        filterable: true,
                        footer: this.inventoryItemResult['summary']['closingQuantity'],
                        formatter: (cellValue) => {
                            return format.formatNumberShow(cellValue, 1)
                        },
                        type: 'number',

                    },
                    {
                        title: 'Giá trị tồn',
                        key: 'closingAmount',
                        width: "100px",
                        textAlign: 'right',
                        filterable: true,
                        footer: this.inventoryItemResult['summary']['closingAmount'],
                        formatter: (cellValue) => {
                            return format.formatNumberShow(cellValue)
                        },
                        type: 'number',
                    },
                    {
                        title: 'Nguồn gốc',
                        key: 'inventoryItemSource',
                        width: "250px",
                        filterable: true,

                    },
                    {
                        title: 'Mô tả',
                        key: 'description',
                        maxWidth: "300px",
                        filterable: true,
                    },
                    {
                        title: 'Tên kho',
                        key: 'stockName',
                        filterable: true,
                    },
                    {
                        title: 'Tỉ lệ CK khi mua hàng',
                        key: 'purchaseDiscountRate',
                        textAlign: 'right',
                        filterable: true,
                        type: 'number',
                        maxNumber: 100,
                        tooltip: 'Tỉ lệ chiết khấu khi mua hàng',
                    },
                    {
                        title: 'Đơn giá mua cố định',
                        key: 'fixedUnitPrice',
                        textAlign: 'right',
                        formatter: (cellValue) => {
                            return format.formatNumberShow(Number(cellValue), 2);
                        },
                        filterable: true,
                        type: 'number',
                    },
                    {
                        title: 'Đơn giá mua gần nhất',
                        key: 'unitPrice',
                        textAlign: 'right',
                        formatter: (cellValue) => {
                            return format.formatNumberShow(cellValue);
                        },
                        filterable: true,
                        type: 'number',
                    },
                    {
                        title: 'Đơn giá bán',
                        key: 'salePrice',
                        textAlign: 'right',
                        formatter: (cellValue) => {
                            return format.formatNumberShow(cellValue);
                        },
                        filterable: true,
                        type: 'number',
                    },
                    {
                        title: 'Trạng thái',
                        key: 'status',
                        width: "100px",
                        filterable: true,
                        filterOptions: [
                            {
                                key: 1,
                                value: 'Đang sử dụng'
                            },
                            {
                                key: "0",
                                value: 'Ngừng sử dụng'
                            }
                        ],
                        condition: Enum.FilterConditon.Equal,
                        formatter: (cellValue) => {
                            return format.convertStatus(cellValue);
                        }
                    },
                    {
                        title: 'Chức năng',
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
            }
        },
        /**
        * @description: Get và set trạng thái của form lưu trữ trong store 
        * Author: tttuan 08/10/2022
        */
        formMode: {
            set(val) {
                this.$store.dispatch('setMode', val);
            },
            get() {
                return this.$store.getters.getMode;
            },
        },
        /**
        * @description: get và set các list id selected
        * @param: {any} 
        * Author: tttuan 29/10/2022
        */
        listSelected: {
            get() {
                return this.$store.getters.getListIdSelected;
            },
            set(value) {
                this.$store.commit('setListIdSelected', value);
            },
        },
        /**
         * @description: Hàm này dùng để lấy key và condition của filter
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        getListFilterByKeyAndCondition: {
            get() {
                return this.$store.getters.getListFilterByKeyAndCondition;
            },
        },
    },
    watch: {
        /**
        * @description: Xử lý khi keyword thay đổi
        * @param: {any}
        * Author: tttuan 24/10/2022
        */
        keyword: _.debounce(function (newVal) {
            this.objectFilter = {
                ...this.objectFilter,
                keyword: newVal,
                pageNumber: 1
            }
        }, 500),
        /**
         * @description: Xử lý khi objectFilter thay đổi
         * @param: {any}
         * Author: tttuan 24/10/2022
         */
        objectFilter: {
            handler: function () {
                this.getInventoryItem();
            },
            deep: true
        },
        /**
         * @description: Theo giõi action key có sẵn
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        '$store.getters.getActionKey': {
            handler(actionKey) {
                if (Enum.ACTION.ADD === actionKey && !this.isShowInventoryForm) {
                    this.toggleInventoryForm(Enum.ACTION.ADD)
                }
            },
            deep: true
        },
        /**
         * @description: Hàm này dùng để call api khi list filter thay đổi
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        getListFilterByKeyAndCondition: {
            handler: function (value) {
                this.objectFilter = {
                    ...this.objectFilter,
                    pageNumber: 1,
                    filter: value
                }
            },
            deep: true
        },
    },
    methods: {
        /**
        * @description: Hiển thị form đơn vị tính
        * Author: tttuan 24/10/2022
        */
        showInventoryForm(formMode) {
            this.formMode = formMode ? formMode : Enum.FORM_MODE.ADD;
            this.isShowInventoryForm = true
        },
        /**
         * @description: Hàm này dùng để export ra file excel
         * @param: {any} 
         * Author: tttuan 07/11/2022
         */
        async exportExcel() {
            const self = this;
            try {
                self.$root.$toast.info(self.$t('notice_message.export_excel_processing'));
                const res = await api.inventoryItem.exportExcel();
                const link = document.createElement('a'); // tạo thẻ a để download file
                link.href = res.request.responseURL; // đường dẫn tải file
                link.click();
                self.$root.$toast.success(self.$t('notice_message.export_excel_success'));
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.export_excel_fail'));
                console.log(error);
            }
        },
        /**
        * @description: Hàm này dùng để nhận các action từ table và thực hiện các nghiệp vụ tương ứng
        * Author: tttuan 27/10/2022
        */
        handleSelectAction(action, object) {
            const self = this;
            switch (action) {
                case Enum.ACTION.DELETE:
                    self.deteteInventoryItem(object);
                    break;
                case Enum.ACTION.EDIT:
                    self.entityId = object.inventoryItemID;
                    self.showInventoryForm(Enum.FORM_MODE.EDIT);
                    break;
                case Enum.ACTION.DUPLICATE:
                    self.entityId = object.inventoryItemID;
                    self.showInventoryForm(Enum.FORM_MODE.DUPLICATE);
                    break;
                case Enum.ACTION.EXPORT:
                    self.exportExcel();
                    break;
                case Enum.ACTION.DELETE_MANY:
                    if (self.listSelected.length > 0) {
                        self.deleteMany();
                    }
                    break;
                case Enum.ACTION.ACTIVE:
                    self.activeOrInactiveInventoryItem(object, 1);
                    break;
                case Enum.ACTION.INACTIVE:
                    self.activeOrInactiveInventoryItem(object, 0);
                    break;
            }
        },
        /**
         * @description: Hàm này dùng để active và inactive vật tư
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        async activeOrInactiveInventoryItem(object, status) {
            try {
                await api.inventoryItem.inactiveAndActive(object.inventoryItemID, status);
                object.status = status;
            } catch (error) {
                console.log(error);
            }
        },
        /**
        * @description: Hàm này dùng để xóa nhiều nhân viên
        * Author: tttuan 1/3/2023
        */
        async deleteMany() {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: 'Bạn có thực sự muốn xóa hàng hóa đã chọn?',
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    await api.inventoryItem.deleteMultiple(self.listSelected);
                    self.listSelected.forEach(item => {
                        self.deleteInventoryFrontEnd(item);
                    });
                    self.$root.$toast.success(`Xóa thành công ${self.listSelected.length} vật tư hàng hóa`);
                    self.listSelected = [];
                    self.isEmployeeSelected = false;
                    // nếu dữ liệu trên trang hiện tại đã xóa hết thì load về trang 1
                }
            } catch (error) {
                self.$root.$toast.error('Xóa vật tư hàng hóa thất bại');
            }
        },
        /**
         * @description: Hàm này dùng cập nhật lại danh sách khi thêm mới hoặc sửa đổi bên front-end
         * Author: tttuan 27/10/2022
         */
        updateFrontEnd(object) {
            const self = this
            const inventoryItemID = object.inventoryItemID;
            if (self.formMode === Enum.ACTION.EDIT) {
                const index = self.inventoryItemResult.data.findIndex(item => item.inventoryItemID === inventoryItemID);
                self.inventoryItemResult.data.splice(index, 1);
            } else {
                self.inventoryItemResult.totalRecord++;
            }
            self.inventoryItemResult.data.unshift(object);
        },
        /**
        * @description: Xóa đơn vị tính bên font-end
        * @param: {any} 
        * Author: tttuan 24/10/2022
        */
        async deteteInventoryItem(object) {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: `Bạn có thực sự muốn xóa Vật tư hàng hóa <<b>${object.inventoryItemCode}</b>> không?`,
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    await api.inventoryItem.deleteById(object.inventoryItemID);
                    self.deleteInventoryFrontEnd(object.inventoryItemID);
                    self.$root.$toast.success(`Xóa Vật tư hàng hóa <<b>${object.inventoryItemCode}</b>> thành công!`);
                }
            } catch (error) {
                switch (Number(error.message)) {
                    case Enum.MISAError.ForeignKey:
                        self.$refs.popup.showError(`<b>Xóa không thành công</b>. </br></br>Danh mục <<b>${object.stockCode}</b>> đã <<b>có phát sinh </b>>. Bạn phải xóa các phát sinh liên quan trước khi xóa danh mục. `);
                        break;
                    default:
                        self.$root.$toast.error(`Xóa Vật tư hàng hóa <<b>${object.inventoryItemCode}</b>> thất bại`);
                        break;
                }
            }
        },
        /**
         * @description: Xóa bản ghi ở font-end
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        deleteInventoryFrontEnd(inventoryItemID) {
            const self = this;
            const index = self.inventoryItemResult.data.findIndex((item) => item.inventoryItemID === inventoryItemID);
            if (index !== -1) {
                self.inventoryItemResult.data.splice(index, 1);
            }
            self.inventoryItemResult.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
            //  nếu số lượng bản ghi hiện tại bằng 0 thì quay về trang 1
            if (self.inventoryItemResult.data.length === 0) {
                self.objectFilter.pageNumber = 1;
            }
        },
        /**
         * @description: Hàm này dùng để ẩn hiện bảng xem tổng quan
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        toggleOverview() {
            this.isShowOverview = !this.isShowOverview
            local.setLocalStorage('isShowOverview', this.isShowOverview)
        },
        /**
         * @description: Dùng để ẩn hiện form thêm mới hàng hóa
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        toggleInventoryForm(formMode) {
            this.formMode = formMode ? formMode : Enum.FORM_MODE.ADD;
            this.isShowInventoryForm = !this.isShowInventoryForm
        },
        /**
         * @description: Reload data
         * Author: tttuan 24/10/2022
         */
        reloadData() {
            const self = this;
            self.getInventoryItem(true);
        },
        /**
         * @description: Lấy danh sách đơn vị tính
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        async getInventoryItem(isReload = false) {
            const self = this;
            self.isDataLoaded = false;
            try {
                self.inventoryItemResult = await api.inventoryItem.getAllPaging({
                    pageNumber: self.objectFilter.pageNumber,
                    pageSize: self.objectFilter.pageSize,
                    keyword: self.objectFilter.keyword,
                    filter: self.objectFilter.filter,
                });
                if (isReload) {
                    self.$root.$toast.success(self.$t('notice_message.reload_data_success'))
                }
            } catch (error) {

            } finally {
                self.isDataLoaded = true;
            }

        },
    },
    created() { // Hàm này chạy khi component được tạo
        const self = this;
        self.Enum = Enum; // Khởi tạo enum
        self.isShowOverview = local.getLocalStorage('isShowOverview') === 'true' ? true : false;
    },
}
</script>

<style lang="scss" scoped>
.collapse-transition-enter,
.collapse-transition-leave-to {
    height: 0;

    opacity: 0;
}

.collapse-transition-enter-active,
.collapse-transition-leave-active {
    transition: all 0.2s ease;
}

.inventory {
    &-container {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    &-pagination {
        background-color: #fff;
    }

    &-overview {
        height: 120px;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        background-color: $white;
    }

    &-body {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    &-overview__collapse {
        border: 2px solid #e2e9f2;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f2f5f8;
        position: absolute;
        width: 26px;
        height: 26px;
        cursor: pointer;
        z-index: 9;
        right: -13px;
        top: -13px;

    }

    &-overview__reload {
        position: absolute;
        right: 0;
        top: 0;
    }

    &-overview__item {
        display: flex;
    }

    &-overview__icon {
        // .ms-icon {
        //     &:hover {
        //         border: 2px solid;
        //         border-radius: 50%;
        //         box-sizing: content-box !important;
        //     }
        // }
    }

    &-overview__content {
        text-align: right;
        margin-left: 30px;
    }

    &-overview__number {
        padding: 4px 0px;
        font-size: 38px;
        line-height: 38px;
    }

    &-overview__label {
        color: #212121;
        font-size: 14px;
        font-weight: 700;
    }

    &-overview__status {
        color: #8c8c8e;
        font-size: 16px;
        text-transform: uppercase;
    }

    &-overvie__line {
        width: 1px;
        height: 90px;
        background: #707070;
        margin: 0px 40px;
    }

    &-toolbar {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        // margin-bottom: 16px;
        margin-top: 20px;
        position: relative;
        background: #fff;
    }

    &-toolbar__left {
        display: flex;
        align-items: center;
    }

    &-toolbar__right {
        display: flex;
        align-items: center;
    }

    &-table {
        background: #fff;
        flex: 1;
    }
}
</style>