# CSS

## em rem
> 有一个比较普遍的误解，认为 `em` 单位是相对于父元素的字体大小。 事实上，根据W3标准 ，它们是相对于使用 `em` 单位的元素的字体大小。
>
> rem 单位取决于 `html` 元素的 `font-size`

## rem 适配

`scss` 的 `function px2rem`
```scss
@function px2rem($px) {
  $rem : 37.5px;
  @return ($px/$rem) + rem;
}
```
这样，当我们写具体数值的时候就可以写成：
```scss
height: px2rem(90px);
width: px2rem(90px);
```
[何时使用 Em 与 Rem](https://webdesign.tutsplus.com/zh-hans/tutorials/comprehensive-guide-when-to-use-em-vs-rem--cms-23984)

[移动web适配利器-rem](http://www.alloyteam.com/2016/03/mobile-web-adaptation-tool-rem/)