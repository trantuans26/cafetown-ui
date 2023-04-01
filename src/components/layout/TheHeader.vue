<template>
    <div class="header">
        <div class="d-flex align-items-center flex-shrink">
            <v-tooltip :content="$t('sidebar.menu_action.collapse')" v-if="!collapsed">
                <div class="ms-24 ms-icon ms-icon-three-stripes ml-x-2" @click="toggleSidebar"></div>
            </v-tooltip>
            <v-dropdown icon="ms-16 ms-icon ms-icon-chevron-big-down" :backgroundActive="false"
                :items="[{ 'key': '', 'value': 'CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ QUI PHÚC' }]">
                <v-tooltip content="CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ QUI PHÚC">
                    CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ QUI PHÚC
                </v-tooltip>
            </v-dropdown>
        </div>
        <div class="d-flex align-items-center flex-shrink">
            <v-dropdown icon="ms-16 ms-icon ms-icon-chevron-big-down" className="pl-l-1" :items="languages"
                propKey="language" propValue="title" @onSelect="changeLocale" :value="currentLanguage">
                {{ $t('common.select_lang') }}
                <template #item="item">
                    <flag :iso="item.option.flag" v-bind:squared=false /> {{ item.option.title }}
                </template>
            </v-dropdown>
            <v-tooltip :content="$t('common.notification')">
                <div class="ms-24 ms-icon ms-icon-bell"></div>
            </v-tooltip>
            <div class="header__user d-flex align-items-center p-x-3 ml-r-3">
                <div class="ms-32 ms-icon ms-round ms-icon-small-user ms-l-2"></div>
                <div class="m-2 font-weight-600 font-size-13 cursor-pointer">Trần Thái Tuấn</div>
                <div class="ms-14 ms-icon ms-icon-chevron-down"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Enum from '@/utils/enum';
export default {
    name: "TheHeader",
    props: {
        collapsed: { // Sidebar có collapsed hay không
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            languages: [
                { flag: 'vn', language: 'vi', title: 'Tiếng Việt' },
                { flag: 'us', language: 'en', title: 'English' }
            ] // Danh sách các ngôn ngữ,

        }
    },
    computed: {
        // Lấy ngôn ngữ hiện tại
        currentLanguage() {
            return this.$i18n.locale;
        }
    },
    watch: {
        $store: {
            handler: function (val) {
                if (val.getters.getActionKey === Enum.ACTION.COLLAPSE) { // nếu actionKey = COLLAPSE
                    this.toggleSidebar();
                }
            },
            deep: true
        }
    },
    methods: {
        /**
         * @description: Hàm này dùng để đóng mở sidebar 
         * Author: tttuan 11/10/2022
         */
        toggleSidebar() {
            this.$emit('toggleSidebar')
        },
        /**
         * @description: Hàm này dùng để thay đổi ngôn ngữ
         * Author: tttuan 11/10/2022
         */
        changeLocale(language) {
            // lưu ngôn ngữ vào localstorage
            localStorage.setItem('amis-language', language)
            // thay đổi ngôn ngữ
            this.$i18n.locale = language;
        }
    },
}
</script>
