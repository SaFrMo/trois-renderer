import { h, defineComponent } from 'vue'

const createComponent = (tag: string) =>
    defineComponent({
        inheritAttrs: false,
        name: tag,
        render() {
            return h(tag, this.$attrs, this.$slots?.default?.() || [])
        }
    })

export const components = [
    'TroisCanvas',
    'mesh',
    'sphereBufferGeometry',
    'meshStandardMaterial'
].map(createComponent).reduce((acc, curr) => {
    acc[curr.name] = curr
    return acc
})