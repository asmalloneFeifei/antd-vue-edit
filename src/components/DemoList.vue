<template>
  <div>
    <a-table :columns="columns" :data-source="data" bordered>
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template v-for="col in columns" :slot="col" slot-scope="text, record, index">
        <span>{{ text }}</span>
      </template>

      <template slot="operation" slot-scope="text, record, index">
        <a @click="getItem(record, index)">编辑</a>
      </template>
    </a-table>
    <a-modal
      :visible="isVisible"
      title="编辑"
      :width="600"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel">返回</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确认</a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="字段名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写字段名称' }] }]"
            placeholder="请填写字段"
          />
        </a-form-item>
        <a-form-item label="字段类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['type', { rules: [{ required: true, message: '请选择字段类型' }] }]">
            <a-select-option value="单行文本">单行文本</a-select-option>
            <a-select-option value="日期">日期</a-select-option>
            <a-select-option value="单选下拉">单选下拉</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="字段名称"
          v-if="form.getFieldsValue().type =='单行文本'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['text', { rules: [{ required: true, message: '请填写文本' }] }]"
            placeholder="请填写文本"
          />
        </a-form-item>
        <a-form-item
          label="日期类型"
          v-if="form.getFieldsValue().type =='日期'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select v-decorator="['dateType', { rules: [{ required: true, message: '请选择日期类型' }] }]">
            <a-select-option value="年">年</a-select-option>
            <a-select-option value="年-月">年-月</a-select-option>
            <a-select-option value="年-月-日">年-月-日</a-select-option>
            <a-select-option value="年-月-日时：分">年-月-日时：分</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="form.getFieldsValue().type =='单选下拉'">
          <a-form-item label="单选下拉" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              mode="multiple"
              allowClear
              v-decorator="['select', { rules: [{ required: true, message: '请选择单选下拉' }] }]"
            >
              <a-select-option value="选项一">选项一</a-select-option>
              <a-select-option value="选项二">选项二</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox :checked="isCheck" @change="handleChange">是否必填</a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
</a-modal>
</div>
</template>
<script>
const columns = [
  {
    title: "字段名称",
    dataIndex: "name",
    width: "20%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "字段类型",
    dataIndex: "type",
    width: "20%",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "是否必填",
    dataIndex: "isValid",
    width: "15%",
    scopedSlots: { customRender: "isValid" }
  },
  {
    title: "字段选项",
    dataIndex: "options",
    width: "20%",
    scopedSlots: { customRender: "options" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
const data = [
  {
    key: 0,
    name: "字段一",
    type: "单行文本",
    isValid: "是",
    options: "无"
  },
  {
    key: 1,
    name: "字段二",
    type: "日期",
    isValid: "否",
    options: "年-月-日"
  },
  {
    key: 2,
    name: "字段三",
    type: "单选下拉",
    isValid: "否",
    options: "选项一、选项二"
  }
];
export default {
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 13 }, sm: { span: 17 } },
      isCheck: false,
      isShow: false,
      isVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      data,
      columns,
      isShowType: "",
      editIndex: 0
    };
  },
  methods: {
    // 获取item数据
    getItem(data, index) {
      console.log("item", data);
      this.isVisible = true;
      this.editIndex = index;
      this.isCheck = data.isValid == "是" ? true : false;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data });
        console.log("form", this.form.getFieldsValue());
      });
    },
    handleChange(e) {
      this.isCheck = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(["isValid"], { force: true });
      });
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.isVisible = false;
          console.log("Received values of form: ", this.isCheck, values);
          if (values.text) {
            values.options = values.text;
            delete values.text;
          }
          if (values.dateType) {
            values.options = values.dateType;
            delete values.dateType;
          }
          if (values.select) {
            values.options = values.select.join(",");
            delete values.select;
          }
          values.isValid = this.isCheck == true ? "是" : "否";
          this.data[this.editIndex] = values;
          console.log("update-data", this.data[0]);
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.isVisible = false;
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>