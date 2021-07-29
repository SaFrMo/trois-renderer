<template>
    <component
        :is="dictionary[cmpDate]?.is"
        v-if="dictionary[cmpDate]"
        v-bind="dictionary[cmpDate]?.bind ?? {}"
    />
    <mesh :scale="0.5" v-else>
        <icosahedronGeometry :args="[1, 4]" />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Table from '../../table/TableComponent.vue'
import WiresComponent from '../../instance-wires/WiresComponent.vue'

export default defineComponent({
    components: { Table, WiresComponent },
    props: {
        year: String,
        month: String,
        date: String,
        position: { type: Array, default: () => [0, 0, 0] },
    },
    setup() {
        return {
            dictionary: {
                '2021-07-24': {
                    is: 'Table',
                    bind: { position: [0, 0, 0.5] },
                },
                '2021-07-25': {
                    is: 'WiresComponent',
                    bind: { position: [0, 0, 0.5], count: 40, columns: 8 },
                },
            },
        }
    },
    computed: {
        cmpDate() {
            return `${(this as any).year}-${(this as any).month}-${
                (this as any).date
            }`
        },
    },
})
</script>
