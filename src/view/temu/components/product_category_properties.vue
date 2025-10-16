<template>
  <el-drawer :visible.sync="$attrs.visible" title="选择类目" size="70%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px"
             label-position="right">
      <TemuProductCategorySearch :default_account_id="default_account_id" :can_change_account="can_change_account" @select="handleSelect"></TemuProductCategorySearch>
      <TemuProductProperties v-model="form" v-if="form.cat_id"></TemuProductProperties>
    </el-form>
    <div>
      <el-button size="medium" type="primary" style="width: 100%" @click="doConfirm">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>

import TemuProductCategorySearch from "@/view/temu/components/product_category_search.vue";
import TemuProductProperties from "@/view/temu/components/product_properties.vue";
import {
  simpleProductCategoryTemplateQuery,
} from "@/api/temu/simple_product";

export default {
  name: 'TemuDlgProductCategoryProperties',
  components: {TemuProductProperties, TemuProductCategorySearch},
  mixins: [],
  props: {
    default_account_id: {
      type: Number,
    },
    can_change_account: {
      type: Boolean,
    },
    confirm: {
      type: Function,
    }
  },
  data() {
    return {
      form: {
        account_id: undefined,
        cat_id: undefined,
        cat_ids: undefined,
        cat_name: undefined,
        properties: [],
        real_properties: [],
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async handleSelect(event) {
      if (!event.cat_id) {
        return
      }

      let resp = await simpleProductCategoryTemplateQuery({
        account_id: event.account_id,
        id: event.cat_id
      })
      if (resp.code) {
        return
      }
      let template = resp.data
      let properties = []
      for (const property of template.properties) {
        if (property.valueRule === 0) {
          properties.push({ids: [], ...property})
        } else if (property.valueRule === 1) {
          properties.push({id: undefined, number_input_value: 0, ...property})
        } else if (property.valueRule === 2) {
          properties.push({prop_value: undefined, ...property})
        }
      }
      this.form.properties = properties;
      this.form.real_properties = [];
      this.form.account_id = event.account_id
      this.form.cat_id = event.cat_id
      this.form.cat_ids = event.cat_ids
      this.form.cat_name = event.cat_name
    },
    doConfirm() {
      this.confirm(this.form)
    },
    onOpened() {
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>