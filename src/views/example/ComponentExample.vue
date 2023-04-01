<template>
    <div class="grid">
        <div class="row">
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">1. Button</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Các loại button dùng trong project</p>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button>Button</v-button>
                                        </div>
                                    </td>
                                    <td>Button mặc định</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button buttonType="secondary">Button</v-button>
                                        </div>
                                    </td>
                                    <td>Button secondary</td>
                                    <td>
                                        <ul>
                                            <li>buttonType: 'secondary'</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">2. Input</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Các loại input dùng trong project</p>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-input placeholder="Placeholder"></v-input>
                                        </div>
                                    </td>
                                    <td>Input không label</td>
                                    <td>
                                        <ul>
                                            <li>placeholder: 'Placeholder'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-input label="Tên label"></v-input>
                                        </div>
                                    </td>
                                    <td>Input có label</td>
                                    <td>
                                        <ul>
                                            <li>label: 'Tên label'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-input placeholder="Tìm theo mã, tên nhân viên" icon="icon-search"
                                                v-model="keyword" :outline="true" className="v-input__with-icon" />
                                        </div>
                                    </td>
                                    <td>Input có icon</td>
                                    <td>
                                        <ul>
                                            <li>icon: 'icon-search'</li>
                                            <li>className: 'v-input__with-icon'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <div class="card-footer-item">
                                                <v-input placeholder="Tìm theo mã, tên nhân viên" icon="icon-search"
                                                    v-model="keyword" :outline="true" className="v-input__with-icon"
                                                    :styleProps="['width: 240px','font-style: italic']" />
                                            </div>
                                        </div>
                                    </td>
                                    <td>Input có chữ nghiêng</td>
                                    <td>
                                        <ul>
                                            <li>styleProps: ['width: 240px','font-style: italic']</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-input label="Tên label" :error="true"></v-input>
                                        </div>
                                    </td>
                                    <td>Input có error</td>
                                    <td>
                                        <ul>
                                            <li>error: true</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">3. Combobox</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Các loại combobox dùng trong project</p>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-combobox propKey="value" propValue="label" :data="options"
                                                v-model="value" placeholder="Chọn một giá trị">
                                            </v-combobox>
                                        </div>
                                    </td>
                                    <td>Combobox mặc định</td>
                                    <td>
                                        <ul>
                                            <li>data: [{value: 1, label: 'Option 1'}, {value: 2, label: 'Option 2'}]
                                            </li>
                                            <li>propKey: 'value'</li>
                                            <li>propValue: 'label'</li>
                                            <li>v-model: value</li>
                                            <li>placeholder: 'Chọn một giá trị'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-combobox propKey="value" propValue="label" :data="options"
                                                v-model="value" placeholder="Chọn một giá trị" :selectBox="true">
                                            </v-combobox>
                                        </div>
                                    </td>
                                    <td>Combobox thành select box</td>
                                    <td>
                                        <ul>
                                            <li>data: [{value: 1, label: 'Option 1'}, {value: 2, label: 'Option 2'}]
                                            </li>
                                            <li>propKey: 'value'</li>
                                            <li>propValue: 'label'</li>
                                            <li>v-model: value</li>
                                            <li>placeholder: 'Chọn một giá trị'</li>
                                            <li>selectBox: true</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-combobox propKey="value" propValue="label" :data="options"
                                                v-model="value" placeholder="Chọn một giá trị" :error="true">
                                            </v-combobox>
                                        </div>
                                    </td>
                                    <td>Combobox error</td>
                                    <td>
                                        <ul>
                                            <li>data: [{value: 1, label: 'Option 1'}, {value: 2, label: 'Option 2'}]
                                            </li>
                                            <li>propKey: 'value'</li>
                                            <li>propValue: 'label'</li>
                                            <li>v-model: value</li>
                                            <li>placeholder: 'Chọn một giá trị'</li>
                                            <li>error: true</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">4. Datepicker</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Datepicker dùng trong project</p>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-date-picker label="Ngày sinh">
                                            </v-date-picker>
                                        </div>
                                    </td>
                                    <td>Datepicker có label</td>
                                    <td>
                                        <ul>
                                            <li>label: 'Ngày sinh'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-date-picker>
                                            </v-date-picker>
                                        </div>
                                    </td>
                                    <td>Datepicker không có label</td>
                                    <td>
                                        <ul>
                                            <li>Không có props</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">5. Toast</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Toast dùng trong project <b>Cần phải khởi tạo v-toast ref="toast"
                                :showProgress="true"</b>
                            <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
                        </p>
                        <v-popup ref="popup"></v-popup>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button @click="showToastInfo" backgroundColor="#4f8de4"
                                                backgroundColorHover="#59adec" backgroundColorFocus="#4f8de4">
                                                Show toast info</v-button>
                                        </div>
                                    </td>
                                    <td>Toast info</td>
                                    <td>
                                        <ul>
                                            <li>Không có props</li>
                                            <li>this.$root.$toast.info(`Thông báo`, {
                                                timeout: 5000,
                                                });</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button @click="showToastError" backgroundColor="#e44f4f"
                                                backgroundColorHover="#ec5959" backgroundColorFocus="#e44f4f">Show toast
                                                error</v-button>
                                        </div>
                                    </td>
                                    <td>Toast error</td>
                                    <td>
                                        <ul>
                                            <li>Không có props</li>
                                            <li>this.$root.$toast.error(`Thông báo`, {
                                                timeout: 5000,
                                                });</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button @click="showToastSuccess">Show toast success</v-button>
                                        </div>
                                    </td>
                                    <td>Toast success</td>
                                    <td>
                                        <ul>
                                            <li>Không có props</li>
                                            <li>this.$root.$toast.success(`Thông báo`, {
                                                timeout: 5000,
                                                });</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-button @click="showToastWarning" backgroundColor="#e4a44f"
                                                backgroundColorHover="#ecb359" backgroundColorFocus="#e4a44f">Show toast
                                                warning</v-button>
                                        </div>
                                    </td>
                                    <td>Toast warning</td>
                                    <td>
                                        <ul>
                                            <li>Không có props</li>
                                            <li>this.$root.$toast.warning(`Thông báo`, {
                                                timeout: 5000,
                                                });</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col c-6 m-y-4">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">6. Tooltip</h1>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Tooltip dùng trong project</p>
                    </div>
                    <div class="card-footer">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Demo</th>
                                    <th>Mô tả</th>
                                    <th>Props</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-tooltip content="Tooltip">
                                                <v-button>Tooltip</v-button>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                    <td>Đây là tooltip động</td>
                                    <td>
                                        <ul>
                                            <li>content: 'Tooltip'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-tooltip content="Tooltip left" :fixed="true" position="left">
                                                <v-button>Tooltip left</v-button>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                    <td>Đây là tooltip left</td>
                                    <td>
                                        <ul>
                                            <li>content: 'Tooltip'</li>
                                            <li>fixed: true</li>
                                            <li>position: 'left'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-tooltip content="Tooltip right" :fixed="true" position="right">
                                                <v-button>Tooltip right</v-button>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                    <td>Đây là tooltip right</td>
                                    <td>
                                        <ul>
                                            <li>content: 'Tooltip'</li>
                                            <li>fixed: true</li>
                                            <li>position: 'right'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-tooltip content="Tooltip top" :fixed="true" position="top">
                                                <v-button>Tooltip top</v-button>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                    <td>Đây là tooltip top</td>
                                    <td>
                                        <ul>
                                            <li>content: 'Tooltip'</li>
                                            <li>fixed: true</li>
                                            <li>position: 'top'</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="card-footer-item">
                                            <v-tooltip content="Tooltip bottom" :fixed="true" position="bottom">
                                                <v-button>Tooltip bottom</v-button>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                    <td>Đây là tooltip bottom</td>
                                    <td>
                                        <ul>
                                            <li>content: 'Tooltip'</li>
                                            <li>fixed: true</li>
                                            <li>position: 'bottom'</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComponentExample',
    data() {
        return {
            options: [
                { value: 1, label: 'Option 1' },
                { value: 2, label: 'Option 2' },
            ],
            value: 1,
            keyword: '',
        };
    },
    methods: {
        showToastSuccess() {
            this.$root.$toast.success(`Thành công`, {
                timeout: 5000,
            });
        },
        showToastWarning() {
            this.$root.$toast.warning(`Cảnh báo`, {
                timeout: 5000,
            });
        },
        showToastError() {
            this.$root.$toast.error(`Lỗi`, {
                timeout: 5000,
            });
        },
        showToastInfo() {
            this.$root.$toast.info(`Thông báo`, {
                timeout: 5000,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.table {
    width: 100%;
    border-collapse: collapse;

    th {
        padding: 10px;
        border: 1px solid #ddd;
    }

    td {
        padding: 20px;
        border: 1px solid #ddd;
    }

}

.card {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 20px;

    .card-header {
        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: #000;
        }
    }

    .card-body {
        .card-text {
            font-size: 14px;
            font-weight: 400;
            color: #000;
        }
    }

    .card-footer {
        .card-footer-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
}
</style>