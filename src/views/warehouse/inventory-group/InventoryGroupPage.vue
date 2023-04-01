<template>
    <div class="unit-container">
        <div class="content-header">
            <div class="content-header__info">
                <div class="content-header__title">Nhóm vật tư, hàng hóa, dịch vụ</div>
                <v-dropdown className="primary rounded ms-l-3" icon="ms-16 ms-icon ms-icon-arrow-down-white"
                    @onClick="showInventoryGroupForm" :items="[{ key: 'import', value: 'Nhập từ excel' }]"
                    :hasButton="true">
                    Thêm
                </v-dropdown>
            </div>
            <div class="content-header__breadcumb">
                <div class="ms-16 ms-icon ms-icon-chevron-left"></div>
                <!-- <router-link to="/quan-ly-kho">Tất cả danh mục</router-link> -->
                <a @click="$router.go(-1)">Quay lại</a>
            </div>
        </div>
        <div class="unit-body">
            <div class="unit-toolbar">
                <div class="unit-toolbar__left d-flex align-item-center">
                    <v-input placeholder="Tìm theo nhóm vật tư, hàng hóa, dịch vụ" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 280px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" />
                    <div class="filter-condition" v-if="dataFilter.length > 0">
                        <div class="filter-condition__item" v-for="(item, index) in dataFilter" :key="index">
                            {{ item.title }} {{ item.selectedOption ? '' : item.conditionName }} {{ item.selectedOption
                                    ?
                                    `"${item.selectedOption}"` :
                                    item.value ? `"${item.value}"` : ''
                            }}
                            <div class="filter-condition__delete ms-16 ms-icon ms-icon-close-small"
                                @click="deleteFilterCondition(index)"></div>
                        </div>
                        <div class="filter-condition__remove" @click="deleteFilterCondition(-1)">Xóa điều kiện lọc</div>
                    </div>
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
                <v-table-tree :columns="columns" :data="treeData" :tablePadding="false" propKeyTree="inventoryGroupID"
                    @action="handleSelectAction">
                </v-table-tree>
            </div>

            <div class="unit-pagination">
                <!-- Phân trang -->
                <v-pagination v-model:pageSize="objectFilter.pageSize" v-model:pageNumber="objectFilter.pageNumber"
                    v-model:totalRecord="inventoryGroupResult.totalRecord">
                </v-pagination>
            </div>
        </div>
        <InventoryGroupForm v-model="isShowInventoryGroupForm" :entityId="entityId" @newObj="updateFrontEnd" />
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10" :timeout="3000"></v-toast>
    </div>
</template>
<script>
import _ from 'lodash'
import InventoryGroupForm from './InventoryGroupForm.vue'
import Enum from "@/utils/enum";
import api from '@/api';
import { arrayToTree } from "performant-array-to-tree";
import { convertStatus } from "@/utils/format";
export default {
    name: 'InventoryGroupPage',
    components: {
        InventoryGroupForm,
    },
    data() {
        return {
            treeData: [],
            keyword: '', // Từ khóa tìm kiếm
            objectFilter: { // Đối tượng lọc
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
                filter: []
            },
            inventoryGroupResult: {}, // Kết quả trả về từ api
            isShowInventoryGroupForm: false, // Hiển thị form
            entityId: null, // Id của đối tượng,
            dataFilter: [], // Dữ liệu lọc
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
        columns() {
            return [
                {
                    title: "Mã nhóm vật tư, hàng hóa, dịch vụ",
                    key: "inventoryGroupCode",
                    search: true,
                    width: "150px",
                    type: 'tree',

                },
                {
                    title: "Tên nhóm vật tư, hàng hóa, dịch vụ",
                    key: 'inventoryGroupName',

                },
                {
                    title: "Trạng thái",
                    key: 'status',
                    type: 'status',
                    width: "150px",
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
            ] // Khởi tạo danh sách cột cho bảng nhóm vật tư, hàng hóa, dịch vụ
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
                this.getInventoryGroupList();
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
                if (Enum.ACTION.ADD === actionKey && !this.isShowInventoryGroupForm) {
                    this.showInventoryGroupForm()
                }
            },
            deep: true
        },
        inventoryGroupResult: {
            handler: function (val) {
                this.treeData = arrayToTree(val.data, {
                    id: "inventoryGroupID",
                    parentId: "inventoryGroupParentID",
                    dataField: null,
                });
            },
            deep: true
        }
    },
    methods: {
        /**
         * @description: Hiển thị form đơn vị tính
         * Author: tttuan 24/10/2022
         */
        showInventoryGroupForm(formMode) {
            this.formMode = formMode ? formMode : Enum.FORM_MODE.ADD;
            this.isShowInventoryGroupForm = true
        },
        /**
         * @description: Hàm này dùng để nhận các action từ table và thực hiện các nghiệp vụ tương ứng
         * Author: tttuan 27/10/2022
         */
        handleSelectAction(action, object) {
            const self = this;
            switch (action) {
                case Enum.ACTION.DELETE:
                    self.deteteStock(object);
                    break;
                case Enum.ACTION.EDIT:
                    self.entityId = object.inventoryGroupID;
                    self.showInventoryGroupForm(Enum.FORM_MODE.EDIT);
                    break;
                case Enum.ACTION.DUPLICATE:
                    self.entityId = object.inventoryGroupID;
                    self.showInventoryGroupForm(Enum.FORM_MODE.DUPLICATE);
                    break;
                case Enum.ACTION.EXPORT:
                    self.exportExcel();
                    break;
                case Enum.ACTION.ACTIVE:
                    self.activeOrInactiveInventoryGroup(object, 1);
                    break;
                case Enum.ACTION.INACTIVE:
                    self.activeOrInactiveInventoryGroup(object, "0");
                    break;
            }
        },
        /**
          * @description: Hàm này dùng để active và inactive kho
          * @param: {any} 
          * Author: tttuan 10/11/2022
          */
        async activeOrInactiveInventoryGroup(object, status) {
            try {
                await api.inventoryGroup.inactiveAndActive(object.inventoryGroupID, status);
                object.status = status;
            } catch (error) {
                console.log(error);
            }
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
                const res = await api.inventoryGroup.exportExcel();
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
         * @description: Hàm này dùng cập nhật lại danh sách khi thêm mới hoặc sửa đổi bên front-end
         * Author: tttuan 27/10/2022
         */
        updateFrontEnd(object) {
            const unitId = object.inventoryGroupID;
            if (this.formMode === Enum.ACTION.EDIT) {
                const index = this.inventoryGroupResult.data.findIndex(item => item.inventoryGroupID === unitId);
                this.inventoryGroupResult.data.splice(index, 1);
            } else {
                this.inventoryGroupResult.totalRecord++;
            }
            this.inventoryGroupResult.data.unshift(object);
            if (this.inventoryGroupResult.data.length === 0) {
                this.objectFilter.pageNumber = 1;
            }
        },
        /**
         * @description: Xóa đơn vị tính bên font-end
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        async deteteStock(object) {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: `Bạn có thực sự muốn xóa Nhóm vật tư <<b>${object.inventoryGroupName}</b>> không?`,
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    await api.inventoryGroup.deleteById(object.inventoryGroupID);
                    const index = self.inventoryGroupResult.data.findIndex((item) => item.inventoryGroupID === object.inventoryGroupID);
                    if (index !== -1) {
                        self.inventoryGroupResult.data.splice(index, 1);
                        self.inventoryGroupResult.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                    }
                    // nếu số lượng bản ghi hiện tại bằng 0 thì trang hiện tại sẽ giảm đi 1
                    if (self.inventoryGroupResult.data.length === 0) {
                        self.objectFilter.pageNumber = 1;
                    }
                    self.$root.$toast.success(`Xóa Nhóm vật tư <<b>${object.inventoryGroupCode}</b>> thành công!`);
                }
            } catch (error) {
                switch (Number(error.message)) {
                    case Enum.MISAError.ForeignKey:
                        self.$refs.popup.showError(`<b>Xóa không thành công</b>. </br></br>Danh mục <<b>${object.inventoryGroupCode}</b>> đã <<b>có phát sinh </b>>. Bạn phải xóa các phát sinh liên quan trước khi xóa danh mục. `);
                        break;
                    default:
                        self.$root.$toast.error(`Xóa Nhóm vật tư <<b>${object.inventoryGroupCode}</b>> thất bại!`);
                        break;
                }
            }
        },
        /**
         * @description: Lấy danh sách đơn vị tính
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        async getInventoryGroupList(isReload = false) {
            const self = this;
            try {
                self.inventoryGroupResult = await api.inventoryGroup.getAllPaging({
                    pageNumber: self.objectFilter.pageNumber,
                    pageSize: self.objectFilter.pageSize,
                    keyword: self.objectFilter.keyword,
                    filter: self.objectFilter.filter
                }
                );
                if (isReload) {
                    self.$root.$toast.success(self.$t('notice_message.reload_data_success'))
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.reload_data_fail'))
            }
        },
        /**
         * @description: Reload data
         * Author: tttuan 24/10/2022
         */
        reloadData() {
            const self = this;
            self.getInventoryGroupList(true);
        },
    },
    created() {
        this.Enum = Enum; // Khởi tạo Enum
        this.getInventoryGroupList(); // Lấy danh sách đơn vị tính
    },
}
</script>

<style lang="scss" scoped>
.item {
    cursor: pointer;
    line-height: 1.5;
}

.bold {
    font-weight: bold;
}

.filter {
    &-condition {
        display: flex;
        align-items: center;
        line-height: 35px;
        margin-left: 10px;
    }

    &-condition__item {
        display: flex;
        color: #0075c0;
        white-space: nowrap;
        align-items: center;
        padding-right: 10px;
        position: relative;
    }

    &-condition__delete {
        margin-left: 4px;
    }

    &-condition__remove {
        color: #0075c0;
        display: inline-block;
        cursor: pointer;
    }
}

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