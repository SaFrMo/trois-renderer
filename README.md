* You can call any method on a target; the return value of that method will be stored in the parent's `$attached` object. For example:

```html
 <mesh>
    <torusKnotGeometry />
    <meshStandardMaterial map="$attached.load">
        <textureLoader :load="['/text-chase/test-word.jpg']" />
    </meshStandardMaterial>
</mesh>
```

`new TextureLoader().load('example-url.jpg')` is called, then the resulting value is passed to the parent's `$attached` object as the property `load`. The value of the method's attribute (`load` in this example) must be an array, just like `:args="[...]"`.