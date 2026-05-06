<template>
  <el-dialog
    v-model="visible"
    title="编辑"
    width="80%"
    center
    align-center
    destroy-on-close
    :show-close="false"
    :append-to-body="false"
    @open="initialDate"
    @close="closeDialog"
    @closed="clearInput(formRef)"
  >
    <div>
      <el-scrollbar>
        <el-form
          ref="formRef"
          class="formDiv_CreateNoteItem"
          :model="formData"
          :rules="formRules"
          :hide-required-asterisk="true"
        >
          <el-form-item
            class="formItem_CreateNoteItem"
            label="标题"
            label-position="top"
            prop="title"
          >
            <el-input v-model="formData.title" spellcheck="false" />
          </el-form-item>
          <el-form-item
            class="formItem_CreateNoteItem"
            label="内容"
            label-position="top"
            prop="content"
          >
            <el-input
              v-model="formData.content"
              spellcheck="false"
              type="textarea"
              :autosize="{ minRows: 4 }"
              resize="none"
            />
          </el-form-item>
          <el-form-item
            class="formItem_CreateNoteItem"
            label="定时通知"
            label-position="top"
            prop="content"
          >
            <div class="formItem_notificationItem">
              <span>类型</span>
              <el-select
                v-model="formData.notificationOptions"
                placeholder="Select"
                style="width: 200px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div
              v-if="formData.notificationOptions === 'once'"
              class="formItem_notificationTimePicker"
            >
              <el-time-picker
                v-model="notificationTime"
                format="HH:mm"
                placeholder="请选择通知时间"
              />
            </div>
            <div v-if="formData.notificationOptions === 'day'">每日执行 显示时间选项</div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="option_CreateNoteItem">
      <el-button type="danger" @click="clearInput(formRef)">清空</el-button>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveFormData(formRef)">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const viewName = 'EditNoteItem'
// 该组件应为全局唯一 放置于 #app 模板下

import { computed, ref } from 'vue'
import { FormInstance } from 'element-plus'
import { Data_NoteItem } from '@renderer/utils/dataStoreInterface'
import { color_BrandPrimaryColor } from '@renderer/utils/color'
import { useNoteItemsStore } from '@renderer/pinia/store/ViewComponentData'
import { useCompEditNoteItemStore } from '@renderer/pinia/store/GlobalComponentData'

const noteItemsStore = useNoteItemsStore()
const compEditNoteItemStore = useCompEditNoteItemStore()

const visible = computed({
  get: () => compEditNoteItemStore.isShow,
  set: () => compEditNoteItemStore.disable()
})

const formRef = ref<FormInstance>()
const formRules = {
  title: [{ required: true, message: '需要拥有标题', trigger: 'blur' }]
}

const formData = ref<Data_NoteItem>({
  id: '',
  title: '',
  content: '',
  check: false,
  notificationOptions: 'none'
})

const options = [
  {
    value: 'none',
    label: '不发送'
  },
  {
    value: 'once',
    label: '执行一次'
  },
  {
    value: 'day',
    label: '每天'
  }
]

const notificationTime = ref()

const initialDate = () => {
  formData.value.id = compEditNoteItemStore.id
  formData.value.title = compEditNoteItemStore.title
  formData.value.content = compEditNoteItemStore.content
  formData.value.check = compEditNoteItemStore.check
  formData.value.notificationOptions = compEditNoteItemStore.notificationOptions
}

const closeDialog = () => {
  compEditNoteItemStore.disable()
}

const clearInput = (formInstance: FormInstance | undefined) => {
  if (formInstance) {
    formInstance.resetFields()
    formData.value.notificationOptions = 'none'
    notificationTime.value = ''
  }
}

const saveFormData = async (formInstance: FormInstance | undefined) => {
  if (formInstance) {
    await formInstance.validate((valid, errorFields) => {
      if (valid) {
        console.log(`[${viewName}] ` + '✅ 校验成功')
        console.log(`[${viewName}] ` + 'now alter note item...')
        console.log(`[${viewName}] ` + 'id: ' + formData.value.id)
        console.log(`[${viewName}] ` + 'title: ' + formData.value.title)
        console.log(`[${viewName}] ` + 'content: ' + formData.value.content)

        let tempNoteItem: Data_NoteItem = {
          id: formData.value.id,
          title: formData.value.title,
          content: formData.value.content,
          check: formData.value.check,
          notificationOptions: formData.value.notificationOptions
        }

        window.electron.ipcRenderer.invoke('noteItem_alter', tempNoteItem).then((_res: boolean) => {
          if (_res) {
            noteItemsStore.reloadNoteItemsData()
            compEditNoteItemStore.disable()
            formInstance.resetFields()
          } else {
            console.error(`[${viewName}] ` + 'add note item failed !!!')
          }
        })
      } else {
        console.log(`[${viewName}] ` + '❌ 校验失败 错误字段：', errorFields)
      }
    })
  } else {
    console.error(`[${viewName}] ` + 'save form data failed !!')
  }
}
</script>

<style scoped lang="scss">
.contentText {
  white-space: pre-wrap;
}

.content_CreateNoteItem {
  height: calc(100% - 90px);
  width: 100%;
}

.option_CreateNoteItem {
  height: 50px;
  width: 80%;
  margin: auto;
  text-align: right;
  padding: 10px 10px;
}

:deep(.formItem_CreateNoteItem) {
  margin-bottom: 25px;
}

.formDiv_CreateNoteItem {
  text-align: center;
}

:deep(.el-form-item.asterisk-left.el-form-item--label-top) {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px v-bind(color_BrandPrimaryColor);
}

.formItem_notificationItem {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.formItem_notificationTimePicker {
  margin-top: 10px;
  width: 100%;
}
</style>
