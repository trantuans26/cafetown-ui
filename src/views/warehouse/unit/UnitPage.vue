<template>
    <div class="unit-container">
        <div class="content-header">
            <div class="content-header__info">
                <div class="content-header__title">Đơn vị tính</div>
                <v-button :rounded="true" @click="showUnitForm(Enum.FORM_MODE.ADD)">
                    Thêm
                </v-button>
            </div>
            <div class="content-header__breadcumb">
                <div class="ms-16 ms-icon ms-icon-chevron-left"></div>
                <router-link to="/quan-ly-kho">Tất cả danh mục</router-link>
            </div>
        </div>
        <div class="unit-body">
            <div class="unit-toolbar">
                <div class="unit-toolbar__left d-flex align-item-center">
                    <v-input placeholder="Tìm kiếm theo đơn vị tính" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" />
                    <!-- Khu vực hiển thị danh sách filter -->
                    <VFilter />
                </div>
                <div class="unit-toolbar__right">
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="reloadData">
                    </div>
                    <div :tooltip="$t('action.export_excel')" class="ms-24 ms-icon ms-icon-excel ms-x-2"
                        @click="handleSelectAction(Enum.ACTION.EXPORT)"></div>
                </div>
            </div>
            <div class="unit-table">
                <v-table :columns="columns" :data="unitResult.data" :tablePadding="false" :isDataLoaded="isDataLoaded"
                    @action="handleSelectAction">
                </v-table>
            </div>
            <div class="unit-pagination">
                <!-- Phân trang -->
                <v-pagination v-model:pageSize="objectFilter.pageSize" v-model:pageNumber="objectFilter.pageNumber"
                    v-model:totalRecord="unitResult.totalRecord">
                </v-pagination>
            </div>
        </div>
        <UnitForm v-model="isShowUnitForm" :entityId="entityId" @newObj="updateFrontEnd" />
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10" :timeout="3000"></v-toast>
    </div>
</template>
<script>
import _ from 'lodash'
import UnitForm from './UnitForm.vue'
import Enum from "@/utils/enum";
import api from '@/api';
import { convertStatus } from "@/utils/format";

export default {
    name: 'UnitPage',
    components: {
        UnitForm
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
            unitResult: {}, // Kết quả trả về từ api
            isShowUnitForm: false, // Hiển thị form
            entityId: null, // Id của đối tượng,
            isDataLoaded: false, // biến này dùng để check xem dữ liệu đã được load chưa
        }
    },
    computed: {
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
        * @description: Hàm này dùng để lấy key và condition của filter
        * @param: {any} 
        * Author: tttuan 10/11/2022
        */
        getListFilterByKeyAndCondition: {
            get() {
                return this.$store.getters.getListFilterByKeyAndCondition;
            },
        },
        columns() {
            return [
                {
                    title: "Đơn vị tính",
                    key: "unitName",
                    search: true,
                    width: "150px",
                    left: "150px",
                    fixed: true,
                    filterable: true,
                },
                {
                    title: "Mô tả",
                    key: 'description',
                    search: true,
                    filterable: true,
                },
                {
                    title: "Trạng thái",
                    key: 'status',
                    type: 'status',
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
                    width: "50px",
                    formatter: (cellValue) => {
                        return convertStatus(cellValue);
                    }
                },
                {
                    title: "Chức năng",
                    key: 'action',
                    type: 'action',
                    fixed: true,
                    textAlign: 'center',
                    width: "100px",
                },
            ]; // Các cột của bảng đơn vị tính
        }
    },
    watch: {
        /**
         * @description: Xử lý khi objectFilter thay đổi
         * @param: {any}
         * Author: tttuan 24/10/2022
         */
        objectFilter: {
            handler: function () {
                this.getUnitList();
            },
            deep: true
        },
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
         * @description: Theo giõi action key có sẵn
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        '$store.getters.getActionKey': {
            handler(actionKey) {
                if (Enum.ACTION.ADD === actionKey && !this.isShowUnitForm) {
                    this.showUnitForm()
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
         * @description: Hàm này dùng để export ra file excel
         * @param: {any} 
         * Author: tttuan 07/11/2022
         */
        async exportExcel() {
            const self = this;
            try {
                self.$root.$toast.info(self.$t('notice_message.export_excel_processing'));
                const res = await api.unit.exportExcel();
                if (res) {
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
         * @description: Hiển thị form đơn vị tính
         * Author: tttuan 24/10/2022
         */
        showUnitForm(formMode) {
            this.formMode = formMode ? formMode : Enum.FORM_MODE.ADD;
            this.isShowUnitForm = true
        },
        /**
         * @description: Hàm này dùng để nhận các action từ table và thực hiện các nghiệp vụ tương ứng
         * Author: tttuan 27/10/2022
         */
        handleSelectAction(action, object) {
            const self = this;
            switch (action) {
                case Enum.ACTION.DELETE:
                    self.deleteUnit(object);
                    break;
                case Enum.ACTION.EDIT:
                    self.entityId = object.unitID;
                    self.showUnitForm(Enum.FORM_MODE.EDIT);
                    break;
                case Enum.ACTION.DUPLICATE:
                    self.entityId = object.unitID;
                    self.showUnitForm(Enum.FORM_MODE.DUPLICATE);
                    break;
                case Enum.ACTION.EXPORT:
                    self.exportExcel();
                    break;
                case Enum.ACTION.ACTIVE:
                    self.activeOrInactiveUnit(object, 1);
                    break;
                case Enum.ACTION.INACTIVE:
                    self.activeOrInactiveUnit(object, 0);
                    break;
            }
        },
        /**
         * @description: Hàm này dùng để active và inactive đơn vị tính
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        async activeOrInactiveUnit(object, status) {
            try {
                await api.unit.inactiveAndActive(object.unitID, status);
                object.status = status;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng cập nhật lại danh sách khi thêm mới hoặc sửa đổi bên front-end
         * Author: tttuan 27/10/2022
         */
        updateFrontEnd(object) {
            const unitId = object.unitID;
            if (this.formMode === Enum.ACTION.EDIT) {
                const index = this.unitResult.data.findIndex(item => item.unitID === unitId);
                this.unitResult.data.splice(index, 1);
            } else {
                this.unitResult.totalRecord++;
            }
            this.unitResult.data.unshift(object);
        },
        /**
         * @description: Xóa đơn vị tính bên font-end
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        async deleteUnit(object) {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: `Bạn có thực sự muốn xóa Đơn vị tính <<b>${object.unitName}</b>> không?`,
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    await api.unit.deleteById(object.unitID);
                    const index = self.unitResult.data.findIndex((item) => item.unitID === object.unitID);
                    if (index !== -1) {
                        self.unitResult.data.splice(index, 1);
                        self.unitResult.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                    }
                    // nếu số lượng bản ghi hiện tại bằng 0 thì trang hiện tại sẽ giảm đi 1
                    if (self.unitResult.data.length === 0) {
                        self.objectFilter.pageNumber = 1;
                    }
                    self.$root.$toast.success(`Xóa Đơn vị tính <<b>${object.unitName}</b>> thành công!`);
                }
            } catch (error) {
                switch (Number(error.message)) {
                    case Enum.MISAError.ForeignKey:
                        self.$refs.popup.showError(`<b>Xóa không thành công</b>. </br></br>Danh mục <<b>${object.unitName}</b>> đã <<b>có phát sinh </b>>. Bạn phải xóa các phát sinh liên quan trước khi xóa danh mục. `);
                        break;
                    default:
                        self.$root.$toast.error(`Xóa đơn vị tính << b > ${object.unitName}</ >> thất bại`);
                        break;
                }
            }
        },
        /**
         * @description: Lấy danh sách đơn vị tính
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        async getUnitList(isReload = false) {
            const self = this;
            self.isDataLoaded = false;
            try {
                const res = await api.unit.getAllPaging({
                    pageNumber: self.objectFilter.pageNumber,
                    pageSize: self.objectFilter.pageSize,
                    keyword: self.objectFilter.keyword,
                    filter: self.objectFilter.filter
                });
                if (res) {
                    self.unitResult = res;
                    if (isReload) {
                        self.$root.$toast.success(self.$t('notice_message.reload_data_success'))
                    }
                }
            } catch (error) {
                self.$refs.popup.showError(`Lấy danh sách đơn vị tính thất bại.`);
            } finally {
                self.isDataLoaded = true;
            }
        },
        /**
         * @description: Reload data
         * Author: tttuan 24/10/2022
         */
        reloadData() {
            const self = this;
            self.getUnitList(true);
        }
    },
    created() {
        this.Enum = Enum; // Khởi tạo Enum
    },
}
</script>

<style lang="scss" scoped>
.unit-container {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.unit-body {
    padding: 16px;
    margin-top: 20px;
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.unit-toolbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
}

.unit-table {
    height: 100%;
    display: flex;
}

.unit-toolbar__left {}

.unit-toolbar__right {
    display: flex;
    align-items: center;
}
</style>