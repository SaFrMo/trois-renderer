<template>
    <component
        :is="dictionary[cmpDate]?.is"
        v-if="dictionary[cmpDate]"
        v-bind="dictionary[cmpDate]?.bind ?? {}"
    />
    <!-- empty day fallback -->
    <!-- <mesh :scale="0.5" v-else>
        <icosahedronGeometry :args="[1, 4]" />
    </mesh> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Boxfield from '../../boxfield/BoxfieldComponent.vue'
import CalendarExample from './CalendarExample.vue'
import DioramaComponent from '../../diorama/components/DioramaComponent.vue'
import EventComponent from '../../events/Events/EventComponent.vue'
import SumComponent from '../../instance-sum/SumComponent.vue'
import Table from '../../table/TableComponent.vue'
import WiresComponent from '../../instance-wires/WiresComponent.vue'

export default defineComponent({
    components: {
        Boxfield,
        CalendarExample,
        DioramaComponent,
        EventComponent,
        SumComponent,
        Table,
        WiresComponent,
    },
    props: {
        year: String,
        month: String,
        date: String,
        position: { type: Array, default: () => [0, 0, 0] },
    },
    setup() {
        return {
            dictionary: {
                '2021-08-01': {
                    is: 'DioramaComponent',
                    bind: {
                        'position-z': 0.2,
                    },
                },
                '2021-07-30': {
                    is: 'CalendarExample',
                    bind: {
                        'position-y': 0.75,
                        'position-z': 0.5,
                    },
                },
                '2021-07-29': {
                    is: 'Boxfield',
                    bind: {
                        'position-z': 0.5,
                        scale: 0.6,
                        opacity: 0.8,
                        count: 200,
                        size: 0.1,
                    },
                },
                '2021-07-28': {
                    is: 'EventComponent',
                    bind: { 'position-z': 0.5 },
                    spread: 50,
                },
                '2021-07-26': {
                    is: 'SumComponent',
                    bind: {
                        position: [0, 0, 0.5],
                        count: 40,
                        columns: 1,
                        floor: 0.4,
                        'rotation-y': Math.PI * 0.25,
                        'rotation-x': Math.PI * -0.1,
                        y: -0.5,
                        scale: 0.25,
                    },
                },
                '2021-07-25': {
                    is: 'WiresComponent',
                    bind: { position: [0, 0, 0.5], count: 40, columns: 8 },
                },
                '2021-07-24': {
                    is: 'Table',
                    bind: { position: [0, 0, 0.5] },
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
