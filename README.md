⚠️ **This repo is no longer maintained** - please see [LunchboxJS]() for further work on a Vue 3/ThreeJS renderer. ⚠️

# Trois Renderer

⚠️ **This is a work in progress - expect significant changes to the codebase!** ⚠️

* [Full Documentation](https://trois-renderer-wip-docs.netlify.app/renderer/)
* [Installation](https://trois-renderer-wip-docs.netlify.app/renderer/installation.html)

A Vue 3 custom renderer for [Three.js](https://threejs.org/).

You can use it to create 3D scenes using code like this:

```html
<TroisCanvas background="white">
  <mesh :position-z="-5">
    <sphereGeometry />
    <meshBasicMaterial :wireframe="true" color="black" />
  </mesh>
</TroisCanvas>
```

*Trois* is a French word, it means *Three*.

The Trois renderer uses several concepts introduced in [react-three-fiber](https://github.com/pmndrs/react-three-fiber) - thank you to the creators and maintainers of that project!

By members of the TroisJS team & [Breakfast Studio](https://breakfaststudio.co/).
