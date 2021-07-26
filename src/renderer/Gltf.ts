import { defineComponent, h } from '@vue/runtime-core'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
// import { useTrois } from './useThree'
// const trois = useTrois()

export default defineComponent({
    props: {
        src: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            instance: null as any,
        }
    },
    async mounted() {
        const loader = new GLTFLoader()
        const model = await new Promise<GLTF>((res, rej) =>
            loader.load(this.src, res, undefined, rej)
        )

        this.$el.instance.add(model.scene)
    },
    render() {
        return h('group', this.$attrs, this.$slots?.default?.() || [])
    },
})
