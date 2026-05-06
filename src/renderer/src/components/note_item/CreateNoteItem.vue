<template>
  <el-dialog
    v-model="compCreateNoteItemStore.isShow"
    title="添加"
    width="80%"
    destroy-on-close
    center
    align-center
    :show-close="false"
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
const viewName = 'CreateNoteItem'

// 该组件应为全局唯一 放置于 #app 模板下
// 用于创建便签Item

import { color_BrandPrimaryColor } from '@renderer/utils/color'
import { useCompCreateNoteItemStore } from '@renderer/pinia/store/GlobalComponentData'
import { ref } from 'vue'
import { Data_NoteItem } from '@renderer/utils/dataStoreInterface'
import { FormInstance } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { useNoteItemsStore } from '@renderer/pinia/store/ViewComponentData'

const noteItemsStore = useNoteItemsStore()
const compCreateNoteItemStore = useCompCreateNoteItemStore()

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

const closeDialog = () => {
  compCreateNoteItemStore.disable()
}

const clearInput = (formInstance: FormInstance | undefined) => {
  if (formInstance) {
    formInstance.resetFields()
  }
}

const saveFormData = async (formInstance: FormInstance | undefined) => {
  if (formInstance) {
    await formInstance.validate((valid, errorFields) => {
      if (valid) {
        console.log(`[${viewName}] ` + '✅ 校验成功')
        console.log(`[${viewName}] ` + 'now save form data...')

        formData.value.id = uuidv4()

        console.log(`[${viewName}] ` + 'id: ' + formData.value.id)
        console.log(`[${viewName}] ` + 'title: ' + formData.value.title)
        console.log(`[${viewName}] ` + 'content: ' + formData.value.content)

        let tempNoteItem: Data_NoteItem = {
          id: formData.value.id,
          title: formData.value.title,
          content: formData.value.content,
          check: false,
          notificationOptions: 'none'
        }

        window.electron.ipcRenderer.invoke('noteItem_add', tempNoteItem).then((_res: boolean) => {
          if (_res) {
            noteItemsStore.reloadNoteItemsData()
            compCreateNoteItemStore.disable()
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
</style>
