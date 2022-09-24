<template>
  <div>
    <a-table :columns="columns" :data-source="data" bordered>
      <template
        v-for="col in ['name', 'age', 'address']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>

      <template slot="operation" slot-scope="text, record, index">
        <a @click="getItem(record, false)">编辑</a>
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
        <a-form-item label="字段名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写字段名称' }] }]"
            placeholder="请填写字段"
          />
        </a-form-item>
        <a-form-item label="字段类型">
          <a-select
            default-value="1"
            v-decorator="['type', { rules: [{ required: true, message: '请选择字段类型' }] }]"
          >
            <a-select-option value="1">单行文本</a-select-option>
            <a-select-option value="2">日期</a-select-option>
            <a-select-option value="3">单选下拉</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="字段名称">
          <a-input
            v-decorator="['text', { rules: [{ required: true, message: '请填写文本' }] }]"
            placeholder="请填写文本"
          />
        </a-form-item>
        <a-form-item label="日期类型">
          <a-select
            default-value="1"
            v-decorator="['dateType', { rules: [{ required: true, message: '请选择日期类型' }] }]"
          >
            <a-select-option value="1">年</a-select-option>
            <a-select-option value="2">年-月</a-select-option>
            <a-select-option value="3">年-月-日</a-select-option>
            <a-select-option value="4">年-月-日时：分</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="单选下拉">
          <a-select
            default-value="1"
            v-decorator="['select', { rules: [{ required: true, message: '请选择日期类型' }] }]"
          >
            <a-select-option value="1">选项一</a-select-option>
            <a-select-option value="2">选项二</a-select-option>
          </a-select>
        </a-form-item>
        <!--<a-form-item>
          <a-checkbox :checked="isCheck" @change="handleChange">是否必填</a-checkbox>
        </a-form-item>-->
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
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//     name: `字段 ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`
//   });
// }
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      isCheck: false,
      isVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      data,
      columns,
      editingKey: ""
    };
  },
  methods: {
    // 获取item数据
    getItem(data) {
      console.log("item", data);
      this.isVisible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: "设置值"
        });
      });
      //  this.tableHeaderCoverForm.setFieldsValue({name: '2333'},'keys')
      console.log("form", this.form.getFieldsValue());
    },
    handleChange(e) {
      this.isCheck = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(["nickname"], { force: true });
      });
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.isVisible = true;
          console.log("Received values of form: ", values);
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
    },

    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    handleOk() {}
    // edit(key) {
    //   const newData = [...this.data];
    //   const target = newData.find(item => key === item.key);
    //   this.editingKey = key;
    //   if (target) {
    //     target.editable = true;
    //     this.data = newData;
    //   }
    // },
    // save(key) {
    //   const newData = [...this.data];
    //   const newCacheData = [...this.cacheData];
    //   const target = newData.find(item => key === item.key);
    //   const targetCache = newCacheData.find(item => key === item.key);
    //   if (target && targetCache) {
    //     delete target.editable;
    //     this.data = newData;
    //     Object.assign(targetCache, target);
    //     this.cacheData = newCacheData;
    //   }
    //   this.editingKey = "";
    // },
    // cancel(key) {
    //   const newData = [...this.data];
    //   const target = newData.find(item => key === item.key);
    //   this.editingKey = "";
    //   if (target) {
    //     Object.assign(
    //       target,
    //       this.cacheData.find(item => key === item.key)
    //     );
    //     delete target.editable;
    //     this.data = newData;
    //   }
    // }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
