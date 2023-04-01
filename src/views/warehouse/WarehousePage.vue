<template>
    <div class="warehouse">
        <div class="warehouse-content">
            <div class="warehouse-process">
                <div class="warehouse-process__area">
                    <div class="warehouse-title">Nghiệp vụ kho</div>
                    <div class="warehouse-process__content">
                        <div class="warehouse-process-dictionary"></div>
                        <div class="warehouse-process__text hoverable production-order">
                            <div class="title-button">Lệnh sản xuất</div>
                        </div>
                        <div class="warehouse-process__text hoverable assemble-dismantling-order">
                            <div class="title-button">Lắp ráp, tháo dỡ</div>
                        </div>
                        <div class="warehouse-process__text hoverable export-inventory">
                            <div class="title-button">Xuất kho</div>
                        </div>
                        <div class="warehouse-process__text hoverable transfer">
                            <div class="title-button">Chuyển kho</div>
                        </div>
                        <div class="warehouse-process__text hoverable in-inward">
                            <div class="title-button">Nhập kho</div>
                        </div>
                        <div class="warehouse-process__text hoverable outward-price">
                            <div class="title-button">Tính giá xuất kho</div>
                        </div>
                        <div class="warehouse-process__text hoverable audit">
                            <div class="title-button">Kiểm kê</div>
                        </div>
                    </div>
                </div>
                <div class="warehouse-process__utility">
                    <router-link to="/kho" class="warehouse-process__item hoverable">
                        <div class="warehouse-process__item-content">
                            <div class="ms-24 ms-icon ms-icon-process-stock">
                            </div>
                            <div class="text">Kho</div>
                        </div>
                    </router-link>
                    <router-link to="/vat-tu-hang-hoa" class="warehouse-process__item hoverable">
                        <div class="warehouse-process__item-content">
                            <div class="ms-24 ms-icon ms-icon-process-inventory"></div>
                            <div class="text">Vật tư hàng hóa</div>
                        </div>
                    </router-link>
                    <router-link to="/don-vi-tinh" class="warehouse-process__item hoverable">
                        <div class="warehouse-process__item-content">
                            <div class="ms-24 ms-icon ms-icon-process-unit-price"></div>
                            <div class="text">Đơn vị tính</div>
                        </div>
                    </router-link>
                    <div class="warehouse-process__item hoverable">
                        <div class="warehouse-process__item-content">
                            <div class="ms-24 ms-icon ms-icon-process-tool">
                            </div>
                            <div class="text">Tiện ích</div>
                        </div>
                    </div>
                    <div class="warehouse-process__item hoverable">
                        <div class="warehouse-process__item-content">
                            <div class="ms-24 ms-icon ms-icon-process-setting">
                            </div>
                            <div class="text">Tùy chọn</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="warehouse-report">
                <div class="warehouse-title">Báo cáo</div>
                <div class="warehouse-report_favourite">
                    <ul>
                        <li>
                            Sổ chi tiết vật tư hàng hóa
                        </li>
                        <li>
                            Tổng hợp tồn kho
                        </li>
                        <li>
                            Báo cáo đối chiếu kho và sổ cái
                        </li>
                        <li>
                            Báo cáo hàng tồn kho theo chứng từ nhập
                        </li>
                        <li>
                            Báo cáo tiến độ sản xuất
                        </li>
                    </ul>
                </div>
                <div class="warehouse-footer">
                    Tất cả báo cáo
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WarehousePage',
}
</script>

<style lang="scss" scoped>
.warehouse {
    flex-direction: column;
    justify-content: center;
    overflow: auto;
    background-color: #eceef1;
    width: 100%;
    height: 100%;
    display: flex;
}

.warehouse-content {
    width: 100%;
    display: flex;
    justify-content: center;
}

.warehouse-process {}

.warehouse-process__text {
    width: 90px;
    padding-top: 60px;
    position: absolute;
    transition: all .2s ease;
    text-align: center;
}

.production-order {
    top: 25px;
    left: 31px;
    width: 120px !important;
}

.assemble-dismantling-order {
    top: 215px;
    left: 32px;
    width: 110px !important;
    height: unset !important;
    padding: 0 10px;
    padding-top: 65px !important;
}

.export-inventory {
    top: 42px;
    left: 234px;
}

.transfer {
    top: 42px;
    left: 376px;
}

.in-inward {
    top: 222px;
    left: 256px;
}

.outward-price {
    top: 222px;
    padding-top: 65px !important;
    height: unset !important;
    left: 374px;
    width: 125px !important;
}

.audit {
    left: 534px;
    top: 222px;
    padding-top: 65px !important;
    height: unset !important;
}

.warehouse-process-dictionary {
    background-image: url("@/assets/img/qt_Kho.10b11e5a.svg");
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    height: 340px;
}

.warehouse-process__area {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    width: 690px;
    height: 380px;
}

.warehouse-process__content {
    // margin-top: 150px;
    position: relative;
}

.warehouse-process__utility {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    margin-top: 10px;
    height: 70px;
    display: flex;
    width: 100%;
}

.warehouse-process__item {
    &:not(:last-child) {
        border-right: 1px solid #e5e5e5;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-decoration: none;
    color: black;
}

.hoverable {
    &:hover {
        cursor: pointer;
        box-shadow: 4px 4px #babec5;
        box-shadow: 0 3px 6px rgb(0 0 0 / 25%);
    }
}

.warehouse-process__item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.warehouse-report {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    margin-left: 10px;
    width: 300px;
    height: 460px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.warehouse-title {
    text-transform: uppercase;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    border-bottom: 1px solid #e5e5e5;
}



.warehouse-report_favourite {
    flex: 1;
    overflow: auto;
    min-height: 0;

    ul {
        margin: 0;
        padding: 0 16px;
    }

    li {
        display: flex;
        align-items: center;
        padding: 16px 0;
        height: 74px;

        &:hover {
            cursor: pointer;
            color: #0075c0;
        }

        &:not(:last-child) {
            border-bottom: 1px solid #e5e5e5;
        }
    }
}

.warehouse-footer {
    border-top: 1px solid #e5e5e5;
    cursor: pointer;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: #0075c0;
}
</style>