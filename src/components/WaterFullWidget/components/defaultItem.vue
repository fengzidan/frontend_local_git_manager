<template>
  <div class="tag-content">
    <div class="title">{{ data.parent.codeName }}</div>
    <div class="tags-list">
      <div class="tag-item" v-for="(item, idx) in data.childenTags" :key="idx">
        {{ item.codeName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  props: {
    data: {
      default: () => {
        return {};
      },
    },
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.tag-content {
  background: #162038;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  padding: 14px 10px 24px;
  .title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #d9dfed;
    position: relative;
    margin-left: 14px;
    text-align: left;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -14px;
      background: linear-gradient(180deg, #1381fb 0%, #134efb 100%);
      border-radius: 2px;
      width: 2px;
      height: 100%;
    }
  }
  .tags-list {
    margin-top: 7px;
    .tag-item {
      margin-top: 8px;
      padding: 6px 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #9fb0dd;
      background: #121a32;
      border-radius: 4px;
      text-align: left;
    }
  }
}
</style>
