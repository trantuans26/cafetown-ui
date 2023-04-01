<template>
    <div v-if="modelValue" class="v-table__condition" ref="condition">
        <div class="v-table__filter">
            <div class="v-table__column-filter">
                <div class="row sm-gutter">
                    <div class="form-group col l-6 md-6 focus">
                        <v-combobox position="bottom" propKey="key" propValue="value" :selectBox="true" :focus="true"
                            v-model:textInput="fiterObj.inventoryItemTypeName" v-model="fiterObj.inventoryItemType"
                            :data="inventoryItemTypes" label="Tính chất">
                        </v-combobox>
                    </div>
                    <div class="form-group col l-6 md-6">
                        <v-combobox position="bottom" propKey="inventoryGroupID" propValue="inventoryGroupName"
                            v-model="fiterObj.inventoryGroupID" v-model:textInput="fiterObj.inventoryGroupName"
                            :columns="[{ key: 'inventoryGroupCode', title: 'Mã nhóm', width: '250px' }, { key: 'inventoryGroupName', title: 'Tên nhóm', width: '250px' }]"
                            :data="inventoryGroupList" label="Nhóm">
                        </v-combobox>
                    </div>
                    <div class="form-group col l-6 md-6">
                        <v-combobox position="bottom" propKey="key" propValue="value" :selectBox="true"
                            v-model="fiterObj.inventoryItemStatus" :data="inventoryStatus" label="Tình trạng tồn kho"
                            v-model:textInput="fiterObj.inventoryItemStatusName">
                        </v-combobox>
                    </div>
                    <div class="form-group col l-6 md-6">
                        <v-combobox position="bottom" propKey="key" propValue="value" :selectBox="true" :data="status"
                            v-model:textInput="fiterObj.statusName" v-model="fiterObj.status" label="Trạng thái">
                        </v-combobox>
                    </div>
                </div>
            </div>
            <div class="v-table__action-filter d-flex justify-content-between m-t-3">
                <v-button buttonType="secondary">Bỏ lọc</v-button>
                <v-button @click="applyFilter">Lọc</v-button>
            </div>
        </div>
    </div>
</template>

<script>
import { arrayToTree } from "performant-array-to-tree";
import api from "@/api";
import Enum from "@/utils/enum";

// import format from "@/utils/format";
export default {
    name: 'VTableFilter',
    props: {
        modelValue: { // trạng thái hiển thị của filter
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            inventoryGroupList: [],
            fiterObj: {
                inventoryItemType: '',
                inventoryItemTypeName: '',
                inventoryGroupID: '',
                inventoryGroupName: '',
                inventoryItemStatus: '',
                inventoryItemStatusName: '',
                status: '',
                statusName: ''
            },
            filterField: [
                'inventoryItemType',
                'inventoryGroupID',
                'inventoryItemStatus',
                'status'
            ] // mảng chứa danh sách các ref của các combobox
        };
    },
    computed: {
        inventoryItemTypes() {
            return [
                { key: '', value: 'Tất cả' },
                { key: Enum.GOODS_PROPERTY.GOODS, value: 'Hàng hóa' },
                { key: Enum.GOODS_PROPERTY.SERVICE, value: 'Dịch vụ' },
                { key: Enum.GOODS_PROPERTY.MATERIAL, value: 'Nguyên vật liệu' },
                { key: Enum.GOODS_PROPERTY.FINISHED_GOODS, value: 'Thành phẩm' },
                { key: Enum.GOODS_PROPERTY.TOOL, value: 'Công cụ, dụng cụ' },
            ];
        },
        inventoryStatus() {
            return [
                { key: '', value: 'Tất cả' },
                { key: Enum.INVENTORY_STATUS.IN_STOCK, value: 'Còn tồn' },
                { key: Enum.INVENTORY_STATUS.SOON_OUT_OF_STOCK, value: 'Sắp hết hàng' },
                { key: Enum.INVENTORY_STATUS.OUT_OF_STOCK, value: 'Hết hàng' },
            ];
        },
        status() {
            return [
                { key: '', value: 'Tất cả' },
                { key: "0", value: 'Ngừng sử dụng' },
                { key: 1, value: 'Đang sử dụng' },
            ];
        },
    },
    watch: {
        /**
         * @description: Hàm này dùng để xử lsy khi hộp thoại filter được mở
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        modelValue: {
            handler: function (val) {
                const self = this;
                if (val) {
                    if (self.inventoryGroupList.length === 0) {
                        self.getInventoryGroupList(); // Lấy danh sách đơn vị tính
                    }
                    self.filterField.forEach((item) => { // binding ngược lại giá trị vào các combobox
                        let filter = self.$store.getters.getItemFilterByKey(item);
                        if (filter) {
                            self.fiterObj[item] = filter.value;
                        }
                    });
                } else {
                    self.fiterObj = {
                        inventoryItemType: '',
                        inventoryItemTypeName: '',
                        inventoryGroupID: '',
                        inventoryGroupName: '',
                        inventoryItemStatus: '',
                        inventoryItemStatusName: '',
                        status: '',
                        statusName: ''
                    }
                }
            },
            deep: true
        },
    },
    methods: {
        /**
        * @description: Lấy danh sách đơn vị tính
        * @param: {any} 
        * Author: tttuan 24/10/2022
        */
        async getInventoryGroupList() {
            const self = this;
            const treeData = arrayToTree(await api.inventoryGroup.getAll(), {
                id: "inventoryGroupID",
                parentId: "inventoryGroupParentID",
                dataField: null,
            });
            this.getAllChildOfNode(treeData, 'inventoryGroupCode', self.inventoryGroupList);
        },

        /**
        * @description: tìm ra tất cả các con của 1 node
        * @param: {any}
        * Author: tttuan 24/10/2022
        */
        getAllChildOfNode(list, propKeyReplace, result, level = 0) {
            const self = this;
            list.forEach((item) => {
                item.level = level;
                item[propKeyReplace] = `${"&nbsp;".repeat(level * 4)}${item[propKeyReplace]}`;
                result.push(item);
                if (item.children) {
                    self.getAllChildOfNode(item.children, propKeyReplace, result, level + 1);
                }
            });
        },

        /**
         * @description: Hàm này dùng để update emit dữ liệu lọc lên component cha
         * @param: {any} 
         * Author: tttuan 08/11/2022
         */
        applyFilter() {
            const self = this;
            let inventoryItemFilter = { // tạo filter theo tính chất hàng hóa
                key: 'inventoryItemType',
                title: 'Tính chất',
                value: self.fiterObj.inventoryItemType,
                selectedOption: self.fiterObj.inventoryItemTypeName,
                condition: Enum.FilterConditon.Equal
            };
            let inventoryGroupFilter = { // tạo filter theo nhóm hàng hóa
                key: 'inventoryGroupID',
                title: 'Nhóm VTHH',
                selectedOption: self.fiterObj.inventoryGroupName,
                value: self.fiterObj.inventoryGroupID,
                condition: Enum.FilterConditon.Equal
            };
            let statusFilter = { // tạo filter trạng thái
                key: 'status',
                title: 'Trạng thái',
                value: self.fiterObj.status,
                condition: Enum.FilterConditon.Equal,
                selectedOption: self.fiterObj.statusName
            };
            let inventoryItemStatusFilter = { // tạo filter tình trạng hàng hóa
                title: 'Tình trạng tồn kho',
                selectedOption: self.fiterObj.inventoryItemStatusName
            };

            if (self.fiterObj.inventoryItemType) {
                self.$store.commit('addItemFilter', inventoryItemFilter);
            }
            if (self.fiterObj.inventoryGroupID) {
                self.$store.commit('addItemFilter', inventoryGroupFilter);
            }
            if (self.fiterObj.status) {
                self.$store.commit('addItemFilter', statusFilter);
            }
            if (self.fiterObj.inventoryItemStatus) {
                switch (self.fiterObj.inventoryItemStatus) {
                    case Enum.INVENTORY_STATUS.IN_STOCK:
                        inventoryItemStatusFilter = {
                            ...inventoryItemStatusFilter,
                            value: 0,
                            condition: Enum.FilterConditon.GreaterThan,
                            key: 'closingQuantity'
                        }
                        self.$store.commit('addItemFilter', inventoryItemStatusFilter);
                        break;
                    case Enum.INVENTORY_STATUS.OUT_OF_STOCK:
                        inventoryItemStatusFilter = {
                            ...inventoryItemStatusFilter,
                            condition: Enum.FilterConditon.IsNull,
                            key: 'closingQuantity',
                            value: 'and InventoryItem.closingQuantity <= 0'
                        }
                        self.$store.commit('addItemFilter', inventoryItemStatusFilter);
                        break;
                    case Enum.INVENTORY_STATUS.SOON_OUT_OF_STOCK:
                        inventoryItemStatusFilter = {
                            ...inventoryItemStatusFilter,
                            value: 'InventoryItem.MinimumStock and InventoryItem.status = 0 and InventoryItem.closingQuantity > 0',
                            condition: Enum.FilterConditon.LessThanOrEqual,
                            key: 'closingQuantity'
                        }
                        self.$store.commit('addItemFilter', inventoryItemStatusFilter);
                        break;
                }
            }
            Object.keys(self.fiterObj).forEach((key) => {
                self.filterField.forEach((field) => {
                    if (field == key && self.fiterObj[key] == '') {
                        self.$store.commit('removeItemFilter', field);
                    }
                });
            });
            self.$emit('update:modelValue', false);
        }
    },



};
</script>

<style lang="scss" scoped>
.v {
    &-table__condition {
        position: absolute;
        padding: 16px 20px 20px;
        border: 1px solid #babec5;
        z-index: 10003;
        background: #fff;
        min-width: 533px;
        max-width: 533px;
        width: fit-content;
        font-weight: 400;
        font-size: 13px;
        border-radius: 2px;
        box-shadow: 3px 3px 6px #ddd;

    }

    &-table__lock {
        display: flex;
        align-items: center;
        padding-bottom: 14px;
        border-bottom: 1px solid #ebedf0;

    }

    &-table__filter {}

    &-table__column-filter {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &-table__input-filter {}

    &-table__action-filter {}
}
</style>