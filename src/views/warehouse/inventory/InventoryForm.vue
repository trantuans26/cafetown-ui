<template>
    <div class="inventory-container__form">
        <!-- Khu vực hiển thị dialog form tính chất hàng hóa -->
        <v-dialog :isShow="isShowFormType" @close="handleCloseFormType" position="right" width="800px" :zIndex="10000">
            <template #title>
                <div class="content-header__title">
                    Chọn tính chất hàng hóa dịch vụ
                </div>
            </template>
            <template #body>
                <div class="divide-line"></div>
                <div class="inventory-information">
                    <ul class="inventory-information__list">
                        <li class="inventory-information__item"
                            @click="handleChangeForm(Enum.GOODS_PROPERTY.GOODS, 'Hàng hóa')">
                            <div class="inventory-information__item--icon">
                                <div class="ms-85 ms-icon ms-icon-inventory-item-category"></div>
                            </div>
                            <div class="inventory-information__item--content">
                                <label>Hàng hóa</label>
                                <p>Sản phẩm bạn mua và bán lại cho khách hàng</p>
                            </div>
                        </li>
                        <li class="inventory-information__item"
                            @click="handleChangeForm(Enum.GOODS_PROPERTY.SERVICE, 'Dịch vụ')">
                            <div class="inventory-information__item--icon">
                                <div class="ms-85 ms-icon ms-icon-construct-item-category"></div>
                            </div>
                            <div class="inventory-information__item--content">
                                <label>Dịch vụ</label>
                                <p>Đơn vị tính cho dịch vụ</p>
                            </div>
                        </li>
                        <li class="inventory-information__item"
                            @click="handleChangeForm(Enum.GOODS_PROPERTY.MATERIAL, 'Nguyên vật liệu')">
                            <div class="inventory-information__item--icon">
                                <div class="ms-85 ms-icon ms-icon-mataerial-item-category"></div>
                            </div>
                            <div class="inventory-information__item--content">
                                <label>Nguyên vật liệu</label>
                                <p>Đơn vị tính cho nguyên vật liệu</p>
                            </div>
                        </li>
                        <li class="inventory-information__item"
                            @click="handleChangeForm(Enum.GOODS_PROPERTY.FINISHED_GOODS, 'Thành phẩm')">
                            <div class="inventory-information__item--icon">
                                <div class="ms-85 ms-icon ms-icon-clothes-item-category"></div>
                            </div>
                            <div class="inventory-information__item--content">
                                <label>Thành phẩm</label>
                                <p>Đơn vị tính cho thành phẩm</p>
                            </div>
                        </li>
                        <li class="inventory-information__item"
                            @click="handleChangeForm(Enum.GOODS_PROPERTY.TOOL, 'Công cụ dụng cụ')">
                            <div class="inventory-information__item--icon">
                                <div class="ms-85 ms-icon ms-icon-tool-item-category"></div>
                            </div>
                            <div class="inventory-information__item--content">
                                <label>Công cụ dụng cụ</label>
                                <p>Đơn vị tính cho công cụ dụng cụ</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </template>
        </v-dialog>
        <!-- khu vực hiển thị form hàng hóa -->
        <v-dialog :isShow="isShowForm" @close="closeFormHandle(false)" position="right" width="800px" :isResize="true"
            @onHandleSave="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)"
            @onHandleSaveAndNew="saveHandler(Enum.ACTION.SAVE_AND_ADD)">
            <template #title>
                <div class="content-header__title font-size-16">
                    Chọn tính chất hàng hóa dịch vụ
                </div>
                <div class="main-header d-flex">
                    <div class="main-icon">
                        <!-- <div class="ms-50 ms-icon ms-icon-inventory-item-category-detail"></div> -->
                        <div class="ms-50" :class="iconType"></div>
                    </div>
                    <div class="sub-title">
                        {{ titleType }}
                    </div>
                    <div class="change-attribute" @click="handleChangeFormType">
                        Thay đổi tính chất
                    </div>
                </div>
            </template>
            <template #body>
                <div class="grid inventory-form__body v-form__label-small scrollable">
                    <div class="divide-line ml-b-3"></div>
                    <div class="inventory-form__basic">
                        <div class="row sm-gutter">
                            <div class="form-group col l-8 md-8">
                                <div class="row sm-gutter">
                                    <div class="form-group col l-12 md-12 focus">
                                        <v-input label="Tên" :required="true" errorLabel="Tên" ref="inventoryItemName"
                                            @validate="setValid('inventoryItemName', $event)" :maxLength="255"
                                            v-model="inventoryItem.inventoryItemName" :focus="true">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-3 md-3">
                                        <v-input label="Mã" :required="true" errorLabel="Mã" :maxLength="100"
                                            ref="inventoryItemCode" @validate="setValid('inventoryItemCode', $event)"
                                            v-model.trim="inventoryItem.inventoryItemCode">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-9 md-9">
                                        <v-combobox position="bottom" propKey="inventoryGroupID"
                                            propValue="inventoryGroupCode" label="Nhóm VTHH"
                                            propTooltip="inventoryGroupName" tooltipText="Nhóm vật tư hàng hóa"
                                            :tree="{ id: 'inventoryGroupID', parentId: 'inventoryGroupParentID', propName: 'inventoryGroupCode' }"
                                            tooltipPosition="right" mode="multiple" :additionObject="inventoryGroupObj"
                                            v-model:textInput="inventoryItem.inventoryGroupName"
                                            v-model="inventoryItem.inventoryGroupID" @add="onHandleAddInventoryGroup"
                                            propApi="https://localhost:44365/api/v2/inventorygroups" :add="true"
                                            :columns="[{ key: 'inventoryGroupCode', title: 'Mã nhóm vật tư, hàng hóa, dịch vụ', width: '250px' }, { key: 'inventoryGroupName', title: 'Tên nhóm vật tư, hàng hóa, dịch vụ', width: '250px' }]">
                                        </v-combobox>
                                    </div>
                                    <div class="form-group col l-3 md-3">
                                        <v-combobox position="bottom" propKey="unitID" propValue="unitName"
                                            label="Đơn vị tính chính" propApi="https://localhost:44365/api/v2/units"
                                            tooltipPosition="right" v-model="inventoryItem.unitId"
                                            v-model:textInput="inventoryItem.unitName" @add="onHandleAddUnit"
                                            :additionObject="unitObj" :add="true">
                                        </v-combobox>
                                    </div>
                                    <div class="form-group col l-4 md-4">
                                        <v-combobox position="bottom" propKey="key" propValue="value"
                                            tooltipText="Trạng thái tra cứu giảm thuế theo nghị quyết 43/2022/QH15"
                                            tooltipPosition="right" :selectBox="true"
                                            v-model="inventoryItem.taxReductionType"
                                            :data="[{ key: 1, value: 'Chưa xác định' }, { key: 2, value: 'Không giảm thuế' }, { key: 3, value: 'Có giảm thuế' }]"
                                            label="Giảm thuế theo NQ43">
                                        </v-combobox>
                                    </div>
                                    <div class="form-group col l-4 md-4 align-self-end">
                                        <v-tooltip content="Tra cứu mặt hàng giảm thuế theo nghị quyết 43" :top="25"
                                            position="center">
                                            <div class="inventory-tax__search">
                                                <div class="ms-16 ms-icon-v2 ms-icon-search-tax"></div>
                                                <div>Tra cứu giảm thuế</div>
                                            </div>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col l-4 md-4">
                                <div class="inventory-form__upload">
                                    <div class="inventory-form__upload-image">
                                        <div class="ms-64 ms-icon-v2 ms-icon-preview-image"></div>
                                    </div>
                                    <div class="inventory-form__upload-action">
                                        <v-tooltip content="Sửa">
                                            <div class="ms-24 ms-icon-v2 ms-icon-edit-upload-file"></div>
                                        </v-tooltip>
                                        <div class="separate-line-upload"></div>
                                        <v-tooltip content="Tải xuống">
                                            <div class="ms-24 ms-icon-v2 ms-icon-download-upload-file"></div>
                                        </v-tooltip>
                                        <div class="separate-line-upload"></div>
                                        <v-tooltip content="Xóa">
                                            <div class="ms-24 ms-icon-v2 ms-icon-delete-upload-file"></div>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="divide-line ml-y-3"></div>
                        <div class="row sm-gutter">
                            <div class="form-group col l-2 md-2" v-if="isGoods">
                                <v-combobox position="bottom" propKey="value" propValue="value"
                                    label="Thời hạn bảo hành" :additionValue="true"
                                    v-model="inventoryItem.guarantyPeriod"
                                    :data="[{ value: '1 tháng' }, { value: '2 tháng' }, { value: '3 tháng' }, { value: '4 tháng' }, { value: '9 tháng' }, { value: '1 năm' }, { value: '2 năm' }, { value: '3 năm' }, { value: '4 năm' }, { value: '9 năm' }, { value: '12 năm' }]">
                                </v-combobox>
                            </div>
                            <div class="form-group col l-3 md-3" v-if="isGoods">
                                <v-input label="Số lượng tồn tối thiểu" type="number"
                                    v-model="inventoryItem.minimumStock">
                                </v-input>
                            </div>
                            <div class="form-group col l-7 md-7" v-if="isGoods">
                                <v-input label="Nguồn gốc" v-model="inventoryItem.inventoryItemSource" :maxLength="255">
                                </v-input>
                            </div>
                            <div class="form-group col l-12 md-12" v-if="isGoods">
                                <v-input label="Mô tả" type="textarea" v-model="inventoryItem.description">
                                </v-input>
                            </div>
                            <div class="form-group col l-12 md-12">
                                <v-input label="Diễn giải khi mua" v-model="inventoryItem.purchaseDescription"
                                    :maxLength="255">
                                </v-input>
                            </div>
                            <div class="form-group col l-12 md-12">
                                <v-input label="Diễn giải khi bán" v-model="inventoryItem.saleDescription"
                                    :maxLength="255">
                                </v-input>
                            </div>
                        </div>
                    </div>
                    <div class="form-group col l-12 md-12">
                        <a-collapse v-model:activeKey="activeKey" @change="changeActivekey" accordion>
                            <template #expandIcon="{ isActive }">
                                <div class="ms-16 ms-icon-v2"
                                    :class="isActive ? 'ms-icon-arrow-bottom-black' : 'ms-icon-arrow-right-black'">
                                </div>
                            </template>
                            <a-collapse-panel key="1" header="Thông tin ngầm định">
                                <div class="row m-l-0" v-if="isGoods">
                                    <div class="form-group col l-3 md-3">
                                        <v-combobox position="bottom" propKey="stockID" propValue="stockCode"
                                            label="Kho ngầm định" propApi="https://localhost:44365/api/v2/stocks"
                                            v-model:textInput="inventoryItem.stockName" :add="true"
                                            className="form-group" @add="onHandleAddStock" :additionObject="stockObj"
                                            v-model="inventoryItem.stockID"
                                            :columns="[{ key: 'stockCode', title: 'Mã kho', width: '150px' }, { key: 'stockName', title: 'Tên kho', width: '200px' }]">
                                        </v-combobox>
                                        <v-input label="Tài khoản kho" className="form-group"
                                            v-model="inventoryItem.inventoryAccount">
                                        </v-input>
                                        <v-input label="TK doanh thu" tooltipText="Tài khoản doanh thu"
                                            v-model="inventoryItem.saleAccount" className="form-group">
                                        </v-input>
                                        <v-input label="TK chiết khấu" tooltipText="Tài khoản chiết khấu"
                                            v-model="inventoryItem.discountAccount" className="form-group">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-3 md-3">
                                        <v-input label="TK giảm giá" tooltipText="Tài khoản giảm giá"
                                            v-model="inventoryItem.saleOffAccount" className="form-group"
                                            :maxLength="100">
                                        </v-input>
                                        <v-input label="TK trả lại" tooltipText="Tài khoản trả lại"
                                            v-model="inventoryItem.returnAccount" className="form-group"
                                            :maxLength="100">
                                        </v-input>
                                        <v-input label="TK chi phí" tooltipText="Tài khoản chi phí"
                                            v-model="inventoryItem.costAccount" className="form-group" :maxLength="100">
                                        </v-input>
                                        <v-input label="Tỷ lệ CKMH(%)" tooltipText="Tỷ lệ chiết khấu mua hàng"
                                            :maxNumber="100" :minNumber="0" v-model="inventoryItem.purchaseDiscountRate"
                                            className="form-group" type="number">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-3 md-3">
                                        <v-input label="Đơn giá mua cố định" type="number"
                                            v-model.number="inventoryItem.fixedUnitPrice" className="form-group">
                                        </v-input>
                                        <v-input label="Đơn giá mua gần nhất" v-model.number="inventoryItem.unitPrice"
                                            type="number" className="form-group">
                                        </v-input>
                                        <v-input label="Đơn giá bán" v-model.number="inventoryItem.salePrice"
                                            type="number" className="form-group"></v-input>
                                    </div>
                                    <div class="form-group col l-3 md-3">
                                        <v-input label="Thuế suất GTGT (%)" tooltipText="Thuế suất giá trị gia tăng"
                                            v-model="inventoryItem.taxRate" type="text" className="form-group">
                                        </v-input>
                                        <v-input label="Thuế suất thuế NK (%)" v-model="inventoryItem.importTaxRate"
                                            type="number" :maxNumber="100" :minNumber="0"
                                            tooltipText="Thuế suất thuế nhập khẩu" className="form-group"></v-input>
                                        <v-input label="Thuế suất thuế XK (%)" tooltipText="Thuế suất thuế xuất khẩu"
                                            type="number" :maxNumber="100" :minNumber="0"
                                            v-model="inventoryItem.exportTaxRate" className="form-group">
                                        </v-input>
                                        <v-input label="Nhóm HHDV chịu thuế TTĐB"
                                            tooltipText="Nhóm hàng hóa dịch vụ chịu thuế tiêu thụ đặc biệt"
                                            v-model="inventoryItem.inventoryCategorySpecialTaxName" :maxLength="255"
                                            className="form-group"></v-input>
                                    </div>
                                </div>
                                <div class="row m-l-0" v-else>
                                    <div class="form-group col l-4 md-4">
                                        <v-input label="TK doanh thu" tooltipText="Tài khoản doanh thu"
                                            v-model="inventoryItem.saleAccount" className="form-group" :maxLength="100">
                                        </v-input>
                                        <v-input label="TK chiết khấu" tooltipText="Tài khoản chiết khấu"
                                            v-model="inventoryItem.discountAccount" className="form-group"
                                            :maxLength="100">
                                        </v-input>
                                        <v-input label="TK giảm giá" tooltipText="Tài khoản giảm giá"
                                            v-model="inventoryItem.saleOffAccount" className="form-group"
                                            :maxLength="100">
                                        </v-input>
                                        <v-input label="TK trả lại" tooltipText="Tài khoản trả lại"
                                            v-model="inventoryItem.returnAccount" className="form-group"
                                            :maxLength="100">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-4 md-4">
                                        <v-input label="TK chi phí" tooltipText="Tài khoản chi phí"
                                            v-model="inventoryItem.costAccount" className="form-group">
                                        </v-input>
                                        <v-input label="Tỷ lệ CKMH(%)" tooltipText="Tỷ lệ chiết khấu mua hàng"
                                            :maxNumber="100" :minNumber="0" v-model="inventoryItem.purchaseDiscountRate"
                                            className="form-group" type="number">
                                        </v-input>
                                        <v-input label="Đơn giá mua cố định" type="number"
                                            v-model.number="inventoryItem.fixedUnitPrice" className="form-group">
                                        </v-input>
                                        <v-input label="Đơn giá mua gần nhất" v-model.number="inventoryItem.unitPrice"
                                            type="number" className="form-group">
                                        </v-input>
                                    </div>
                                    <div class="form-group col l-4 md-4">
                                        <v-input label="Đơn giá bán" v-model.number="inventoryItem.salePrice"
                                            type="number" className="form-group"></v-input>
                                        <v-input label="Thuế suất GTGT (%)" tooltipText="Thuế suất giá trị gia tăng"
                                            type="number" :maxNumber="100" :minNumber="0"
                                            v-model="inventoryItem.taxRate" className="form-group">
                                        </v-input>
                                        <v-input label="Nhóm HHDV chịu thuế TTĐB"
                                            tooltipText="Nhóm hàng hóa dịch vụ chịu thuế tiêu thụ đặc biệt"
                                            v-model="inventoryItem.inventoryCategorySpecialTaxName" :maxLength="255"
                                            className="form-group"></v-input>
                                    </div>
                                </div>
                            </a-collapse-panel>
                            <!-- <a-collapse-panel key="2" header="Chiết khấu bán hàng">
                            </a-collapse-panel>
                            <a-collapse-panel key="3" header="Đơn vị chuyển đổi">
                            </a-collapse-panel>
                            <a-collapse-panel key="4" header="Công thức tính số lượng">
                            </a-collapse-panel> -->
                        </a-collapse>
                    </div>
                    <div class="divide-line ml-b-3"></div>
                </div>
            </template>
            <template #footer__left>
                <v-button buttonType="secondary" @click="closeFormHandle(true)"
                    className="v-button__button-no-bg border">
                    {{ $t('action_form.cancel') }}
                </v-button>
                <div style="max-width: 0; max-height: 0; overflow: hidden;">
                    <input @focus="inputFocus()" />
                </div>
            </template>
            <template #footer__right>
                <v-tooltip :content="$t('action_form.save') + Enum.KEY_DEFINE.CTRL_S" :equalWidth="true">
                    <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)" buttonType="secondary">
                        {{ $t('action_form.save') }}
                    </v-button>
                </v-tooltip>
                <v-tooltip :content="$t('action_form.save_and_add') + Enum.KEY_DEFINE.CTRL_SHIFT_S" :equalWidth="true">
                    <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_ADD)">
                        {{ $t('action_form.save_and_add') }}
                    </v-button>
                </v-tooltip>
            </template>
        </v-dialog>
        <InventoryGroupForm v-model="isShowInventoryGroupForm" @newObj="insertInventoryGroup" />
        <UnitForm v-model="isShowUnitForm" @newObj="insertUnit" />
        <StockForm v-model="isShowStockForm" @newObj="insertStock" />
        <v-popup ref="popup" :tabIndex="0"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>

</template>

<script>
import { Collapse as ACollapse, CollapsePanel as ACollapsePanel } from 'ant-design-vue'
import '@/assets/scss/base/collapse.scss'
import api from "@/api/index";
import InventoryGroupForm from '../inventory-group/InventoryGroupForm.vue';
import UnitForm from '../unit/UnitForm.vue';
import StockForm from '../stock/StockForm.vue';
import Enum from "@/utils/enum";
import format from '@/utils/format';
export default {
    name: 'InventoryForm',
    props: {
        modelValue: { // trạng thái đóng mở của form
            type: Boolean,
            default: false
        },
        entityId: { // Id của đối tượng cần sửa
            type: String,
            default: null
        },
    },
    components: {
        ACollapse,
        ACollapsePanel,
        InventoryGroupForm,
        UnitForm,
        StockForm
    },
    data() {
        return {
            activeKey: [], // active key của collapse
            inventoryItem: { // dữ liệu của form
                inventoryItemCode: null,
                inventoryItemName: null,
                guarantyPeriod: null,
                inventoryGroupID: ['0eb0136b-ee41-463f-8e8f-9b4f29b7a037'],
                inventoryGroupName: null,
                inventoryItemType: 1,
                unitName: null,
                taxReductionType: 1,
                minimumStock: null,
                inventoryItemSource: null,
                description: null,
                purchaseDescription: null,
                saleDescription: null,
                stockID: null,
                stockName: null,
                inventoryAccount: null,
                saleAccount: null,
                discountAccount: null,
                saleOffAccount: null,
                returnAccount: null,
                costAccount: null,
                purchaseDiscountRate: null,
                fixedUnitPrice: null,
                unitPrice: null,
                salePrice: null,
                taxRate: null,
                importTaxRate: null,
                exportTaxRate: null,
                inventoryCategorySpecialTaxName: null,
            },
            valids: {}, // Lưu trạng thái validate của các input
            refs: [ // Danh sách các ref của các input để validate
                'inventoryItemCode',
                'inventoryItemName',
            ],
            oldInventoryItem: {}, // dữ liệu của form trước khi thay đổi
            isShowInventoryGroupForm: false, // hiển thị form nhóm hàng hóa 
            inventoryGroupObj: {}, // dữ liệu nhóm hàng
            isShowUnitForm: false, // hiển thị form đơn vị tính
            unitObj: {}, // dữ liệu đơn vị tính
            isShowStockForm: false, // hiển thị form kho
            stockObj: {}, // dữ liệu kho
            isShowFormType: false, // hiển thị form loại hàng hóa
        }
    },
    watch: {
        /**
         * @description: Hàm này dùng để theo giõi đóng mở form và thực hiện các hành động
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        modelValue: {
            async handler(isShowForm) {
                const self = this;
                if (isShowForm) {
                    if (self.formMode == Enum.FORM_MODE.ADD) {
                        await self.getNewInventoryItemCode();
                    } else if (self.formMode == Enum.FORM_MODE.EDIT) {
                        await self.getDetail();
                    } else if (self.formMode == Enum.FORM_MODE.DUPLICATE) {
                        await self.getDetail();
                        await self.getNewInventoryItemCode();
                        self.formMode = Enum.FORM_MODE.ADD;
                    } else {
                        self.formMode = Enum.FORM_MODE.ADD;
                    }
                    setTimeout(() => {
                        self.oldInventoryItem = JSON.parse(JSON.stringify(self.inventoryItem)); // Lưu lại dữ liệu cũ để so sánh
                    }, 100);
                } else {
                    self.resetForm();
                    self.formMode = Enum.FORM_MODE.NULL;
                }
            },
            deep: true
        },
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
        // trạng thái của form
        isShowForm: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
                this.handleCloseFormType();
            }
        },
        // Enum
        Enum() {
            return Enum
        },
        iconType() { // icon của form
            switch (this.inventoryItem.inventoryItemType) {
                case Enum.GOODS_PROPERTY.GOODS:
                    return 'ms-icon ms-icon-inventory-item-category-detail';
                case Enum.GOODS_PROPERTY.SERVICE:
                    return 'ms-icon ms-icon-construct-item-category-detail';
                case Enum.GOODS_PROPERTY.MATERIAL:
                    return 'ms-icon ms-icon-mataerial-item-category-detail';
                case Enum.GOODS_PROPERTY.FINISHED_GOODS:
                    return 'ms-icon ms-icon-clothes-item-category-detail';
                case Enum.GOODS_PROPERTY.TOOL:
                    return 'ms-icon ms-icon-tool-item-category-detail';
                default:
                    return 'ms-icon ms-icon-inventory-item-category-detail';
            }
        },
        titleType() { // title của form
            return format.convertInventoryType(this.inventoryItem.inventoryItemType || 1);
        },
        isGoods() { // kiểm tra loại hàng hóa là hàng hóa
            const inventoryType = this.inventoryItem.inventoryItemType;
            return inventoryType ? inventoryType == Enum.GOODS_PROPERTY.GOODS || inventoryType == Enum.GOODS_PROPERTY.MATERIAL || inventoryType == Enum.GOODS_PROPERTY.FINISHED_GOODS || inventoryType == Enum.GOODS_PROPERTY.TOOL : true;
        },
        isService() { // kiểm tra loại hàng hóa là dịch vụ
            return this.inventoryItem.inventoryItemType ? this.inventoryItem.inventoryItemType == Enum.GOODS_PROPERTY.SERVICE : false;
        },
    },
    methods: {
        /**
         * @description: Hàm này dùng để đóng form chọn tính chất hàng hóa
         * @param: {any} 
         * Author: tttuan 08/11/2022
         */
        handleCloseFormType() {
            this.isShowFormType = false;
        },
        /**
         * @description: Hàm này dùng để mở form chọn tính chất hàng hóa
         * @param: {any} 
         * Author: tttuan 08/11/2022
         */
        handleChangeFormType() {
            this.isShowFormType = true;
        },
        /**
         * @description: Hàm này dùng để thay đổi tính chất hàng hóa
         * @param: {any} 
         * Author: tttuan 08/11/2022
         */
        handleChangeForm(inventoryItemType) {
            this.inventoryItem.inventoryItemType = inventoryItemType; // thay đổi tính chất hàng hóa
            this.handleCloseFormType(); // đóng form chọn tính chất hàng hóa
        },
        /**
        * @description: Hàm này dùng để convert array to string
        * @param: {any} 
        * Author: tttuan 07/11/2022
        */
        convertArrayToString(arr) {
            try {
                return arr.join(';');
            } catch (error) {
                return '';
            }
        },
        /**
         * @description: Hàm này dùng để convert string to array
         * @param: {any}
         * Author: tttuan 07/11/2022
         */
        convertStringToArray(str) {
            try {
                return str.split(';');
            } catch (e) {
                return [];
            }
        },
        /**
        * @description: Kiểm tra dữ liệu có thay đổi hay không
        * @param: {any} 
        * Author: tttuan 26/10/2022
        */
        isChanged() {
            return JSON.stringify(this.inventoryItem) !== JSON.stringify(this.oldInventoryItem);
        },
        /**
        * @description: Hàm xử lý sự kiện đóng form 
        * @param {boolean} foceClose: có bắt buộc đóng form hay không
        * Author: tttuan 22/09/2022
        */
        closeFormHandle(forceClose = false) {
            const self = this;
            try {
                if (self.isChanged()) {
                    self.$refs.popup.show({
                        message: self.$t("notice_message.confirm_data_close"),
                        icon: Enum.ICON.INFO,
                        okButton: self.$t("confirm_popup.yes"),
                        cancelButton: self.$t("confirm_popup.no"),
                        closeButton: self.$t("confirm_popup.cancel"),
                    }).then((confirm) => {
                        switch (confirm) {
                            case self.$t("confirm_popup.yes"):
                                self.saveHandler(Enum.ACTION.SAVE_AND_CLOSE);
                                break;
                            case self.$t("confirm_popup.no"):
                                self.isShowForm = false;
                                break;
                            default:
                                break;
                        }
                    });
                } else if (forceClose || !self.isChanged()) {
                    self.isShowForm = false;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
        * @description: Hàm này dùng để xem các field có hợp lệ hay không
        * @param: {any} 
        * Author: tttuan 26/10/2022
        */
        setValid(fieldName, valid) {
            if (valid.error) {
                this.valids[fieldName] = valid;
            } else {
                delete this.valids[fieldName];
            }
        },
        /**
       * @description: Hàm này thực hiện lưu và update đơn vị tính
       * Author: tttuan 26/10/2022
       */
        saveHandler(action) {
            const self = this;
            self.refs.forEach(ref => {
                self.$refs[ref].handleInputFocusOut();
            });
            if (Object.keys(self.valids).length > 0) { // nếu có lỗi thì in ra lỗi đầu tiên
                self.$refs.popup.show({
                    message: Object.values(self.valids)[0].errorMess,
                    icon: Enum.ICON.ERROR,
                    hideButton: 'true',
                }).then(() => {
                    // focus vào field bị lỗi
                    self.$refs[Object.keys(self.valids)[0]].handleInputFocus();
                });
                return;
            }
            Object.keys(self.inventoryItem).forEach(key => {
                if (self.inventoryItem[key] === '' || self.inventoryItem[key] === null) {
                    delete self.inventoryItem[key];
                }
            });
            switch (action) {
                case Enum.ACTION.SAVE_AND_CLOSE:
                    self.insertData(false);
                    break;
                case Enum.ACTION.SAVE_AND_ADD:
                    self.insertData(true);
                    break;
                default:
                    break;
            }
        },
        /**
         * @description: Hàm này dùng để insert dữ liệu vào database
         * @param {boolean} isReset: có reset form hay không
         * Author: tttuan 26/10/2022
         */
        async insertData(isReset = false) {
            const self = this;
            let message = 'Thêm mới'
            try {
                let result = false;
                if (self.formMode === Enum.FORM_MODE.ADD) {
                    self.inventoryItem.inventoryGroupID = self.convertArrayToString(self.inventoryItem.inventoryGroupID);
                    const res = await api.inventoryItem.save(self.inventoryItem);
                    if (res) {
                        self.inventoryItem.inventoryItemID = res;
                        result = true;
                    }
                } else if (self.formMode === Enum.FORM_MODE.EDIT) {
                    self.inventoryItem.inventoryGroupID = self.convertArrayToString(self.inventoryItem.inventoryGroupID);
                    const res = await api.inventoryItem.update(self.inventoryItem, self.entityId);
                    if (res) {
                        message = 'Cập nhật'
                        result = true;
                    }
                }
                if (result) {
                    self.$emit('newObj', self.inventoryItem);
                    self.$root.$toast.success(`${message} hàng hóa <<b>${self.inventoryItem.inventoryItemCode}</b>> thành công`);
                    if (isReset) {
                        self.resetForm();
                        self.getNewInventoryItemCode();
                    } else {
                        self.isShowForm = false;
                    }
                }
            } catch (error) {
                switch (Number(error.message)) {
                    case Enum.MISAError.Duplicate:
                        self.$refs.popup.showError(`Mã hàng hóa <<b>${self.inventoryItem.inventoryItemCode}</b>> đã tồn tại`);
                        self.$refs.inventoryItemCode.handleShowErrorMessage('Mã hàng hóa đã tồn tại');
                        break;
                    default:
                        self.$refs.popup.showError(self.$t("notice_message.unknown_error"));
                        break;
                }
            }
        },
        /**
         * @description: hàm lấy chi tiết thông tin bản ghi và hiển thị lên form
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        async getDetail() {
            const self = this;
            try {
                self.inventoryItem = await api.inventoryItem.getById(self.entityId);
                if (self.inventoryItem.inventoryGroupID) {
                    self.inventoryItem.inventoryGroupID = self.convertStringToArray(self.inventoryItem.inventoryGroupID);
                }
            } catch (error) {
                self.$refs.popup.show('Lỗi khi lấy thông tin bản ghi');
            }
        },
        /**
         * @description: Hàm này dùng để lấy mã hàng hóa mới
         * @param: {any} 
         * Author: tttuan 06/11/2022
         */
        async getNewInventoryItemCode() {
            try {
                const res = await api.inventoryItem.getMaxCode();
                this.inventoryItem.inventoryItemCode = res;
            } catch (error) {
                this.$refs.popup.show(error.message, 'error');
            }
        },
        /**
        * @description: Hàm này dùng để reset form
        * @param: {any} 
        * Author: tttuan 26/10/2022
        */
        resetForm() {
            let inventoryItemType = this.inventoryItem.inventoryItemType;
            this.inventoryItem = {
                inventoryItemCode: null,
                inventoryItemName: null,
                guarantyPeriod: null,
                inventoryGroupID: ['0eb0136b-ee41-463f-8e8f-9b4f29b7a037'],
                inventoryGroupName: null,
                inventoryItemType: inventoryItemType,
                unitName: null,
                taxReductionType: 1,
                minimumStock: null,
                inventoryItemSource: null,
                description: null,
                purchaseDescription: null,
                saleDescription: null,
                stockID: null,
                stockName: null,
                inventoryAccount: null,
                saleAccount: null,
                discountAccount: null,
                saleOffAccount: null,
                returnAccount: null,
                costAccount: null,
                purchaseDiscountRate: null,
                fixedUnitPrice: null,
                unitPrice: null,
                salePrice: null,
                taxRate: null,
                importTaxRate: null,
                exportTaxRate: null,
                inventoryCategorySpecialTaxName: null,
            };
            this.valids = {};
            if (this.modelValue) {
                this.inputFocus();
            }
        },
        /**
         * @description: Hàm này dùng để truyền object mới vào thêm vào nhóm vật tư hàng hóa
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        insertInventoryGroup(newObj) {
            this.inventoryGroupObj = newObj
        },
        /**
         * @description: Hàm này dùng để truyền object mới vào thêm vào đơn vị tính
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        insertUnit(newObj) {
            this.unitObj = newObj
        },
        /**
         * @description: Hàm này dùng để truyền object mới vào thêm vào kho
         * @param: {any}
         * Author: tttuan 04/11/2022
         */
        insertStock(newObj) {
            this.stockObj = newObj
        },
        /**
         * @description: Hàm này dùng để mở form thêm mới nhóm vật tư hàng hóa
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        onHandleAddInventoryGroup() {
            this.isShowInventoryGroupForm = true;
        },
        /**
         * @description: Hàm này dùng để mở form thêm mới đơn vị tính
         * @param: {any}
         * Author: tttuan 04/11/2022
         */
        onHandleAddUnit() {
            this.isShowUnitForm = true;
        },
        /**
         * @description: Hàm này dùng để mở form thêm mới kho
         * @param: {any}
         * Author: tttuan 04/11/2022
         */
        onHandleAddStock() {
            this.isShowStockForm = true;
        },
        /**
         * @description: hàm này dùng để mở rộng collapse panel
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        changeActivekey(key) {
            this.activeKey = key
        },
        /**
         * @description: hàm này dùng để đóng form
         * @param: {any}
         * Author: tttuan 04/11/2022
         */
        onHandleCloseDialog() {
            this.isShowForm = false
        },
        /**
         * @description: hàm này dùng để focus vào input khi mở form
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        inputFocus() {
            this.$refs.inventoryItemName.handleInputFocus();
        },
    },
    unmounted() {
        this.onHandleCloseDialog()
    },
}
</script>

<style lang="scss" scoped>
.main-header {
    margin-top: 8px;
    align-items: center;
}

.main-icon {
    .ms-icon {
        width: 50px !important;
        height: 50px !important;
    }
}

.sub-title {
    padding: 0 8px 0 14px;
    font-size: 18px;
}

.change-attribute {
    color: #308ccd;
    transition: all .1s ease-in;

    &:hover {
        padding-bottom: 7px;
        transition: all .1s ease-in;
        cursor: pointer;
    }
}

.v-dialog__header {
    padding-bottom: 32px;
}

.v-line {
    margin-top: 16px;
}

.divide-line {
    height: 1px;
    width: 100%;
    background: rgb(212, 215, 220);
    margin: 0;
    padding: 0;
}

.separate-line-upload {
    height: 14px;
    width: 1px;
    background: #d4d7dc;
    margin: 0 10px;
}

.inventory {
    &-form__body {
        padding: 0 20px;
    }

    &-information {}

    &-information__list {
        padding-left: 0;
    }

    &-tax__search {
        display: flex;
        align-items: center;
        color: #308ccd;
        cursor: pointer;
    }

    &-form__basic {
        margin-bottom: 14px;
    }

    &-form__upload {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        padding-top: 22px;
    }

    &-form__upload-image {
        border: 1px solid #e0e0e0;
        min-height: 120px;
        min-width: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &-form__upload-action {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &-information__item {
        cursor: pointer;
        padding: 16px 16px 20px 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(212, 215, 220);
        box-sizing: border-box;

        &:hover {
            background: rgb(245, 245, 245);
        }

    }

    &-information__item--icon {}

    &-information__item--content {
        padding-left: 16px;
        font-size: 13px;


        label {
            font-weight: 700;
            cursor: pointer;

        }

        p {
            margin-top: 8px;
        }
    }


}
</style>