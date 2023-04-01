<template>
    <div>
        <!-- Khu vực hiển thị dialog form thêm hoặc sửa đơn vị tính -->
        <v-dialog :isShow="modelValue" @close="closeFormHandle(false)" width="500px"
            @onHandleSave="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)"
            @onHandleSaveAndNew="saveHandler(Enum.ACTION.SAVE_AND_ADD)">
            <template #title>
                <div class="content-header__title">
                    {{ titleForm }}
                </div>
            </template>
            <template #body>
                <div class="grid">
                    <div class="row sm-gutter">
                        <div class="form-group col l-6 md-6 c-6">
                            <v-input label="Đơn vị tính" :required="true" v-model="unitObj.unitName" :maxLength="100"
                                errorLabel="Đơn vị tính" ref="unitName" @validate="setValid('unitName', $event)"
                                :focus="true">
                            </v-input>
                        </div>
                        <div class="form-group col l-12 md-12 c-12">
                            <v-input label="Mô tả" type="textarea" v-model="unitObj.description" :maxLength="255">
                            </v-input>
                        </div>
                    </div>
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
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)" buttonType="secondary"
                    :tooltip="$t('action_form.save') + Enum.KEY_DEFINE.CTRL_S">
                    {{ $t('action_form.save') }}
                </v-button>
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_ADD)"
                    :tooltip="$t('action_form.save_and_add') + Enum.KEY_DEFINE.CTRL_SHIFT_S">
                    {{ $t('action_form.save_and_add') }}
                </v-button>
            </template>
        </v-dialog>
        <!-- Khu vực hiển thị các popup cảnh báo -->
        <v-popup ref="popup" :tabIndex="0"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import Enum from "@/utils/enum";
import api from "@/api/index";
export default {
    name: 'UnitForm',
    props: {
        modelValue: { // Dialog form hiển thị
            type: Boolean,
            default: false
        },
        entityId: { // Id đơn vị tính
            type: String,
            default: null
        },
    },
    data() {
        return {
            unitObj: { // Đối tượng đơn vị tính
                unitName: null,
                description: null,
                status: 1
            },
            oldUnitObj: {},
            valids: {}, // Lưu trạng thái validate của các input
            refs: [ // Danh sách các ref của các input để validate
                'unitName',
            ],
            Enum, // Enum
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
         * @description: Thay đổi tên tiêu đề form theo trạng thái của form
         * @param: {any} 
         * Author: tttuan 07/11/2022
         */
        titleForm() {
            if (this.formMode == Enum.FORM_MODE.EDIT) {
                return "Sửa đơn vị tính";
            }
            return "Thêm đơn vị tính";
        },
    },
    watch: {
        modelValue: {
            async handler(isShowForm) {
                const self = this;
                if (isShowForm) {
                    if (self.formMode == Enum.FORM_MODE.EDIT) {
                        await self.getDetail();
                    } else if (self.formMode == Enum.FORM_MODE.DUPLICATE) {
                        await self.getDetail();
                        self.formMode = Enum.FORM_MODE.ADD;
                    } else {
                        self.formMode = Enum.FORM_MODE.ADD;
                    }
                    self.oldUnitObj = JSON.parse(JSON.stringify(self.unitObj));
                }
            },
            deep: true
        },
    },
    methods: {
        /**
         * @description: hàm lấy chi tiết thông tin bản ghi và hiển thị lên form
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        async getDetail() {
            const self = this;
            try {
                self.unitObj = await api.unit.getById(self.entityId);
            } catch (error) {
                self.$refs.popup.showError(`Lấy thông tin đơn vị tính thất bại!`);
            }
        },
        /**
         * @description: Kiểm tra dữ liệu có thay đổi hay không
         * @param: {any} 
         * Author: tttuan 26/10/2022
         */
        isChanged() {
            return JSON.stringify(this.unitObj) !== JSON.stringify(this.oldUnitObj);
        },
        /**
         * @description: Hàm xử lý sự kiện đóng form 
         * @param {boolean} foceClose: có bắt buộc đóng form hay không
         * Author: tttuan 22/09/2022
         */
        closeFormHandle(forceClose = false) {
            const self = this;
            try {
                if (forceClose || !self.isChanged()) {
                    self.onHandleDialogState(false);
                    return;
                }
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
                                self.onHandleDialogState(false);
                                break;
                            default:
                                break;
                        }
                    });
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
         * @description: Hàm này dùng để reset form
         * @param: {any} 
         * Author: tttuan 26/10/2022
         */
        resetForm() {
            this.unitObj = {
                unitName: null,
                description: null,
                status: 1
            };
            this.valids = {};
            this.inputFocus();
        },
        /**
         * @description: Hàm này dùng để set trạng thái đóng mở của dialog
         * @param: {any} 
         * Author: tttuan 26/10/2022
         */
        onHandleDialogState(isOpen = false) {
            this.$emit('update:modelValue', isOpen)
            if (!isOpen) {
                // reset lại form
                this.resetForm();
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
                // focus out để validate
            });
            if (Object.keys(self.valids).length > 0) {
                self.$refs.popup.show({
                    message: Object.values(self.valids)[0].errorMess,
                    icon: Enum.ICON.ERROR,
                    hideButton: 'true',
                }).then(() => {
                    self.$refs[Object.keys(self.valids)[0]].handleInputFocus();
                });
                return;
            }
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
         * Author: tttuan 26/10/2022
         */
        async insertData(isReset = false) {
            const self = this;
            let result = false;
            let message = 'Thêm mới'
            try {
                if (self.formMode === Enum.FORM_MODE.ADD) {
                    const res = await api.unit.save(self.unitObj);
                    if (res) {
                        self.unitObj.unitID = res;
                        result = true;
                    }
                } else if (self.formMode === Enum.FORM_MODE.EDIT) {
                    const res = await api.unit.update(self.unitObj, self.entityId);
                    if (res) {
                        result = true;
                        message = 'Cập nhật'
                    }
                }
                if (result) {
                    self.$emit('newObj', self.unitObj);
                    self.$root.$toast.success(`${message} đơn vị ${self.unitObj.unitName} thành công`);
                    if (isReset) {
                        self.resetForm();
                    } else {
                        self.onHandleDialogState(false);
                    }
                }
            } catch (error) {
                switch (Number(error.message)) {
                    case Enum.MISAError.Duplicate:
                        self.$root.$toast.error(`Đơn vị tính <<b>${self.unitObj.unitName}</b>> đã tồn tại`);
                        self.$refs.unitName.handleShowErrorMessage('Đơn vị tính đã tồn tại');
                        break;
                    default:
                        self.$root.$toast.error(`Có lỗi xảy ra khi ${message} đơn vị tính`);
                        break;
                }
            }
        },
        /**
         * @description: Hàm này sẽ input focus vào input đầu tiên
         * @param: {any} 
         * Author: tttuan 26/10/2022
         */
        inputFocus() {
            this.$refs.unitName.handleInputFocus();
        }
    },
}
</script>
<style>
.v-line {
    margin-top: 16px;
}
</style>