---
title: Thresholds
layout: single
---

<figure class="half">
    <a href="{{ '/assets/images/thresholds_1.png' | relative_url }}"><img src="{{ '/assets/images/thresholds_1.png' | relative_url }}"></a>
    <a href="{{ '/assets/images/thresholds_2.png' | relative_url }}"><img src="{{ '/assets/images/thresholds_2.png' | relative_url }}"></a>
    <figcaption></figcaption>
</figure>

Several widgets have the ability to represent threshold lines through the `options` attributes.

Those thresholds have to be configured setting a color and a label as description.

```json
{
  "thresholds": [
    { "value": 200000000, "color": "red", "label": "Threshold 1" },
    { "value": 100000000, "color": "#000000", "label": "Threshold 2" }
  ]
}
```
