<template>
  <div class="ant-card">
    <Spin :spinning="loading">
      <Table
        :columns="tColumns"
        :data-source="tData"
        :pagination=false
        size="middle"
        :row-class-name="() => ('row-rounded')"
      >
        <template #title>Тестовое задание
          <div class="search">
            <span v-if="searchValue.length && searchValue.length < 4">
              <Popover content="Поиск работает от трех символов" trigger="hover">
                <warn></warn>
              </Popover>
            </span>
            <a-input-search
                v-model:value="searchValue"
                placeholder="Найти..."
                style="width: 200px"
                @input="onInput"
            />
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'responsible_name'">
            <a-avatar size="small">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            {{ record.responsible_name }}
          </template>
          <template v-else-if="column.key === 'status_name'">
            <a-tag v-for="tag in record.status_name" :style="{ backgroundColor: statusColors[record.status_name as keyof typeof statusColors], border: 'none'}">
              <span>
              {{ capitalizeFirstLetter(tag) }}
              </span>
            </a-tag>
          </template>
        </template>
        // всплывашка
        <template #expandedRowRender="{ record }">
          <div class="contacts-box">
              <a-avatar size="small">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="contact-name">{{ record.description.name }}</span>
              <ul class="contacts-list">
                <li><a><PhoneOutlined /></a></li>
                <li><a-divider type="vertical" /></li>
                <li><a><MailOutlined /></a></li>
              </ul>
          </div>
        </template>
        <template #expandColumnTitle> </template>
      </Table>
    </Spin>
  </div>
</template>

<style>
@import '../styles/index.css';
</style>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import axios from 'axios';

import type {
  leadDataWithContact,
  tData,
  leadsDataI,
  tableRowWithOptional
} from '@/types/types'
import type { TableColumnsType } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { PhoneOutlined } from '@ant-design/icons-vue';
import { MailOutlined } from '@ant-design/icons-vue';
import TableObj, { leadProperties, getKeys, propsToHeadingsMapping, getEntries, toDateTime, capitalizeFirstLetter, statusColors} from '@/model/tableObj'
import { Table, Popover, Spin } from "ant-design-vue";
import warn from "../assets/icons/exclamation-triangle.vue";


const searchValue = ref<string>('')
const leadsData = ref<leadDataWithContact>([]);
const isAuthenticated = ref<boolean>()
const loading= ref<boolean>(false);

const table = new TableObj()
table.setExpandedRow('description')

function onInput(e: InputEvent) {
  if(searchValue.value && searchValue.value.length < 4) return;

  const value = (e.target as HTMLInputElement).value
  loading.value = true;

  try {
    axios
      .get(`http://localhost:3000/api/leads/filtered?query=${value}`, {
        withCredentials: true,
      })
      .then((response) => {
        leadsData.value = response.data;
      });
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setTimeout(() => loading.value = false,1000)
  }

  searchValue.value = value;
}

onMounted(() => {
  loading.value = true;
  axios
      .get(`http://localhost:3000/api/auth/token`, {
        withCredentials: true,
      })
      .then((response) => {
        setTimeout(() => loading.value = false,1000)

        isAuthenticated.value = Boolean(response.data)
      });
});

watch(isAuthenticated, () => {
  axios
      .get('http://localhost:3000/api/leads/get', {
        withCredentials: true,
      })
      .then((response) => {
        (response.data as leadsDataI).forEach(value => {
          value.price = value.price.toLocaleString()
          value.created_at = toDateTime(value.created_at)
        })
        leadsData.value = response.data;
      });
});

const tData = computed(() => {
  const leadsD: tableRowWithOptional[] = []

  leadsData.value?.forEach(function(lead, index) {
    let leadD: tableRowWithOptional = { key: index };

    getEntries<typeof lead>(lead).forEach(KeyValArr => {
      if (propsToHeadingsMapping[KeyValArr[0]]) {

        if(KeyValArr[1].constructor === Array) {
            leadD[KeyValArr[0] as string] = KeyValArr[1];

          return;
        }

        leadD[KeyValArr[0]] = KeyValArr[1];
      }
    })

    leadsD.push(leadD)
  })

  return leadsD
})


const tColumns = computed(() => {
  let copy = leadsData.value.slice()
  const lead = copy.pop();

  if (!lead) return;

  const cols = getKeys<typeof lead>(lead).reduce(function (
    colDescription,
    leadKey,
  ) {
    if (leadKey !== table.expandedRowName && leadProperties.includes(leadKey)) {
      colDescription.push({
        title: propsToHeadingsMapping[leadKey],

        dataIndex: leadKey,
        key: leadKey,
        ellipsis: true,
      });
    }

    return colDescription;
  }, [] as TableColumnsType);

  table.sortByColumns(cols)

  return cols;
});
</script>
