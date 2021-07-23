import { App, ToRefs } from '@vue/runtime-core'
import { Trois } from '../../renderer/types'
import * as POST from 'postprocessing'
import { addAfterRender } from '../../renderer/useThree'
import EffectComposer from './EffectComposer.vue'

// this is an example of how to create a trois plugin

interface PostprocessingInterface {
    app: App<Trois.Element>
    extend: Function
    trois: ToRefs<Trois.Internals>
}

export const usePostprocessing = ({ app, extend, trois }: PostprocessingInterface) => {
    // we're going to take over `EffectComposer` for this plugin,
    // so let's give the vanruesc version a different name
    const obj = {} as any
    Object.keys(POST).forEach(key => {
        if (key === 'EffectComposer') {
            obj['VanruescEffectComposer'] = POST[key]
        } else {
            obj[key] = POST[key]
        }
    })
    extend({ app, ...obj })

    // register our own effect composer
    app.component('EffectComposer', EffectComposer)

    trois.autoAttach.value.push('composer', 'pass')
    trois.runDefaultRenderFunction.value = false
}