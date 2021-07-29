<template>
    <component
        :is="dictionary[cmpDate].is"
        v-if="dictionary[cmpDate]"
        v-bind="dictionary[cmpDate]"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Table from '../../table/TableComponent.vue'

export default defineComponent({
    components: { Table },
    props: {
        year: String,
        month: String,
        date: String,
        position: { type: Array, default: () => [0, 0, 0] },
    },
    setup() {
        return {
            dictionary: {
                '2021-07-24': { is: 'Table', position: [0, 0, 0.5] },
            },
        }
    },
    computed: {
        cmpDate() {
            return `${this.year}-${this.month}-${this.date}`
        },
    },
})
</script>
